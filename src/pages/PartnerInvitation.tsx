import { useState } from 'react';
import { Heart, Users, Send, Mail, Copy, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://3.107.197.17';

interface PartnerInvitationProps {
  userName: string;
  onInvitationSent: () => void;
}

interface InvitationResponse {
  message: string;
  invitation_id: number;
  is_resend: boolean;
}

interface ApiError {
  error?: string;
  detail?: string;
}

export function PartnerInvitation({ userName, onInvitationSent }: PartnerInvitationProps) {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [customMessage, setCustomMessage] = useState(
    `I've started using DuringCourtship to help us build a stronger foundation for our future together. I'd love for you to join me so we can grow together on this journey. ❤️`
  );
  const [isSending, setIsSending] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [invitationId, setInvitationId] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResend, setIsResend] = useState(false);

  // Get auth token from storage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Generate invitation link for sharing (frontend URL with token would come from backend)
  const getInviteLink = () => {
    // In production, this would use a token from the API response
    return `${window.location.origin}/accept-invitation`;
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to send an invitation');
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/couples/invite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: partnerEmail,
        }),
      });

      const data: InvitationResponse | ApiError = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.error || errorData.detail || 'Failed to send invitation');
      }

      const successData = data as InvitationResponse;
      setInvitationId(successData.invitation_id);
      setIsResend(successData.is_resend);
      setInvitationSent(true);

      // Wait a moment to show success before redirecting
      setTimeout(() => {
        onInvitationSent();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = () => {
    const link = getInviteLink();
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleResendInvitation = async () => {
    if (!invitationId) return;
    
    setIsSending(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to resend an invitation');
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/couples/invitations/${invitationId}/resend/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Please wait before resending. Try again later.');
        }
        throw new Error(data.error || 'Failed to resend invitation');
      }

      // Show success feedback
      setError(null);
      alert('Invitation resent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelInvitation = async () => {
    if (!invitationId) return;
    
    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to cancel an invitation');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/couples/invitations/${invitationId}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel invitation');
      }

      // Reset form state
      setInvitationSent(false);
      setInvitationId(null);
      setPartnerEmail('');
      setPartnerName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const defaultMessages = [
    `I've started using DuringCourtship to help us build a stronger foundation for our future together. I'd love for you to join me so we can grow together on this journey. ❤️`,
    `I found this amazing platform that can help us prepare for our marriage. Join me on DuringCourtship and let's strengthen our relationship together!`,
    `Let's take the next step in our journey together! I've signed up for DuringCourtship and would love for you to join me. This will help us build an even stronger foundation.`
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
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
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-red-600 hover:text-red-800 mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {!invitationSent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl text-gray-900 mb-3">
                  Invite Your Partner
                </h1>
                <p className="text-gray-600">
                  DuringCourtship works best when you grow together. Invite your partner to join you on this journey.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSendInvitation} className="space-y-6">
                {/* Partner Name */}
                <div>
                  <label htmlFor="partnerName" className="block text-sm text-gray-700 mb-2">
                    Partner&apos;s Name
                  </label>
                  <input
                    type="text"
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter their name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Partner Email */}
                <div>
                  <label htmlFor="partnerEmail" className="block text-sm text-gray-700 mb-2">
                    Partner&apos;s Email
                  </label>
                  <input
                    type="email"
                    id="partnerEmail"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="partner@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Custom Message */}
                <div>
                  <label htmlFor="customMessage" className="block text-sm text-gray-700 mb-2">
                    Personal Message
                  </label>
                  <textarea
                    id="customMessage"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  
                  {/* Quick message templates */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Quick message ideas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {defaultMessages.map((msg, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCustomMessage(msg)}
                          className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                        >
                          Template {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-gray-700">
                    <strong className="text-purple-900">What happens next?</strong>
                    <br />
                    Your partner will receive an email with a unique invitation link. When they sign up using this link, your accounts will automatically be connected as a couple.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Invitation
                    </>
                  )}
                </button>

                {/* Skip Option */}
                <button
                  type="button"
                  onClick={onInvitationSent}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  I&apos;ll invite them later
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl lg:text-3xl text-gray-900 mb-3">
                  {isResend ? 'Invitation Resent!' : 'Invitation Sent!'}
                </h2>
                <p className="text-gray-600 mb-8">
                  We&apos;ve sent an invitation to <strong>{partnerEmail}</strong> with your personal message.
                </p>

                {/* Invitation Link */}
                <div className="mb-8">
                  <label className="block text-sm text-gray-700 mb-2 text-left">
                    Invitation Link (you can share this directly)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getInviteLink()}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      {linkCopied ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-6">
                  <p className="text-sm text-gray-700">
                    <Mail className="w-4 h-4 inline mr-1 text-amber-600" />
                    Your partner will receive an email shortly. Once they create their account, you&apos;ll both be connected and can start your journey together!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleResendInvitation}
                    disabled={isSending}
                    className="flex-1 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isSending ? 'Sending...' : 'Resend Invitation'}
                  </button>
                  <button
                    onClick={handleCancelInvitation}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel Invitation
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
