import { Heart, UserPlus, LogIn, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function AcceptInvitation() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
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
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl text-gray-900 mb-3">
              You&apos;ve Been Invited!
            </h1>
            <p className="text-gray-600 mb-2">
              Your partner has invited you to join them on DuringCourtship.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Sign up or log in to accept the invitation and start your journey together.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/signup?invite=${token || ''}`)}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </button>
              <button
                onClick={() => navigate(`/login?invite=${token || ''}`)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Already have an account? Log In
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
