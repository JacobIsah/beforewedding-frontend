import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, Video, MessageSquare, MoreVertical, Download, Loader2, CheckCircle, XCircle } from "lucide-react";

const API_BASE_URL = 'https://beforewedding.duckdns.org';

interface Appointment {
  id: string;
  coupleName: string;
  date: string;
  time: string;
  sessionType: string;
  status: "upcoming" | "confirmed" | "pending" | "completed" | "cancelled";
  sessionNumber: number;
  totalSessions: number;
  notes?: string;
}

export function AppointmentsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('counselor_access_token');
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/counselors/appointments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAllAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    setUpdating(appointmentId);
    try {
      const token = localStorage.getItem('counselor_access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/counselors/appointments/${appointmentId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      // Refresh appointments list
      await fetchAppointments();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    setUpdating(appointmentId);
    try {
      const token = localStorage.getItem('counselor_access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/counselors/appointments/${appointmentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }

      // Refresh appointments list
      await fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.sessionType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || appointment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[var(--color-success)] bg-opacity-10 text-[var(--color-success)]";
      case "pending":
        return "bg-[var(--color-warning)] bg-opacity-10 text-[var(--color-warning)]";
      case "upcoming":
        return "bg-[var(--color-primary-teal)] bg-opacity-10 text-[var(--color-primary-teal)]";
      case "completed":
        return "bg-[var(--color-primary-blue)] bg-opacity-10 text-[var(--color-primary-blue)]";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[var(--color-text-dark)]">All Appointments</h2>
          <p className="text-[var(--color-text-gray)] mt-1">
            Manage and view all your counseling sessions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary-teal)] hover:bg-[var(--color-accent-teal)] text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm">Export Schedule</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-gray)]" />
            <input
              type="text"
              placeholder="Search by couple name or session type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--color-text-gray)]" />
              <div className="flex gap-2 flex-wrap">
                {["all", "upcoming", "confirmed", "pending", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      filterStatus === status
                        ? "bg-[var(--color-primary-teal)] text-white"
                        : "bg-[var(--color-bg-light)] text-[var(--color-text-gray)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-gray)]">
              {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-600 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-gray-900 mb-1">{appointment.coupleName}</h3>
                        <p className="text-sm text-gray-500">{appointment.sessionType}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Session {appointment.sessionNumber} of {appointment.totalSessions}
                      </div>
                    </div>

                    {appointment.notes && (
                      <p className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 relative">
                  {updating === appointment.id ? (
                    <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                  ) : (
                    <>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors" title="Join Video Call">
                        <Video className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors" title="Message Client">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === appointment.id ? null : appointment.id)}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      
                      {showActionMenu === appointment.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Confirm Appointment
                            </button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                              Mark as Completed
                            </button>
                          )}
                          <button
                            onClick={() => cancelAppointment(appointment.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
