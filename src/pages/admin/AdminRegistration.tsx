import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type RegistrationMode = 'super-admin' | 'regular-admin';

export function AdminRegistration() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RegistrationMode>('super-admin');
  
  // Form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    
    if (!email || !email.includes('@')) {
      errors.email = ['Please enter a valid email address'];
    }
    
    if (!firstName) {
      errors.first_name = ['First name is required'];
    }
    
    if (!lastName) {
      errors.last_name = ['Last name is required'];
    }
    
    if (!password || password.length < 8) {
      errors.password = ['Password must be at least 8 characters'];
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSuperAdminRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://beforewedding.duckdns.org/api/auth/admin/create-super-admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          password,
          is_superuser: true
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError(data.error || 'Super admin already exists. Please login or contact existing admin.');
        } else if (response.status === 400) {
          if (data.email) {
            setValidationErrors({ email: data.email });
          } else {
            setError(data.error || 'Registration failed. Please check your information.');
          }
        } else {
          setError('Registration failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  const handleRegularAdminRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setError('Authentication required. Please login as super admin.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://beforewedding.duckdns.org/api/auth/admin/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          password,
          is_superuser: isSuperuser
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          if (data.email) {
            setValidationErrors({ email: data.email });
          } else {
            setError(data.error || 'Registration failed. Please check your information.');
          }
        } else if (response.status === 403) {
          setError('Permission denied. Only super admins can create admin users.');
        } else {
          setError('Registration failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      // Reset form
      setTimeout(() => {
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setConfirmPassword('');
        setIsSuperuser(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = mode === 'super-admin' ? handleSuperAdminRegistration : handleRegularAdminRegistration;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-600 via-pink-700 to-rose-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-pink-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Registration</h1>
          <p className="text-pink-200">Create administrator account</p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setMode('super-admin')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === 'super-admin'
                ? 'bg-white text-pink-700 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Super Admin
          </button>
          <button
            onClick={() => setMode('regular-admin')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              mode === 'regular-admin'
                ? 'bg-white text-pink-700 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Regular Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Info Banner */}
          {mode === 'super-admin' ? (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">First-time Setup</p>
                  <p className="text-blue-700">
                    Create the initial super admin account. This can only be done once.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-medium mb-1">Super Admin Required</p>
                  <p className="text-amber-700">
                    You must be logged in as a super admin to create new admin users.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    {mode === 'super-admin' 
                      ? 'Super admin created successfully!'
                      : 'Admin user created successfully!'}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {mode === 'super-admin' 
                      ? 'Redirecting to login...'
                      : 'Form has been reset.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2 font-medium">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      validationErrors.first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.first_name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2 font-medium">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Admin"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                      validationErrors.last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.last_name[0]}</p>
                )}
              </div>
            </div>

            {/* Email */}
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
                  placeholder="admin@example.com"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email[0]}</p>
              )}
            </div>

            {/* Password */}
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
                  placeholder="Enter password (min 8 characters)"
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    validationErrors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
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
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2 font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword[0]}</p>
              )}
            </div>

            {/* Super User Checkbox (Regular Admin Mode Only) */}
            {mode === 'regular-admin' && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  id="isSuperuser"
                  type="checkbox"
                  checked={isSuperuser}
                  onChange={(e) => setIsSuperuser(e.target.checked)}
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-0.5"
                  disabled={isLoading}
                />
                <label htmlFor="isSuperuser" className="text-sm text-gray-700">
                  <span className="font-medium">Grant Super Admin Privileges</span>
                  <p className="text-gray-600 mt-1">
                    This user will have full administrative access including the ability to create other admin users.
                  </p>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  {mode === 'super-admin' ? 'Create Super Admin' : 'Create Admin User'}
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button 
                className="text-pink-600 hover:underline font-medium"
                onClick={() => navigate('/admin/login')}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20">
          <p className="text-xs text-white text-opacity-75 text-center">
            {mode === 'super-admin' 
              ? 'Super admin accounts have full access to all platform features and can create additional admin users.'
              : 'Need help? Contact your super administrator or support at support@duringcourtship.com'}
          </p>
        </div>
      </div>
    </div>
  );
}
