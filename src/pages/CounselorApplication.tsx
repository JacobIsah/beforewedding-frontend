import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function CounselorApplication() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    
    // Professional Information
    credentials: '',
    licenseNumber: '',
    licenseState: '',
    yearsExperience: '',
    currentPractice: '',
    
    // Education
    highestDegree: '',
    institution: '',
    graduationYear: '',
    
    // Specializations
    specializations: [] as string[],
    otherSpecialization: '',
    
    // Practice Details
    sessionFormats: [] as string[],
    languagesSpoken: '',
    acceptInsurance: '',
    
    // Professional Background
    professionalBio: '',
    therapeuticApproach: '',
    whyJoin: '',
    
    // Availability
    weekdayAvailability: '',
    weekendAvailability: '',
    
    // References
    referenceName1: '',
    referenceEmail1: '',
    referenceRelation1: '',
    referenceName2: '',
    referenceEmail2: '',
    referenceRelation2: '',
    
    // Additional
    backgroundCheck: false,
    termsAgreed: false
  });

  const specializationOptions = [
    'Pre-marital Counseling',
    'Communication',
    'Conflict Resolution',
    'Financial Planning',
    'Faith-Based Counseling',
    'Cultural Integration',
    'Intimacy Building',
    'Trust & Betrayal',
    'Family Dynamics',
    'Life Transitions',
    'Other'
  ];

  const sessionFormatOptions = [
    'Video Sessions',
    'In-Person Sessions',
    'Phone Sessions',
    'Group Sessions'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxGroup = (name: 'specializations' | 'sessionFormats', value: string) => {
    setFormData(prev => {
      const currentValues = prev[name];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    // Validate required checkboxes
    if (!formData.backgroundCheck || !formData.termsAgreed) {
      setValidationErrors({
        agreements: ['Please agree to the background check and terms & conditions']
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setValidationErrors({
        confirmPassword: ['Passwords do not match']
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        location: formData.location,
        credentials: formData.credentials,
        licenseNumber: formData.licenseNumber,
        licenseState: formData.licenseState,
        yearsExperience: parseInt(formData.yearsExperience),
        currentPractice: formData.currentPractice,
        highestDegree: formData.highestDegree,
        institution: formData.institution,
        graduationYear: parseInt(formData.graduationYear),
        specializations: formData.specializations,
        otherSpecialization: formData.otherSpecialization,
        sessionFormats: formData.sessionFormats,
        languagesSpoken: formData.languagesSpoken,
        acceptInsurance: formData.acceptInsurance,
        professionalBio: formData.professionalBio,
        therapeuticApproach: formData.therapeuticApproach,
        whyJoin: formData.whyJoin,
        weekdayAvailability: formData.weekdayAvailability,
        weekendAvailability: formData.weekendAvailability,
        referenceName1: formData.referenceName1,
        referenceEmail1: formData.referenceEmail1,
        referenceRelation1: formData.referenceRelation1,
        referenceName2: formData.referenceName2,
        referenceEmail2: formData.referenceEmail2,
        referenceRelation2: formData.referenceRelation2,
        backgroundCheck: formData.backgroundCheck,
        termsAgreed: formData.termsAgreed
      };

      const response = await fetch('https://beforewedding.duckdns.org/api/auth/counselor/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success (201 Created)
        setNotification('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Redirect to counselor login after 3 seconds
        setTimeout(() => {
          navigate('/counselor-login');
        }, 3000);
      } else if (response.status === 400) {
        // Validation errors
        setValidationErrors(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Server error or other errors
        setNotification('error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          setNotification('idle');
        }, 5000);
      }
    } catch (error) {
      // Network error or other unexpected errors
      console.error('Error submitting application:', error);
      setNotification('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setNotification('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
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

      {/* Success Notification */}
      {notification === 'success' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-green-900 mb-1">Application Submitted Successfully!</h3>
                <p className="text-sm text-green-700">
                  Your application is pending review. Please check your email for verification. Our team will review your application and contact you within 5-7 business days.
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
                <h3 className="text-red-900 mb-1">Submission Failed</h3>
                <p className="text-sm text-red-700">
                  We couldn&apos;t process your application. Please try again or contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 mb-1">Please Fix the Following Errors</h3>
                <p className="text-sm text-red-700">
                  Some fields have validation errors. Please review and correct them.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl text-gray-900 mb-4">
            Counselor Application
          </h1>
          <p className="text-lg text-gray-600">
            Join our network of professional marriage counselors and help couples build stronger foundations for lasting relationships.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Personal Information
            </h2>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
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
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                    Professional Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email[0]}</p>
                  )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password[0]}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm text-gray-700 mb-2">
                  Primary Practice Location (City, State) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Austin, TX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Professional Credentials */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Professional Credentials
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="credentials" className="block text-sm text-gray-700 mb-2">
                  Professional Credentials <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="credentials"
                  name="credentials"
                  required
                  value={formData.credentials}
                  onChange={handleChange}
                  placeholder="e.g., PhD, LMFT, LPC, PsyD"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  List all relevant credentials separated by commas
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm text-gray-700 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="licenseState" className="block text-sm text-gray-700 mb-2">
                    State of Licensure <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="licenseState"
                    name="licenseState"
                    required
                    value={formData.licenseState}
                    onChange={handleChange}
                    placeholder="e.g., TX, CA, NY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="yearsExperience" className="block text-sm text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="yearsExperience"
                    name="yearsExperience"
                    required
                    min="0"
                    value={formData.yearsExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="currentPractice" className="block text-sm text-gray-700 mb-2">
                    Current Practice/Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="currentPractice"
                    name="currentPractice"
                    required
                    value={formData.currentPractice}
                    onChange={handleChange}
                    placeholder="Practice name or 'Independent'"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Education
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="highestDegree" className="block text-sm text-gray-700 mb-2">
                  Highest Degree <span className="text-red-500">*</span>
                </label>
                <select
                  id="highestDegree"
                  name="highestDegree"
                  required
                  value={formData.highestDegree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select degree</option>
                  <option value="masters">Master&apos;s Degree</option>
                  <option value="phd">PhD</option>
                  <option value="psyd">PsyD</option>
                  <option value="edd">EdD</option>
                  <option value="mdiv">Master of Divinity</option>
                  <option value="other">Other Doctoral Degree</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="institution" className="block text-sm text-gray-700 mb-2">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-sm text-gray-700 mb-2">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="graduationYear"
                    name="graduationYear"
                    required
                    min="1950"
                    max={new Date().getFullYear()}
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Areas of Specialization
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  Select all that apply <span className="text-red-500">*</span>
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {specializationOptions.map((spec) => (
                    <label key={spec} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleCheckboxGroup('specializations', spec)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.specializations && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.specializations[0]}</p>
                )}
              </div>

              {formData.specializations.includes('Other') && (
                <div>
                  <label htmlFor="otherSpecialization" className="block text-sm text-gray-700 mb-2">
                    Please specify other specializations
                  </label>
                  <input
                    type="text"
                    id="otherSpecialization"
                    name="otherSpecialization"
                    value={formData.otherSpecialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Practice Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Practice Details
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  Session Formats You Offer <span className="text-red-500">*</span>
                </p>
                <div className="space-y-2">
                  {sessionFormatOptions.map((format) => (
                    <label key={format} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sessionFormats.includes(format)}
                        onChange={() => handleCheckboxGroup('sessionFormats', format)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{format}</span>
                    </label>
                  ))}
                </div>
                {validationErrors.sessionFormats && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.sessionFormats[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="languagesSpoken" className="block text-sm text-gray-700 mb-2">
                  Languages Spoken <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="languagesSpoken"
                  name="languagesSpoken"
                  required
                  value={formData.languagesSpoken}
                  onChange={handleChange}
                  placeholder="e.g., English, Spanish, Mandarin"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="acceptInsurance" className="block text-sm text-gray-700 mb-2">
                  Do you accept insurance? <span className="text-red-500">*</span>
                </label>
                <select
                  id="acceptInsurance"
                  name="acceptInsurance"
                  required
                  value={formData.acceptInsurance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  <option value="yes">Yes, I accept insurance</option>
                  <option value="some">I accept some insurance plans</option>
                  <option value="no">No, private pay only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Background */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Professional Background
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="professionalBio" className="block text-sm text-gray-700 mb-2">
                  Professional Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="professionalBio"
                  name="professionalBio"
                  required
                  rows={5}
                  value={formData.professionalBio}
                  onChange={handleChange}
                  placeholder="Provide a brief professional biography (200-300 words)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  This will be displayed on your profile page
                </p>
              </div>

              <div>
                <label htmlFor="therapeuticApproach" className="block text-sm text-gray-700 mb-2">
                  Therapeutic Approach <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="therapeuticApproach"
                  name="therapeuticApproach"
                  required
                  rows={5}
                  value={formData.therapeuticApproach}
                  onChange={handleChange}
                  placeholder="Describe your therapeutic approach and methodologies"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label htmlFor="whyJoin" className="block text-sm text-gray-700 mb-2">
                  Why do you want to join DuringCourtship? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="whyJoin"
                  name="whyJoin"
                  required
                  rows={4}
                  value={formData.whyJoin}
                  onChange={handleChange}
                  placeholder="Tell us why you're interested in joining our platform"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Availability
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="weekdayAvailability" className="block text-sm text-gray-700 mb-2">
                  Weekday Availability <span className="text-red-500">*</span>
                </label>
                <select
                  id="weekdayAvailability"
                  name="weekdayAvailability"
                  required
                  value={formData.weekdayAvailability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select availability</option>
                  <option value="mornings">Mornings (8am-12pm)</option>
                  <option value="afternoons">Afternoons (12pm-5pm)</option>
                  <option value="evenings">Evenings (5pm-9pm)</option>
                  <option value="flexible">Flexible throughout the day</option>
                </select>
              </div>

              <div>
                <label htmlFor="weekendAvailability" className="block text-sm text-gray-700 mb-2">
                  Weekend Availability <span className="text-red-500">*</span>
                </label>
                <select
                  id="weekendAvailability"
                  name="weekendAvailability"
                  required
                  value={formData.weekendAvailability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select availability</option>
                  <option value="saturdays">Saturdays only</option>
                  <option value="sundays">Sundays only</option>
                  <option value="both">Both Saturday and Sunday</option>
                  <option value="none">Not available on weekends</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional References */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Professional References
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Please provide two professional references (supervisors, colleagues, or other professionals who can speak to your clinical work)
            </p>
            
            <div className="space-y-8">
              {/* Reference 1 */}
              <div className="space-y-4">
                <h3 className="text-gray-900">Reference 1</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="referenceName1" className="block text-sm text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="referenceName1"
                      name="referenceName1"
                      required
                      value={formData.referenceName1}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="referenceEmail1" className="block text-sm text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="referenceEmail1"
                      name="referenceEmail1"
                      required
                      value={formData.referenceEmail1}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="referenceRelation1" className="block text-sm text-gray-700 mb-2">
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="referenceRelation1"
                      name="referenceRelation1"
                      required
                      value={formData.referenceRelation1}
                      onChange={handleChange}
                      placeholder="e.g., Supervisor"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Reference 2 */}
              <div className="space-y-4">
                <h3 className="text-gray-900">Reference 2</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="referenceName2" className="block text-sm text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="referenceName2"
                      name="referenceName2"
                      required
                      value={formData.referenceName2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="referenceEmail2" className="block text-sm text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="referenceEmail2"
                      name="referenceEmail2"
                      required
                      value={formData.referenceEmail2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="referenceRelation2" className="block text-sm text-gray-700 mb-2">
                      Relationship <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="referenceRelation2"
                      name="referenceRelation2"
                      required
                      value={formData.referenceRelation2}
                      onChange={handleChange}
                      placeholder="e.g., Colleague"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agreements */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6 pb-2 border-b border-gray-200">
              Agreements & Acknowledgments
            </h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="backgroundCheck"
                  checked={formData.backgroundCheck}
                  onChange={handleChange}
                  required
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                />
                <span className="text-gray-700">
                  I consent to a background check and understand that it is required for all counselors on the platform <span className="text-red-500">*</span>
                </span>
              </label>
              {validationErrors.backgroundCheck && (
                <p className="ml-8 text-sm text-red-600">{validationErrors.backgroundCheck[0]}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAgreed"
                  checked={formData.termsAgreed}
                  onChange={handleChange}
                  required
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                />
                <span className="text-gray-700">
                  I agree to the Terms of Service and Privacy Policy, and certify that all information provided is accurate <span className="text-red-500">*</span>
                </span>
              </label>
              {validationErrors.termsAgreed && (
                <p className="ml-8 text-sm text-red-600">{validationErrors.termsAgreed[0]}</p>
              )}
              {validationErrors.agreements && (
                <p className="text-sm text-red-600">{validationErrors.agreements[0]}</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="mb-2">
                  <strong>Application Review Process:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Our team will review your application within 5-7 business days</li>
                  <li>We&apos;ll contact your references and verify your credentials</li>
                  <li>You&apos;ll receive an email with next steps or requests for additional information</li>
                  <li>Approved counselors will receive onboarding materials and platform access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
