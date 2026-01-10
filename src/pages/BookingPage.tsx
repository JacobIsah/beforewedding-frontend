import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Calendar, Clock, Video, MessageCircle, CheckCircle, XCircle, AlertCircle, Users, User, Loader2 } from 'lucide-react';
import { CounselorCalendar } from '../components/CounselorCalendar';

const API_BASE_URL = 'https://beforewedding.duckdns.org';

type SessionType = 'video' | 'in-person';
type SessionDuration = '50' | '80';
type AppointmentType = 'single' | 'couple';

interface Counselor {
  id: number;
  professional_name: string;
  hourly_rate: string;
  specialties: string[];
}

export function BookingPage() {
  const { counselorId } = useParams<{ counselorId: string }>();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sessionType, setSessionType] = useState<SessionType>('video');
  const [sessionDuration, setSessionDuration] = useState<SessionDuration>('50');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('couple');
  const [notification, setNotification] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    alternateDate: '',
    alternateTime: '',
    concerns: '',
    goals: '',
    previousCounseling: '',
    urgencyLevel: 'normal',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchCounselorDetails();
  }, [counselorId]);

  const fetchCounselorDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/counselors/${counselorId}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch counselor details');
      }

      const data = await response.json();
      setCounselor(data);
    } catch (err) {
      setError('Unable to load counselor information. Please try again.');
      console.error('Error fetching counselor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlotSelection = (date: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDate: date,
      preferredTime: time
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to book a session');
        setSubmitting(false);
        return;
      }

      // Create booking request
      const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counselor_id: counselorId,
          appointment_type: appointmentType,
          session_type: sessionType,
          session_duration: parseInt(sessionDuration),
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          alternate_date: formData.alternateDate || null,
          alternate_time: formData.alternateTime || null,
          concerns: formData.concerns,
          goals: formData.goals,
          previous_counseling: formData.previousCounseling,
          urgency_level: formData.urgencyLevel,
          additional_notes: formData.additionalNotes || null,
          status: 'pending',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to create booking');
      }

      // Navigate to payment with booking ID
      navigate('/payment', { 
        state: { 
          bookingId: data.id,
          counselorName: counselor?.professional_name || 'the counselor',
          appointmentType,
          sessionType,
          sessionDuration,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          amount: calculateAmount(),
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating your booking');
      setNotification('error');
      setTimeout(() => setNotification('idle'), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAmount = () => {
    const basePrice = sessionDuration === '50' ? 150 : 225;
    const multiplier = appointmentType === 'couple' ? 1.5 : 1;
    return basePrice * multiplier;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading counselor information...</p>
        </div>
      </div>
    );
  }

  if (error && !counselor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Unable to Load Counselor</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/counselors-marketplace')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Counselors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(`/counselor/${counselorId}`)}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl text-gray-900">DuringCourtship</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Notification */}
      {notification === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-green-900 mb-1">Booking Request Sent!</h3>
                <p className="text-sm text-green-700">
                  Your consultation request has been sent to {counselorName}. You&apos;ll receive a confirmation email with next steps shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {notification === 'error' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 mb-1">Booking Failed</h3>
                <p className="text-sm text-red-700">
                  We couldn&apos;t process your booking request. Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">
            Book a Consultation
          </h1>
          <p className="text-lg text-gray-600">
            Schedule your session with {counselor?.professional_name || 'the counselor'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Appointment Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-4">Appointment Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAppointmentType('couple')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  appointmentType === 'couple'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-6 h-6 ${appointmentType === 'couple' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className="text-gray-900">Couple Session</div>
                    <div className="text-sm text-gray-600">For you and your partner</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAppointmentType('single')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  appointmentType === 'single'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-6 h-6 ${appointmentType === 'single' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className="text-gray-900">Single Session</div>
                    <div className="text-sm text-gray-600">For you only</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Session Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-4">Session Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSessionType('video')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  sessionType === 'video'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Video className={`w-6 h-6 ${sessionType === 'video' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className="text-gray-900">Video Session</div>
                    <div className="text-sm text-gray-600">Meet online via video call</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('in-person')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  sessionType === 'in-person'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className={`w-6 h-6 ${sessionType === 'in-person' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className="text-gray-900">In-Person Session</div>
                    <div className="text-sm text-gray-600">Meet at counselor&apos;s office</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Session Duration */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-4">Session Duration</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSessionDuration('50')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  sessionDuration === '50'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-6 h-6 ${sessionDuration === '50' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className="text-gray-900">50 Minutes</div>
                    <div className="text-sm text-gray-600">Standard session</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionDuration('80')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  sessionDuration === '80'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-6 h-6 ${sessionDuration === '80' ? 'text-purple-600' : 'text-gray-600'}`} />
                  <div className="text-left">
                    <div className="text-gray-900">80 Minutes</div>
                    <div className="text-sm text-gray-600">Extended session</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Preferred Schedule */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6">Preferred Schedule</h2>
            
            {/* Calendar Component */}
            <CounselorCalendar 
              counselorId={counselorId!}
              onSelectSlot={handleSlotSelection}
              selectedDate={formData.preferredDate}
              selectedTime={formData.preferredTime}
            />
            
            {/* Display selected date/time */}
            {formData.preferredDate && formData.preferredTime && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 text-purple-900">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>
                    Selected: {new Date(formData.preferredDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })} at {formData.preferredTime}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Session Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-4">Session Details</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="concerns" className="block text-sm text-gray-700 mb-2">
                  What are your main concerns or challenges? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="concerns"
                  name="concerns"
                  required
                  rows={4}
                  value={formData.concerns}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Share what brings you to counseling..."
                />
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm text-gray-700 mb-2">
                  What do you hope to achieve through counseling? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="goals"
                  name="goals"
                  required
                  rows={4}
                  value={formData.goals}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe your goals and what success looks like for you..."
                />
              </div>

              <div>
                <label htmlFor="previousCounseling" className="block text-sm text-gray-700 mb-2">
                  Have you or your partner attended couples counseling before? <span className="text-red-500">*</span>
                </label>
                <select
                  id="previousCounseling"
                  name="previousCounseling"
                  required
                  value={formData.previousCounseling}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  <option value="no">No, this is our first time</option>
                  <option value="yes-together">Yes, we&apos;ve been together before</option>
                  <option value="yes-individual">Yes, one of us has been individually</option>
                  <option value="yes-both">Yes, both of us have been individually</option>
                </select>
              </div>

              <div>
                <label htmlFor="urgencyLevel" className="block text-sm text-gray-700 mb-2">
                  How urgent is your need for counseling? <span className="text-red-500">*</span>
                </label>
                <select
                  id="urgencyLevel"
                  name="urgencyLevel"
                  required
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="normal">Normal - Within the next 2-4 weeks</option>
                  <option value="soon">Soon - Within the next week</option>
                  <option value="urgent">Urgent - As soon as possible</option>
                </select>
              </div>

              <div>
                <label htmlFor="additionalNotes" className="block text-sm text-gray-700 mb-2">
                  Additional Notes or Questions (Optional)
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Any other information the counselor should know..."
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-2">
                  <strong>What happens next:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Your booking request will be sent to {counselor?.professional_name || 'the counselor'}</li>
                  <li>You&apos;ll receive a confirmation email within 24 hours</li>
                  <li>The counselor will confirm your appointment time or suggest alternatives</li>
                  <li>You&apos;ll receive session details and any pre-session materials</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/counselor/${counselorId}`)}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.preferredDate || !formData.preferredTime}
              className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                'Continue to Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}