import { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Calendar, GraduationCap, 
  Award, Briefcase, FileText, Upload, CheckCircle, 
  ArrowRight, ArrowLeft, Heart, X
} from "lucide-react";

interface OnboardingFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  
  // Credentials
  licenseType: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  yearsOfExperience: string;
  
  // Education
  degree: string;
  institution: string;
  graduationYear: string;
  additionalCertifications: string;
  
  // Professional Details
  areasOfExpertise: string[];
  biography: string;
  languages: string[];
  sessionRate: string;
  
  // Documents
  certificationFile: File | null;
  resumeFile: File | null;
}

const EXPERTISE_OPTIONS = [
  "Pre-marital Counseling",
  "Relationship Communication",
  "Conflict Resolution",
  "Financial Planning for Couples",
  "Family Dynamics",
  "Cultural & Interfaith Relationships",
  "LGBTQ+ Relationships",
  "Blended Families",
  "Trust & Intimacy Issues",
  "Long-distance Relationships",
  "Career & Life Balance",
  "Mental Health Support"
];

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Japanese",
  "Korean"
];

export function OnboardingForm({ onComplete, onCancel }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    licenseType: "",
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    yearsOfExperience: "",
    degree: "",
    institution: "",
    graduationYear: "",
    additionalCertifications: "",
    areasOfExpertise: [],
    biography: "",
    languages: [],
    sessionRate: "",
    certificationFile: null,
    resumeFile: null
  });

  const totalSteps = 5;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "areasOfExpertise" | "languages", item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleFileChange = (field: "certificationFile" | "resumeFile", file: File | null) => {
    updateFormData(field, file);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    console.log("Form submitted:", formData);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-blue)] via-[var(--color-accent-teal)] to-[var(--color-primary-teal)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Heart className="w-8 h-8 text-[var(--color-primary-teal)]" />
          </div>
          <h1 className="text-white mb-2">BeforeWedding Counselor Application</h1>
          <p className="text-white text-opacity-90">Join our community of professional counselors</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step <= currentStep 
                    ? 'bg-white text-[var(--color-primary-teal)]' 
                    : 'bg-white bg-opacity-30 text-white'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                {step < 5 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    step < currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white text-opacity-90 px-2">
            <span>Personal</span>
            <span>Credentials</span>
            <span>Education</span>
            <span>Expertise</span>
            <span>Documents</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-[var(--color-text-dark)] mb-2">Personal Information</h2>
                <p className="text-sm text-[var(--color-text-gray)]">
                  Tell us about yourself
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Mail className="w-5 h-5 text-[var(--color-text-gray)]" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Phone className="w-5 h-5 text-[var(--color-text-gray)]" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData("zipCode", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-[var(--color-text-gray)]" />
                    </div>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Credentials */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-[var(--color-text-dark)] mb-2">Professional Credentials</h2>
                <p className="text-sm text-[var(--color-text-gray)]">
                  Provide your licensing and professional information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    License Type *
                  </label>
                  <select
                    value={formData.licenseType}
                    onChange={(e) => updateFormData("licenseType", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                  >
                    <option value="">Select license type</option>
                    <option value="LMFT">LMFT - Licensed Marriage and Family Therapist</option>
                    <option value="LPC">LPC - Licensed Professional Counselor</option>
                    <option value="LCSW">LCSW - Licensed Clinical Social Worker</option>
                    <option value="PhD">PhD - Doctor of Philosophy in Psychology</option>
                    <option value="PsyD">PsyD - Doctor of Psychology</option>
                    <option value="Other">Other Professional License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="ABC123456"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    License State *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseState}
                    onChange={(e) => updateFormData("licenseState", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="CA"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    License Expiry Date *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-[var(--color-text-gray)]" />
                    </div>
                    <input
                      type="date"
                      value={formData.licenseExpiry}
                      onChange={(e) => updateFormData("licenseExpiry", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Years of Experience *
                  </label>
                  <select
                    value={formData.yearsOfExperience}
                    onChange={(e) => updateFormData("yearsOfExperience", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                  >
                    <option value="">Select years of experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="16-20">16-20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education & Qualifications */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-[var(--color-text-dark)] mb-2">Education & Qualifications</h2>
                <p className="text-sm text-[var(--color-text-gray)]">
                  Share your educational background
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Highest Degree *
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => updateFormData("degree", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                  >
                    <option value="">Select degree</option>
                    <option value="Bachelor's">Bachelor&apos;s Degree</option>
                    <option value="Master's">Master&apos;s Degree</option>
                    <option value="Doctorate">Doctorate (PhD/PsyD)</option>
                    <option value="Other">Other Advanced Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Institution Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <GraduationCap className="w-5 h-5 text-[var(--color-text-gray)]" />
                    </div>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => updateFormData("institution", e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                      placeholder="University Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Graduation Year *
                  </label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => updateFormData("graduationYear", e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Additional Certifications
                  </label>
                  <textarea
                    value={formData.additionalCertifications}
                    onChange={(e) => updateFormData("additionalCertifications", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)] resize-none"
                    placeholder="List any additional certifications, workshops, or specialized training (one per line)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Areas of Expertise */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6">
                <h2 className="text-[var(--color-text-dark)] mb-2">Areas of Expertise</h2>
                <p className="text-sm text-[var(--color-text-gray)]">
                  Select your specializations and provide professional details
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-3 font-medium">
                    Areas of Expertise * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXPERTISE_OPTIONS.map((expertise) => (
                      <label
                        key={expertise}
                        className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-light)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.areasOfExpertise.includes(expertise)}
                          onChange={() => toggleArrayItem("areasOfExpertise", expertise)}
                          className="w-5 h-5 text-[var(--color-primary-teal)] border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary-teal)]"
                        />
                        <span className="text-sm text-[var(--color-text-dark)]">{expertise}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Languages Spoken * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LANGUAGE_OPTIONS.map((language) => (
                      <label
                        key={language}
                        className="flex items-center gap-2 p-2 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-light)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() => toggleArrayItem("languages", language)}
                          className="w-4 h-4 text-[var(--color-primary-teal)] border-[var(--color-border)] rounded focus:ring-2 focus:ring-[var(--color-primary-teal)]"
                        />
                        <span className="text-sm text-[var(--color-text-dark)]">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Professional Biography *
                  </label>
                  <textarea
                    value={formData.biography}
                    onChange={(e) => updateFormData("biography", e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)] resize-none"
                    placeholder="Tell us about your experience, approach to counseling, and what makes you passionate about helping couples prepare for marriage..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-2 font-medium">
                    Session Rate (per hour) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-gray)]">
                      $
                    </div>
                    <input
                      type="number"
                      value={formData.sessionRate}
                      onChange={(e) => updateFormData("sessionRate", e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent transition-all text-[var(--color-text-dark)]"
                      placeholder="150"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <h2 className="text-[var(--color-text-dark)] mb-2">Required Documents</h2>
                <p className="text-sm text-[var(--color-text-gray)]">
                  Upload proof of certification and professional resume
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-3 font-medium">
                    License/Certification Document *
                  </label>
                  <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 text-center hover:border-[var(--color-primary-teal)] transition-colors">
                    <input
                      type="file"
                      id="certification-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("certificationFile", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="certification-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-[var(--color-text-gray)] mx-auto mb-3" />
                      {formData.certificationFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="text-sm text-[var(--color-text-dark)]">
                            {formData.certificationFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFileChange("certificationFile", null);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-[var(--color-text-dark)] mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-[var(--color-text-gray)]">
                            PDF, JPG, or PNG (Max 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-dark)] mb-3 font-medium">
                    Professional Resume/CV *
                  </label>
                  <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-6 text-center hover:border-[var(--color-primary-teal)] transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange("resumeFile", e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <FileText className="w-12 h-12 text-[var(--color-text-gray)] mx-auto mb-3" />
                      {formData.resumeFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <p className="text-sm text-[var(--color-text-dark)]">
                            {formData.resumeFile.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFileChange("resumeFile", null);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-[var(--color-text-dark)] mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-[var(--color-text-gray)]">
                            PDF, DOC, or DOCX (Max 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-[var(--color-bg-light)] rounded-lg p-4 border border-[var(--color-border)]">
                  <h3 className="text-sm text-[var(--color-text-dark)] mb-2 font-medium">Application Review Process</h3>
                  <ul className="space-y-2 text-sm text-[var(--color-text-gray)]">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[var(--color-primary-teal)] mt-0.5 flex-shrink-0" />
                      <span>Your application will be reviewed within 3-5 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[var(--color-primary-teal)] mt-0.5 flex-shrink-0" />
                      <span>We will verify your credentials and professional licenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[var(--color-primary-teal)] mt-0.5 flex-shrink-0" />
                      <span>You&apos;ll receive an email with next steps or any additional requirements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-3 text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-teal)] hover:bg-[var(--color-accent-teal)] text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary-teal)] hover:bg-[var(--color-accent-teal)] text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white text-opacity-75">
            By submitting this application, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
