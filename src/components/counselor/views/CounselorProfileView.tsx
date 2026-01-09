import { useState } from "react";
import { User, Mail, Phone, MapPin, Award, Briefcase, Save, Edit2, Camera, Clock, DollarSign, Globe } from "lucide-react";

export function CounselorProfileView() {
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  const [isEditingRates, setIsEditingRates] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Wilson",
    email: "dr.wilson@beforewedding.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Licensed Marriage and Family Therapist with over 10 years of experience helping couples build strong foundations for their marriages. Specialized in pre-marital counseling, communication strategies, and conflict resolution.",
    
    // Professional Info
    license: "LMFT #123456",
    certifications: ["Gottman Method Couples Therapy", "Prepare/Enrich Certified", "AAMFT Clinical Member"],
    education: "Ph.D. in Marriage and Family Therapy, University of New York",
    yearsExperience: 10,
    specializations: ["Pre-Marriage Counseling", "Communication Skills", "Conflict Resolution", "Financial Planning for Couples"],
    
    // Rates & Availability
    sessionRates: {
      initial: 200,
      standard: 150,
      workshop: 175,
    },
    availability: "Monday - Friday: 9:00 AM - 6:00 PM",
    languages: ["English", "Spanish"],
  });

  const stats = [
    { label: "Total Sessions", value: "340", icon: Briefcase },
    { label: "Active Couples", value: "24", icon: User },
    { label: "Avg. Rating", value: "4.9", icon: Award },
    { label: "Years Experience", value: "10+", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">My Profile</h2>
          <p className="text-gray-500 mt-1">
            Manage your professional profile and credentials
          </p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-600 to-teal-700"></div>
        <div className="px-8 pb-8">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb3Vuc2Vsb3IlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjUyNzg0MTh8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-2">
                <h3 className="text-gray-900 text-2xl">{profileData.name}</h3>
                <p className="text-gray-500">{profileData.license}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-teal-600 mx-auto mb-2" />
                  <p className="text-2xl text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Bio */}
          <div>
            <p className="text-gray-500 leading-relaxed">{profileData.bio}</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">Basic Information</h3>
          <button
            onClick={() => setIsEditingBasic(!isEditingBasic)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isEditingBasic ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            {isEditingBasic ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.email}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            {isEditingBasic ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.phone}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            {isEditingBasic ? (
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.location}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Globe className="w-4 h-4" />
              Languages
            </label>
            <p className="text-gray-900">{profileData.languages.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">Professional Information</h3>
          <button
            onClick={() => setIsEditingProfessional(!isEditingProfessional)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isEditingProfessional ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Award className="w-4 h-4" />
              License Number
            </label>
            {isEditingProfessional ? (
              <input
                type="text"
                value={profileData.license}
                onChange={(e) => setProfileData({ ...profileData, license: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.license}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Briefcase className="w-4 h-4" />
              Education
            </label>
            <p className="text-gray-900">{profileData.education}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Certifications
            </label>
            <div className="flex flex-wrap gap-2">
              {profileData.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 text-teal-600 rounded-lg text-sm"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Specializations
            </label>
            <div className="flex flex-wrap gap-2">
              {profileData.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-50 text-gray-900 rounded-lg text-sm border border-gray-200"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Rates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">Session Rates</h3>
          <button
            onClick={() => setIsEditingRates(!isEditingRates)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-teal-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isEditingRates ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-teal-600 mb-2" />
            <p className="text-sm text-gray-500 mb-1">Initial Consultation</p>
            {isEditingRates ? (
              <input
                type="number"
                value={profileData.sessionRates.initial}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    sessionRates: { ...profileData.sessionRates, initial: parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-2xl text-gray-900">${profileData.sessionRates.initial}</p>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-teal-600 mb-2" />
            <p className="text-sm text-gray-500 mb-1">Standard Session</p>
            {isEditingRates ? (
              <input
                type="number"
                value={profileData.sessionRates.standard}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    sessionRates: { ...profileData.sessionRates, standard: parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-2xl text-gray-900">${profileData.sessionRates.standard}</p>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-teal-600 mb-2" />
            <p className="text-sm text-gray-500 mb-1">Workshop/Group</p>
            {isEditingRates ? (
              <input
                type="number"
                value={profileData.sessionRates.workshop}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    sessionRates: { ...profileData.sessionRates, workshop: parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              />
            ) : (
              <p className="text-2xl text-gray-900">${profileData.sessionRates.workshop}</p>
            )}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Availability</h3>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-5 h-5" />
          <p>{profileData.availability}</p>
        </div>
      </div>
    </div>
  );
}
