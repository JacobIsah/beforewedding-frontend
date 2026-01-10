import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Lock, Camera, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { SuccessNotification } from '../components/SuccessNotification';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beforewedding.duckdns.org/api';

interface UserProfile {
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string;
  zip_code: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  relationship_status: string | null;
  relationship_length_years: number | null;
  relationship_length_months: number | null;
  wedding_date: string | null;
  avatar: string | null;
  bio: string | null;
  partner_name: string | null;
  partner_email: string | null;
  agree_to_terms: boolean;
  agree_to_privacy: boolean;
  agree_to_marketing: boolean;
}

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
  email_verified: boolean;
  date_joined: string;
}

export function Account() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    gender: '',
    bio: '',
    relationshipStatus: '',
    relationshipLengthYears: '',
    relationshipLengthMonths: '',
    weddingDate: '',
    partnerName: '',
    partnerEmail: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProfileNotification, setShowProfileNotification] = useState(false);
  const [showPasswordNotification, setShowPasswordNotification] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({ password: '', confirmation: '' });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('access_token');

  // Get CSRF token from cookie
  const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data: UserData = await response.json();
        
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.profile?.phone_number || '',
          dateOfBirth: data.profile?.date_of_birth || '',
          city: data.profile?.city || '',
          state: data.profile?.state || '',
          zipCode: data.profile?.zip_code || '',
          country: data.profile?.country || '',
          gender: data.profile?.gender || '',
          bio: data.profile?.bio || '',
          relationshipStatus: data.profile?.relationship_status || '',
          relationshipLengthYears: data.profile?.relationship_length_years?.toString() || '',
          relationshipLengthMonths: data.profile?.relationship_length_months?.toString() || '',
          weddingDate: data.profile?.wedding_date || '',
          partnerName: data.profile?.partner_name || '',
          partnerEmail: data.profile?.partner_email || ''
        });

        if (data.profile?.avatar) {
          setProfileImage(data.profile.avatar);
        }
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setProfileImage(base64Image);
      };
      reader.readAsDataURL(file);

      // Upload file to server using FormData
      const token = getAuthToken();
      if (token) {
        try {
          const csrfToken = getCSRFToken();
          const formData = new FormData();
          formData.append('avatar', file);

          const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`,
              ...(csrfToken && { 'X-CSRFToken': csrfToken }),
              // Don't set Content-Type - browser will set it with boundary for multipart/form-data
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to upload avatar:', errorData);
          }
        } catch (err) {
          console.error('Failed to upload avatar:', err);
        }
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const token = getAuthToken();
    if (!token) {
      setSaveError('Not authenticated. Please log in.');
      setSaving(false);
      return;
    }

    try {
      const csrfToken = getCSRFToken();
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        },
        body: JSON.stringify({
          phone_number: formData.phone || null,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          zip_code: formData.zipCode || null,
          city: formData.city || null,
          state: formData.state || null,
          country: formData.country || null,
          bio: formData.bio || null,
          relationship_status: formData.relationshipStatus || null,
          relationship_length_years: formData.relationshipLengthYears ? Number.parseInt(formData.relationshipLengthYears) : null,
          relationship_length_months: formData.relationshipLengthMonths ? Number.parseInt(formData.relationshipLengthMonths) : null,
          wedding_date: formData.weddingDate || null,
          partner_name: formData.partnerName || null,
          partner_email: formData.partnerEmail || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setIsEditing(false);
      setShowProfileNotification(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveError('New passwords do not match!');
      return;
    }

    setSaving(true);
    setSaveError(null);

    const token = getAuthToken();
    if (!token) {
      setSaveError('Not authenticated. Please log in.');
      setSaving(false);
      return;
    }

    try {
      const csrfToken = getCSRFToken();
      const response = await fetch(`${API_BASE_URL}/users/change-password/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.current_password) {
          throw new Error(data.current_password[0]);
        } else if (data.confirm_password) {
          throw new Error(data.confirm_password[0]);
        } else if (data.error) {
          throw new Error(data.error);
        }
        throw new Error('Failed to change password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
      setShowPasswordNotification(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deleteData.confirmation !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm account deletion');
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    const token = getAuthToken();
    if (!token) {
      setDeleteError('Not authenticated. Please log in.');
      setDeleting(false);
      return;
    }

    try {
      const csrfToken = getCSRFToken();
      const response = await fetch(`${API_BASE_URL}/auth/delete-account/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRFToken': csrfToken }),
        },
        body: JSON.stringify({
          password: deleteData.password,
          confirmation: deleteData.confirmation,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        } else if (data.password) {
          throw new Error(data.password[0]);
        } else if (data.confirmation) {
          throw new Error(data.confirmation[0]);
        }
        throw new Error('Failed to delete account');
      }

      // Account deleted successfully - log out and redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userName = `${formData.firstName} ${formData.lastName}`.trim() || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-100 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl mb-2">Account Settings</h1>
          <p className="text-blue-100">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl text-gray-900 mb-4">Profile Picture</h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </div>
              )}
              <button
                onClick={triggerFileUpload}
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-gray-600 mb-3">{formData.email}</p>
              <button
                onClick={triggerFileUpload}
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Upload new picture
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSaveError(null);
                  }}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {saveError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>

              {/* Bio - full width */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                />
              </div>
            </div>

            {/* Relationship Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg text-gray-900 mb-4">Relationship Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Relationship Status */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Relationship Status</label>
                  <select
                    name="relationshipStatus"
                    value={formData.relationshipStatus}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  >
                    <option value="">Select Status</option>
                    <option value="dating">Dating</option>
                    <option value="courtship">Courtship</option>
                    <option value="engaged">Engaged</option>
                    <option value="planning">Planning Wedding</option>
                  </select>
                </div>

                {/* Wedding Date */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    name="weddingDate"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Relationship Length - Years */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Years Together</label>
                  <input
                    type="number"
                    name="relationshipLengthYears"
                    value={formData.relationshipLengthYears}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Relationship Length - Months */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Additional Months</label>
                  <input
                    type="number"
                    name="relationshipLengthMonths"
                    value={formData.relationshipLengthMonths}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="0"
                    max="11"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Partner Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Partner's Name
                  </label>
                  <input
                    type="text"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                {/* Partner Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Partner's Email
                  </label>
                  <input
                    type="email"
                    name="partnerEmail"
                    value={formData.partnerEmail}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl text-gray-900 mb-1">Security</h2>
              <p className="text-sm text-gray-600">Manage your password and security settings</p>
            </div>
            {!showPasswordSection && (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            )}
          </div>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          )}

          {!showPasswordSection && (
            <div className="text-sm text-gray-600">
              Last password change: Nov 15, 2025
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6 mt-6">
          <h2 className="text-xl text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">
            These actions are permanent and cannot be undone
          </p>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl text-red-600 mb-2">Delete Account</h2>
            <p className="text-sm text-gray-600 mb-4">
              This action is <strong>permanent</strong> and cannot be undone. All your data including:
            </p>
            <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
              <li>Your profile information</li>
              <li>Assessment sessions and results</li>
              <li>Partner invitations</li>
              <li>Counselor profile (if applicable)</li>
            </ul>
            <p className="text-sm text-gray-600 mb-4">
              will be permanently deleted.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Enter your password</label>
                <input
                  type="password"
                  value={deleteData.password}
                  onChange={(e) => setDeleteData({ ...deleteData, password: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your password"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={deleteData.confirmation}
                  onChange={(e) => setDeleteData({ ...deleteData, confirmation: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteData({ password: '', confirmation: '' });
                    setDeleteError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || deleteData.confirmation !== 'DELETE'}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete My Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notifications */}
      {showProfileNotification && (
        <SuccessNotification 
          message="Your profile has been updated successfully!"
          onClose={() => setShowProfileNotification(false)}
        />
      )}

      {showPasswordNotification && (
        <SuccessNotification 
          message="Password updated successfully!"
          onClose={() => setShowPasswordNotification(false)}
        />
      )}
    </div>
  );
}