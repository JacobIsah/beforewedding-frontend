import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Bell, User, HelpCircle, LogOut, CheckCircle, Calendar, HeartHandshake, Library, ArrowRight, Clock, X, AlertCircle, Video, Loader2 } from 'lucide-react';
import { fetchWithRetry, executeBatched, delay } from '../utils/apiHelper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://beforewedding.duckdns.org/api';

// API Response Types
interface UserProfile {
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string;
  partner_name: string | null;
  partner_email: string | null;
}

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
  email_verified: boolean;
}

interface CoupleUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface CoupleInfo {
  id: number;
  user1: CoupleUser;
  user2: CoupleUser;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InvitationInfo {
  id: number;
  from_user: CoupleUser;
  to_email: string;
  to_user?: CoupleUser;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
}

interface AssessmentCategory {
  id: string;
  name: string;
  description: string;
  progress: number;
  is_complete: boolean;
}

interface Appointment {
  id: number;
  counselor: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface CoupleResult {
  category: string;
  score: number | null;
  compatibility_score: number | null;
  user_completed: boolean;
  partner_completed: boolean;
  both_complete: boolean;
  attempt_count: number;
}

interface PartnerStatusResponse {
  category: string;
  user_status: {
    started: boolean;
    is_complete: boolean;
    progress: number;
  };
  partner_status: {
    started: boolean;
    is_complete: boolean;
  };
  both_complete: boolean;
  can_view_results: boolean;
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
  'communication': 'bg-blue-500',
  'finances': 'bg-green-500',
  'children': 'bg-amber-500',
  'intimacy': 'bg-pink-500',
  'values': 'bg-purple-500',
  'family': 'bg-indigo-500',
  'career': 'bg-teal-500',
  'household': 'bg-orange-500',
  'health': 'bg-rose-500',
  'social': 'bg-cyan-500',
};

export function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string, score: number | null, userCompleted: boolean, partnerCompleted: boolean, color: string} | null>(null);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // API Data States
  const [userData, setUserData] = useState<UserData | null>(null);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null);
  const [invitationInfo, setInvitationInfo] = useState<InvitationInfo | null>(null);
  const [categories, setCategories] = useState<AssessmentCategory[]>([]);
  const [coupleResults, setCoupleResults] = useState<CoupleResult[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Error States
  const [error, setError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('access_token');

  // Fetch user data
  const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) return null;
    
    const response = await fetchWithRetry(`${API_BASE_URL}/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch user data');
    return response.json();
  };

  // Fetch couple info
  const fetchCoupleInfo = async () => {
    const token = getAuthToken();
    if (!token) return null;
    
    const response = await fetchWithRetry(`${API_BASE_URL}/couples/info/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    if (data.error) return null;
    return data;
  };

  // Fetch invitation status (for sent invitations)
  const fetchInvitationStatus = async () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/couples/invitation-status/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.error || !response.ok) return null;
      return data;
    } catch {
      return null;
    }
  };

  // Fetch assessment categories
  const fetchCategories = async () => {
    const token = getAuthToken();
    if (!token) return [];
    
    const response = await fetchWithRetry(`${API_BASE_URL}/assessments/categories/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) return [];
    return response.json();
  };

  // Fetch couple results for all categories
  const fetchCoupleResults = async (categoryList: AssessmentCategory[]): Promise<CoupleResult[]> => {
    const token = getAuthToken();
    if (!token || categoryList.length === 0) return [];
    
    const results: CoupleResult[] = [];
    
    // Process categories one at a time with delays to avoid rate limiting
    const categoryTasks = categoryList.map((cat) => async () => {
      // Add delay between each category to respect rate limits
      await delay(2000);
      try {
        // Fetch partner status
        const statusResponse = await fetchWithRetry(`${API_BASE_URL}/assessments/partner-status/${cat.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        let partnerStatus: PartnerStatusResponse | null = null;
        if (statusResponse.ok) {
          partnerStatus = await statusResponse.json();
        }
        
        // Check if both partners have completed - use both_complete OR check both is_complete flags
        const bothComplete = partnerStatus?.both_complete || 
          (partnerStatus?.user_status?.is_complete && partnerStatus?.partner_status?.is_complete);
        
        // If both complete, fetch the couple result
        let coupleResult = null;
        if (bothComplete) {
          const resultResponse = await fetchWithRetry(`${API_BASE_URL}/assessments/couple-results/${cat.id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (resultResponse.ok) {
            coupleResult = await resultResponse.json();
          }
        }
        
        results.push({
          category: cat.id,
          score: coupleResult?.result?.score ?? null,
          compatibility_score: coupleResult?.result?.compatibility_score ?? null,
          user_completed: partnerStatus?.user_status?.is_complete ?? cat.is_complete,
          partner_completed: partnerStatus?.partner_status?.is_complete ?? false,
          both_complete: bothComplete ?? false,
          attempt_count: coupleResult?.attempt ?? (cat.progress > 0 ? 1 : 0),
        });
      } catch (err) {
        console.error(`Error fetching result for ${cat.id}:`, err);
        results.push({
          category: cat.id,
          score: null,
          compatibility_score: null,
          user_completed: cat.is_complete,
          partner_completed: false,
          both_complete: false,
          attempt_count: 0,
        });
      }
    });
    
    // Execute categories one at a time (batch size 1) with 2s delays to respect rate limits
    // Each category already has a 2s delay built in, so this ensures sequential processing
    await executeBatched(categoryTasks, 1, 2000);
    
    return results;
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    const token = getAuthToken();
    if (!token) return [];
    
    const response = await fetchWithRetry(`${API_BASE_URL}/appointments/couple-appointments/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    if (data.error) return [];
    return Array.isArray(data) ? data : [];
  };

  // Send/Resend partner invitation
  const sendPartnerInvitation = async (email: string) => {
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(null);
    
    const token = getAuthToken();
    if (!token) {
      setInviteError('Not authenticated');
      setInviteLoading(false);
      return;
    }
    
    try {
      const response = await fetchWithRetry(`${API_BASE_URL}/couples/invite/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setInviteError(data.error || 'Failed to send invitation');
      } else {
        setInviteSuccess(data.message || 'Invitation sent successfully');
      }
    } catch (err) {
      setInviteError('Network error. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Batch API calls to avoid rate limiting
        // Use longer delays to respect backend rate limit window
        // CRITICAL: Wait 5 seconds initially to ensure previous page's API calls cleared the rate limit
        console.log('Dashboard: Waiting 5s before first API call to avoid rate limit...');
        await delay(5000); // 5 second initial delay to clear rate limit window
        console.log('Dashboard: Starting API calls...');
        const user = await fetchUserData();
        
        // Increase delays to 2500ms to stay well under rate limits
        await delay(2500);
        const couple = await fetchCoupleInfo();
        
        await delay(2500);
        const invitation = await fetchInvitationStatus();
        
        await delay(2500);
        const cats = await fetchCategories();
        
        await delay(2500);
        const appts = await fetchAppointments();
        
        // Then fetch couple results with category data
        const results = await fetchCoupleResults(cats || []);
        
        setUserData(user);
        setCoupleInfo(couple);
        setInvitationInfo(invitation);
        setCategories(cats || []);
        setCoupleResults(results || []);
        setAppointments(appts || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Dashboard loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Derived data from API responses
  const userName = userData ? `${userData.first_name} ${userData.last_name}` : 'User';
  const userEmail = userData?.email || '';
  
  // Check if partner is connected from multiple sources:
  // 1. Couple info with active status
  // 2. Invitation that has been accepted
  const hasPartner = 
    (coupleInfo !== null && coupleInfo.status === 'active') || 
    (invitationInfo !== null && invitationInfo.status === 'accepted');
  
  // Check if there's a pending invitation
  const hasPendingInvitation = invitationInfo !== null && invitationInfo.status === 'pending';
  
  // Get partner info from couple data
  const getPartnerInfo = () => {
    if (!coupleInfo || !userData) return null;
    if (!coupleInfo.user1 || !coupleInfo.user2) return null;
    const partner = coupleInfo.user1.id === userData.id ? coupleInfo.user2 : coupleInfo.user1;
    if (!partner) return null;
    return {
      name: `${partner.first_name} ${partner.last_name}`,
      email: partner.email,
    };
  };
  
  const partnerInfo = getPartnerInfo();
  const partnerName = partnerInfo?.name || userData?.profile?.partner_name || 'Partner';
  const partnerEmail = partnerInfo?.email || userData?.profile?.partner_email || '';

  // Build topic categories from API data
  const topicCategories = categories.map((cat, index) => {
    const result = coupleResults.find(r => r.category === cat.id);
    return {
      id: index + 1,
      categoryId: cat.id,
      name: cat.name,
      color: categoryColors[cat.id] || 'bg-gray-500',
      // Use compatibility_score for display, fall back to score
      score: result?.both_complete ? (result?.compatibility_score ?? result?.score ?? null) : null,
      userCompleted: result?.user_completed ?? cat.is_complete,
      partnerCompleted: result?.partner_completed ?? false,
      progress: cat.progress,
      attempts: result?.attempt_count ?? 0,
    };
  });

  // Calculate overall compatibility from completed topics only
  const completedTopics = topicCategories.filter(t => t.score !== null);
  const overallCompatibility = completedTopics.length > 0 
    ? Math.round(completedTopics.reduce((sum, topic) => sum + (topic.score || 0), 0) / completedTopics.length)
    : 0;

  // Count total attempts across all assessments
  const totalAttempts = topicCategories.reduce((sum, t) => sum + (t.progress > 0 ? 1 : 0), 0);

  const handleCategoryClick = (category: typeof topicCategories[0]) => {
    setSelectedCategory({ 
      id: category.categoryId,
      name: category.name, 
      score: category.score,
      userCompleted: category.userCompleted,
      partnerCompleted: category.partnerCompleted,
      color: category.color
    });
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  const handleTakeAssessment = () => {
    closeModal();
    if (selectedCategory) {
      navigate(`/assessment/${selectedCategory.id}`, { 
        state: { 
          category: selectedCategory.name, 
          color: selectedCategory.color, 
          partnerCompleted: selectedCategory.partnerCompleted 
        } 
      });
    }
  };

  const handleViewMaterials = () => {
    closeModal();
    navigate('/materials', { state: { category: selectedCategory?.name } });
  };

  const handleResendInvitation = () => {
    const email = userData?.profile?.partner_email;
    if (email) {
      sendPartnerInvitation(email);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-sm text-gray-400">Before</div>
              <div className="text-sm">Wedding</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/materials')}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Books</span>
          </button>

          <button
            onClick={() => navigate('/compatibility-test')}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Compatibility Test</span>
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>

          <div className="my-6 border-t border-gray-800"></div>

          <button
            onClick={() => navigate('/account')}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <User className="w-5 h-5" />
            <span>Account</span>
          </button>

          <button
            onClick={() => navigate('/help')}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </button>

          <div className="my-6 border-t border-gray-800"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">Welcome back, {userName}</h1>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm">{userName}</div>
                <div className="text-xs text-blue-200">Active</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 text-lg">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Overall Compatibility & Partner Info */}
            <div className="space-y-6">
              {/* Overall Compatibility Score Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900">Overall Compatibility</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Overall Score Display */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
                  <div className="text-sm mb-2">Based on {completedTopics.length} of {topicCategories.length} Topics</div>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <div className="text-6xl">{overallCompatibility}</div>
                    <div className="text-3xl mb-3">%</div>
                  </div>
                  <div className="text-sm text-blue-100">Compatible</div>
                </div>

                <div className="mt-4 text-sm text-gray-600 text-center">
                  {topicCategories.length - completedTopics.length > 0 && (
                    <span className="text-amber-600">
                      {topicCategories.length - completedTopics.length} topic{topicCategories.length - completedTopics.length > 1 ? 's' : ''} pending
                    </span>
                  )}
                </div>
              </div>

              {/* Partner's Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Partner&apos;s Info</div>
                  {hasPartner ? (
                    <>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                          {partnerName.split(' ').map(n => n.charAt(0)).join('')}
                        </div>
                        <div>
                          <h3 className="text-2xl text-blue-600">{partnerName}</h3>
                          <div className="flex items-center gap-2 text-green-600 mt-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Connected</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="text-gray-700">{partnerEmail}</div>
                      </div>
                    </>
                  ) : hasPendingInvitation ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <h3 className="text-2xl text-amber-600">Pending Connection</h3>
                      </div>
                      <p className="text-gray-600 mb-2">
                        Invitation sent to: <span className="font-medium">{invitationInfo?.to_email || partnerEmail}</span>
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        Once they accept, you&apos;ll be able to take assessments together.
                      </p>
                      
                      {inviteSuccess && (
                        <div className="mb-3 p-2 bg-green-100 text-green-700 text-sm rounded-lg">
                          {inviteSuccess}
                        </div>
                      )}
                      {inviteError && (
                        <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded-lg">
                          {inviteError}
                        </div>
                      )}
                      
                      <button 
                        onClick={handleResendInvitation}
                        disabled={inviteLoading || !userData?.profile?.partner_email}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {inviteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {inviteLoading ? 'Sending...' : 'Resend Invitation'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                        <h3 className="text-2xl text-gray-600">No Partner Yet</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {userData?.profile?.partner_email 
                          ? `Send an invitation to ${userData.profile.partner_email} to get started.`
                          : 'Add your partner\'s email to send them an invitation.'}
                      </p>
                      
                      {inviteSuccess && (
                        <div className="mb-3 p-2 bg-green-100 text-green-700 text-sm rounded-lg">
                          {inviteSuccess}
                        </div>
                      )}
                      {inviteError && (
                        <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded-lg">
                          {inviteError}
                        </div>
                      )}
                      
                      <button 
                        onClick={handleResendInvitation}
                        disabled={inviteLoading || !userData?.profile?.partner_email}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {inviteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {inviteLoading ? 'Sending...' : 'Send Invitation'}
                      </button>
                    </>
                  )}
                </div>

                {hasPartner && (
                  <div className="mt-6">
                    <button 
                      onClick={() => navigate('/counselors-marketplace')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Book Consultation</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Center Column - Topic Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl text-gray-900 mb-2">Assessment Topics</h2>
              <p className="text-sm text-gray-600 mb-6">
                View compatibility scores for each relationship dimension
              </p>

              {/* Categories List with Scores */}
              <div className="space-y-3 mb-6 max-h-[600px] overflow-y-auto">
                {topicCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${category.color}`}></div>
                      <span className="text-sm text-gray-700 group-hover:text-blue-700 text-left">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {category.score !== null ? (
                        <>
                          <span className="text-sm text-gray-900">{category.score}%</span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            Pending
                          </span>
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => navigate('/materials')}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Library className="w-5 h-5" />
                  <span>Browse All Materials</span>
                </button>
              </div>
            </div>

            {/* Right Column - Attempts & Appointments */}
            <div className="space-y-6">
              {/* Number of Attempts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl text-gray-900 mb-4">Assessment Progress</h2>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center mb-4">
                  <div className="text-sm mb-2">Total Attempts</div>
                  <div className="text-5xl mb-2">{totalAttempts}</div>
                  <div className="text-sm text-purple-100">Across all topics</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="text-green-600">{completedTopics.length} topics</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-amber-600">{topicCategories.length - completedTopics.length} topics</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(completedTopics.length / topicCategories.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-gray-900">Upcoming Sessions</h2>
                  <button 
                    onClick={() => navigate('/counselors-marketplace')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </button>
                </div>

                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm text-gray-900 mb-1">
                              {appointment.counselor}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                              <Calendar className="w-3 h-3" />
                              <span>{appointment.date} at {appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Video className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{appointment.type}</span>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No upcoming appointments</p>
                    <button 
                      onClick={() => navigate('/counselors-marketplace')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Book a Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl text-gray-900 mb-2">{selectedCategory.name}</h3>
              
              {selectedCategory.score !== null ? (
                <>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl text-blue-600">{selectedCategory.score}%</span>
                    <span className="text-gray-600">Compatibility</span>
                  </div>
                  <p className="text-gray-600">
                    Choose an action to improve your relationship in this area
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-amber-900">Assessment Pending</div>
                      <div className="text-xs text-amber-700 mt-1">
                        {!selectedCategory.userCompleted && !selectedCategory.partnerCompleted && 
                          'Both you and your partner need to complete this assessment'
                        }
                        {!selectedCategory.userCompleted && selectedCategory.partnerCompleted && 
                          'You need to complete this assessment'
                        }
                        {selectedCategory.userCompleted && !selectedCategory.partnerCompleted && 
                          'Your partner needs to complete this assessment'
                        }
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTakeAssessment}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">
                      {selectedCategory.score !== null ? 'Retake Assessment' : 'Take Assessment'}
                    </div>
                    <div className="text-sm text-blue-100">
                      {selectedCategory.score !== null ? 'Update your compatibility score' : 'Complete this assessment'}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleViewMaterials}
                className="w-full px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Library className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">Recommended Materials</div>
                    <div className="text-sm text-blue-600/70">View curated resources</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}