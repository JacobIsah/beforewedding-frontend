import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, CreditCard, Lock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'https://3.107.197.17';

interface LocationState {
  bookingId: number;
  counselorName: string;
  appointmentType: 'single' | 'couple';
  sessionType: 'video' | 'in-person';
  sessionDuration: string;
  preferredDate: string;
  preferredTime: string;
  amount: number;
}

interface PaymentProps {
  counselorName?: string;
  appointmentType?: 'single' | 'couple';
  sessionType?: 'video' | 'in-person';
  sessionDuration?: '50' | '80';
  preferredDate?: string;
  preferredTime?: string;
  onNavigateBack?: () => void;
  onPaymentComplete?: () => void;
}

export function Payment({ 
  counselorName: propCounselorName, 
  appointmentType: propAppointmentType,
  sessionType: propSessionType, 
  sessionDuration: propSessionDuration, 
  preferredDate: propPreferredDate, 
  preferredTime: propPreferredTime,
  onNavigateBack,
  onPaymentComplete
}: PaymentProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Use state from router if available, fallback to props
  const bookingId = state?.bookingId;
  const counselorName = state?.counselorName || propCounselorName || 'the counselor';
  const appointmentType = state?.appointmentType || propAppointmentType || 'couple';
  const sessionType = state?.sessionType || propSessionType || 'video';
  const sessionDuration = state?.sessionDuration || propSessionDuration || '50';
  const preferredDate = state?.preferredDate || propPreferredDate || '';
  const preferredTime = state?.preferredTime || propPreferredTime || '';
  const totalPrice = state?.amount || 150;

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingZip: ''
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate price based on session duration and appointment type
  const basePrice = sessionDuration === '50' ? 150 : 225;
  const appointmentMultiplier = appointmentType === 'couple' ? 1.5 : 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substring(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (value.length > 5) value = value.substring(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    // Format billing zip
    if (name === 'billingZip') {
      value = value.replace(/\D/g, '').substring(0, 5);
    }

    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Process payment
      const paymentResponse = await fetch(`${API_BASE_URL}/api/payments/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: totalPrice,
          payment_method: 'card',
          card_number: paymentData.cardNumber.replace(/\s/g, ''),
          card_name: paymentData.cardName,
          expiry_date: paymentData.expiryDate,
          cvv: paymentData.cvv,
          billing_zip: paymentData.billingZip,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || paymentResult.detail || 'Payment failed');
      }

      // Update booking status to confirmed
      const bookingResponse = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'confirmed',
          payment_id: paymentResult.id,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error('Payment processed but booking confirmation failed');
      }

      // Navigate to success page or dashboard
      if (onPaymentComplete) {
        onPaymentComplete();
      } else {
        navigate('/dashboard', { 
          state: { 
            message: 'Booking confirmed! You will receive a confirmation email shortly.' 
          } 
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => onNavigateBack ? onNavigateBack() : navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl text-gray-900 mb-2">Payment</h1>
              <p className="text-gray-600">Complete your booking with {counselorName}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-red-900 mb-1">Payment Failed</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Cardholder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm text-gray-700 mb-2">
                        Expiry <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm text-gray-700 mb-2">
                        ZIP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="billingZip"
                        value={paymentData.billingZip}
                        onChange={handleInputChange}
                        placeholder="12345"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">Your payment is secure</p>
                  <p className="text-blue-700">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ${totalPrice.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Counselor</span>
                  <span className="text-gray-900">{counselorName}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Appointment Type</span>
                  <span className="text-gray-900 capitalize">{appointmentType}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Session Type</span>
                  <span className="text-gray-900 capitalize">{sessionType === 'in-person' ? 'In-Person' : 'Video Call'}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900">{sessionDuration} minutes</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preferred Date</span>
                  <span className="text-gray-900">{preferredDate}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Preferred Time</span>
                  <span className="text-gray-900">{preferredTime}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Session ({sessionDuration} min)</span>
                  <span className="text-gray-900">${basePrice.toFixed(2)}</span>
                </div>

                {appointmentType === 'couple' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Couple Session (50% extra)</span>
                    <span className="text-gray-900">${(basePrice * 0.5).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-gray-900">Total</span>
                  <span className="text-2xl text-purple-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="mb-1">What happens next?</p>
                    <ul className="text-amber-700 space-y-1 list-disc list-inside">
                      <li>You&apos;ll receive a confirmation email</li>
                      <li>Counselor will confirm your appointment</li>
                      <li>Meeting link sent 24 hours before session</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
