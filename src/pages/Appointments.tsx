import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Calendar, Video, MapPin, Clock, User, Phone, CheckCircle, X as XIcon, Filter, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beforewedding.duckdns.org/api';

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

// API Response Types (matching actual API)
interface ApiAppointment {
  id: number;
  counselor_name: string;
  scheduled_date: string;
  duration_minutes: number;
  session_fee: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

interface CounselorDetails {
  id: number;
  name: string;
  credentials?: string;
  specializations: string[];
  rating?: number;
  reviewCount?: number;
  yearsExperience: number;
  location?: string;
  image?: string;
  hourly_rate: string;
}

interface ApiAppointmentDetail {
  id: number;
  couple: number;
  counselor: number;
  counselor_details: CounselorDetails;
  couple_details: {
    id: number;
    user1_email: string;
    user2_email: string;
  };
  scheduled_date: string;
  duration_minutes: number;
  session_notes: string;
  session_fee: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  completion_report: string | null;
  completed_date: string | null;
  transaction?: {
    id: number;
    amount: string;
    status: string;
    payout_date: string | null;
  };
  created_at: string;
  updated_at: string;
}

// UI Display Type
interface Appointment {
  id: number;
  counselor: string;
  counselorEmail: string;
  counselorPhone: string;
  date: string;
  time: string;
  duration: string;
  type: 'Video Call' | 'In-Person' | 'Phone Call';
  location?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  sessionFee?: string;
  counselorDetails?: CounselorDetails;
}

// Helper functions
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Map API status to UI status
const mapApiStatus = (status: string): 'confirmed' | 'pending' | 'completed' | 'cancelled' => {
  return status === 'scheduled' ? 'pending' : status as any;
};

const transformApiAppointment = (apiAppointment: ApiAppointment): Appointment => {
  return {
    id: apiAppointment.id,
    counselor: apiAppointment.counselor_name,
    counselorEmail: '',
    counselorPhone: '',
    date: formatDate(apiAppointment.scheduled_date),
    time: formatTime(apiAppointment.scheduled_date),
    duration: `${apiAppointment.duration_minutes} minutes`,
    type: 'Video Call',
    status: mapApiStatus(apiAppointment.status),
    sessionFee: apiAppointment.session_fee,
  };
};

export function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Get auth token
  const getAuthToken = () => localStorage.getItem('access_token');

  // Fetch appointments from API
  const fetchAppointments = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('Please log in to view appointments');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/couple-appointments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch appointments');
      }

      const data = await response.json();
      const transformedAppointments = data.appointments.map(transformApiAppointment);
      setAppointments(transformedAppointments);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointment details
  const fetchAppointmentDetails = async (appointmentId: number) => {
    const token = getAuthToken();
    if (!token) return;

    setDetailLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointment details');
      }

      const data: ApiAppointmentDetail = await response.json();
      
      // Update the selected appointment with full details
      const detailedAppointment: Appointment = {
        id: data.id,
        counselor: data.counselor_details.name,
        counselorEmail: '',
        counselorPhone: '',
        date: formatDate(data.scheduled_date),
        time: formatTime(data.scheduled_date),
        duration: `${data.duration_minutes} minutes`,
        type: 'Video Call',
        status: mapApiStatus(data.status),
        notes: data.session_notes,
        sessionFee: data.session_fee,
        counselorDetails: data.counselor_details,
      };

      setSelectedAppointment(detailedAppointment);
    } catch (err) {
      console.error('Failed to fetch appointment details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Load appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    fetchAppointmentDetails(appointment.id);
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    if (filter === 'upcoming') {
      return appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
    }
    return appointments.filter(a => a.status === filter);
  };

  const filteredAppointments = getFilteredAppointments();
  const upcomingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to cancel appointment');
        return;
      }

      // Update local state
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ));
      setSelectedAppointment(null);
      
      // Refresh appointments list
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call':
        return <Video className="w-4 h-4" />;
      case 'In-Person':
        return <MapPin className="w-4 h-4" />;
      case 'Phone Call':
        return <Phone className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">Confirmed</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-full">Pending</span>;
      case 'completed':
        return <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Cancelled</span>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <DashboardSidebar
          currentPage="appointments"
          onNavigateToDashboard={() => navigate('/dashboard')}
          onNavigateToMaterials={() => navigate('/materials')}
          onNavigateToCompatibilityTest={() => navigate('/compatibility-test')}
          onNavigateToNotifications={() => navigate('/notifications')}
          onNavigateToAccount={() => navigate('/account')}
          onNavigateToHelp={() => navigate('/help')}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <DashboardSidebar
          currentPage="appointments"
          onNavigateToDashboard={() => navigate('/dashboard')}
          onNavigateToMaterials={() => navigate('/materials')}
          onNavigateToCompatibilityTest={() => navigate('/compatibility-test')}
          onNavigateToNotifications={() => navigate('/notifications')}
          onNavigateToAccount={() => navigate('/account')}
          onNavigateToHelp={() => navigate('/help')}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900 mb-2">Unable to load appointments</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchAppointments();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <DashboardSidebar
        currentPage="appointments"
        onNavigateToDashboard={() => navigate('/dashboard')}
        onNavigateToMaterials={() => navigate('/materials')}
        onNavigateToCompatibilityTest={() => navigate('/compatibility-test')}
        onNavigateToNotifications={() => navigate('/notifications')}
        onNavigateToAccount={() => navigate('/account')}
        onNavigateToHelp={() => navigate('/help')}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6">
          <h1 className="text-3xl mb-2">Appointments</h1>
          <p className="text-blue-100">Manage your counseling sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl text-gray-900">{upcomingCount}</div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl text-gray-900">{completedCount}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-3xl text-gray-900">{appointments.length}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Book Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All ({appointments.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Completed ({completedCount})
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === 'cancelled'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>

            <button
              onClick={() => navigate('/counselors-marketplace')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book New Session
            </button>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? 'You haven\'t booked any sessions yet.'
                    : `No ${filter} appointments.`}
                </p>
                <button
                  onClick={() => navigate('/counselors-marketplace')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Counselors
                </button>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left: Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl text-gray-900 mb-1">
                            {appointment.counselor}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(appointment.type)}
                              {appointment.type}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      {appointment.location && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{appointment.location}</span>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex lg:flex-col gap-2 lg:w-48">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                        <>
                          <button className="flex-1 lg:flex-none px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="flex-1 lg:flex-none px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl text-gray-900">Appointment Details</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading details...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>

                {/* Session Fee */}
                {selectedAppointment.sessionFee && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Session Fee</span>
                    <span className="text-xl font-semibold text-blue-600">${selectedAppointment.sessionFee}</span>
                  </div>
                )}

                {/* Counselor Info */}
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Counselor Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedAppointment.counselor}</span>
                    </div>
                    {selectedAppointment.counselorDetails && (
                      <>
                        <div className="text-sm text-gray-600 mt-2">
                          {selectedAppointment.counselorDetails.yearsExperience} years of experience
                        </div>
                        {selectedAppointment.counselorDetails.specializations && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedAppointment.counselorDetails.specializations.map((specialty, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Session Details */}
                <div>
                  <h3 className="text-lg text-gray-900 mb-3">Session Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Date</div>
                      <div className="text-gray-900">{selectedAppointment.date}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Time</div>
                      <div className="text-gray-900">{selectedAppointment.time}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Duration</div>
                      <div className="text-gray-900">{selectedAppointment.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Type</div>
                      <div className="text-gray-900">{selectedAppointment.type}</div>
                    </div>
                  </div>
                </div>

                {/* Location/Meeting Link */}
                {selectedAppointment.location && (
                  <div>
                  <h3 className="text-lg text-gray-900 mb-2">Location</h3>
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{selectedAppointment.location}</span>
                  </div>
                </div>
              )}

              {selectedAppointment.meetingLink && selectedAppointment.status !== 'cancelled' && (
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">Meeting Link</h3>
                  <a
                    href={selectedAppointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    <span>Join Video Call</span>
                  </a>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">Notes</h3>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'pending') && (
                  <>
                    <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(selectedAppointment.id)}
                      className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
                {selectedAppointment.status === 'completed' && (
                  <button 
                    onClick={() => navigate('/counselors-marketplace')}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Follow-up Session
                  </button>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
