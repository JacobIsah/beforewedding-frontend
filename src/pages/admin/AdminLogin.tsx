import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.107.197.17';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://3.107.197.17/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.detail || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Store admin tokens
      if (data.access_token && data.refresh_token) {
        localStorage.setItem('admin_access_token', data.access_token);
        localStorage.setItem('admin_refresh_token', data.refresh_token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      }

      setIsLoading(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl text-gray-900 text-center">DuringCourtship</h1>
            <p className="text-gray-600 text-center mt-1">Admin Portal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need to create first admin?{" "}
              <button 
                className="text-purple-600 hover:underline font-medium" 
                onClick={() => navigate('/admin/register')}
              >
                Register Super Admin
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">\n            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600">
                This portal is restricted to authorized administrators only. All access is logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
