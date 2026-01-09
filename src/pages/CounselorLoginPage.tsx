import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Heart } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://3.107.197.17/api/auth/counselor/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          setError(data.error);
        } else if (data.email || data.password) {
          const errorMessages = [];
          if (data.email) errorMessages.push(data.email[0]);
          if (data.password) errorMessages.push(data.password[0]);
          setError(errorMessages.join(' '));
        } else {
          setError('Login failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      if (data.access_token && data.refresh_token) {
        localStorage.setItem('counselor_access_token', data.access_token);
        localStorage.setItem('counselor_refresh_token', data.refresh_token);
        localStorage.setItem('counselor_user', JSON.stringify(data.user));
      }

      setIsLoading(false);
      navigate('/counselor-dashboard');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DuringCourtship</h1>
          <p className="text-purple-200">Counselor Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-600">Sign in to access your counselor dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counselor@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New counselor?{" "}
              <button 
                className="text-purple-600 hover:underline font-medium" 
                onClick={() => navigate('/counselor-application')}
              >
                Apply to join
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20">
          <p className="text-xs text-white text-opacity-75 text-center">
            Having trouble signing in? Contact support@duringcourtship.com
          </p>
        </div>
      </div>
    </div>
  );
}
