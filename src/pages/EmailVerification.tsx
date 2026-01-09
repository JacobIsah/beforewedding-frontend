import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Heart, CheckCircle, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.107.197.17/api';

export function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('access_token');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/auth/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResendError(data.error || data.message || 'Failed to resend verification email');
      } else {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (err) {
      setResendError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setCheckError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setCheckError('Please log in again to check verification status.');
        setIsChecking(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckError(data.error || 'Failed to check verification status');
        setIsChecking(false);
        return;
      }

      if (data.email_verified) {
        navigate('/dashboard');
      } else {
        setCheckError('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (err) {
      setCheckError('Network error. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl text-gray-900">DuringCourtship</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-purple-600" />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-3xl text-gray-900 mb-3">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-2">
              We&apos;ve sent a verification link to:
            </p>
            <p className="text-purple-600">
              {email}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="mb-1">Check your inbox and click the verification link to activate your account.</p>
                <p className="text-gray-600">Don&apos;t forget to check your spam folder if you don&apos;t see it.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {checkError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{checkError}</span>
              </div>
            )}

            <button
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "I've Verified My Email"
              )}
            </button>

            {resendError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{resendError}</span>
              </div>
            )}

            <button
              onClick={handleResendEmail}
              disabled={isResending || resendSuccess}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : resendSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Email Sent!
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Wrong email address?{' '}
            <button className="text-purple-600 hover:text-purple-700">
              Update your email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
