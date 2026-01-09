import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ArrowLeft, Eye, EyeOff, CheckCircle2, Users, Loader2 } from 'lucide-react';

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partnerInviteCode = searchParams.get('invite') || undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    relationshipStatus: '',
    partnerName: '',
    partnerEmail: '',
    hearAboutUs: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToMarketing: false
  });

  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    return hasMinLength && hasUpperCase && hasNumber;
  };

  const validatePasswordMatch = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (!validatePassword(formData.password)) {
      setPasswordError('Password does not meet requirements');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const isPartnerFieldsRequired = formData.relationshipStatus !== 'planning';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!validatePasswordMatch()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Map gender values to single letters
      const genderMap: { [key: string]: string } = {
        'male': 'M',
        'female': 'F',
        'other': 'O',
        'prefer-not-to-say': 'P'
      };

      // Map hearAboutUs values
      const hearAboutUsMap: { [key: string]: string } = {
        'social-media': 'social_media',
        'search-engine': 'search_engine',
        'friend-referral': 'friend_referral',
        'counselor': 'counselor',
        'blog': 'blog',
        'podcast': 'podcast',
        'other': 'other'
      };

      const payload: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: genderMap[formData.gender] || formData.gender,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        relationshipStatus: formData.relationshipStatus,
        partnerName: formData.partnerName,
        partnerEmail: formData.partnerEmail,
        hearAboutUs: hearAboutUsMap[formData.hearAboutUs] || formData.hearAboutUs,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
        agreeToPrivacy: formData.agreeToPrivacy,
        agreeToMarketing: formData.agreeToMarketing,
      };

      const response = await fetch('http://3.107.197.17/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        const data = await response.json();
        setSuccessMessage(data.message);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/email-verification');
        }, 2000);
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setPasswordError('An error occurred. Please check your connection and try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (partnerInviteCode) {
      setFormData(prev => ({
        ...prev,
        partnerEmail: partnerInviteCode
      }));
    }
  }, [partnerInviteCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl text-gray-900">DuringCourtship</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-900">{successMessage}</p>
                <p className="text-xs text-green-700 mt-2">Redirecting to login...</p>
              </div>
            )}
            {partnerInviteCode && (
              <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-purple-900">You&apos;ve been invited by your partner!</span>
                </div>
                <p className="text-xs text-purple-700">
                  Complete your registration to connect your accounts and start your journey together
                </p>
              </div>
            )}
            <h1 className="text-3xl lg:text-4xl text-gray-900 mb-3">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Start your journey to a stronger relationship foundation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Location
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm text-gray-700 mb-2">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="California"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Los Angeles"
                  />
                </div>
              </div>
            </div>

            {/* Relationship Information */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Relationship Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="relationshipStatus" className="block text-sm text-gray-700 mb-2">
                    Current Relationship Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relationshipStatus"
                    name="relationshipStatus"
                    required
                    value={formData.relationshipStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="dating">Dating</option>
                    <option value="engaged">Engaged</option>
                    <option value="courtship">In Courtship</option>
                    <option value="planning">Planning to Start Dating</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="partnerName" className="block text-sm text-gray-700 mb-2">
                    Partner&apos;s Full Name {isPartnerFieldsRequired && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    id="partnerName"
                    name="partnerName"
                    required={isPartnerFieldsRequired}
                    value={formData.partnerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="partnerEmail" className="block text-sm text-gray-700 mb-2">
                    Partner&apos;s Email Address {isPartnerFieldsRequired && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    id="partnerEmail"
                    name="partnerEmail"
                    required={isPartnerFieldsRequired}
                    value={formData.partnerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="partner@example.com"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    We&apos;ll send your partner an invitation to join and complete the assessment together
                  </p>
                </div>

                <div>
                  <label htmlFor="hearAboutUs" className="block text-sm text-gray-700 mb-2">
                    How did you hear about us? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="hearAboutUs"
                    name="hearAboutUs"
                    required
                    value={formData.hearAboutUs}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="social-media">Social Media</option>
                    <option value="search-engine">Search Engine</option>
                    <option value="friend-referral">Friend/Family Referral</option>
                    <option value="counselor">Marriage Counselor</option>
                    <option value="blog">Blog/Article</option>
                    <option value="podcast">Podcast</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Security
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                        passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Password Error Message */}
              {passwordError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}
              
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-600">Password must contain:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${/\d/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                    One number
                  </li>
                </ul>
              </div>
            </div>

            {/* Terms and Agreements */}
            <div>
              <h2 className="text-xl text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Terms & Privacy
              </h2>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    required
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToPrivacy"
                    required
                    checked={formData.agreeToPrivacy}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a> <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    I want to receive updates, tips, and special offers via email
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successMessage !== ''}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-purple-600 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}