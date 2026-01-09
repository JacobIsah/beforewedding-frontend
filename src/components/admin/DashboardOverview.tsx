import { useState, useEffect } from 'react';
import { Heart, ClipboardCheck, UserCheck, DollarSign, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'https://3.107.197.17';

interface OverviewStats {
  total_users: number;
  total_users_change: string;
  assessments_completed: number;
  assessments_completed_change: string;
  active_counselors: number;
  active_counselors_change: string;
  monthly_revenue: number;
  monthly_revenue_change: string;
  pending_applications: number;
  pending_applications_change: string;
}

interface RevenueDataPoint {
  month: string;
  month_name: string;
  revenue: number;
}

interface AssessmentDataPoint {
  category: string;
  completed: number;
}

interface RecentCouple {
  id: number;
  partner1: { id: number; name: string; email: string };
  partner2: { id: number; name: string; email: string };
  created_at: string;
  status: string;
  compatibility_score: number;
  assessments_completed: number;
}

interface PendingCounselor {
  id: number;
  professional_name: string;
  specialties: string[];
  application_date: string;
  credentials: string;
  verification_status: string;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentDataPoint[]>([]);
  const [recentCouples, setRecentCouples] = useState<RecentCouple[]>([]);
  const [pendingCounselors, setPendingCounselors] = useState<PendingCounselor[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch all data in parallel
      const [statsRes, revenueRes, assessmentRes, couplesRes, counselorsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/overview/stats/`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/analytics/revenue-trend/`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/analytics/assessments/`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/couples/recent/?limit=5`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/counselors/applications/pending/?limit=3`, { headers }),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        console.log('Stats response:', data);
        // API returns stats as array with 'id' field
        if (data.stats && Array.isArray(data.stats)) {
          const statsObj: Partial<OverviewStats> = {};
          data.stats.forEach((stat: { id: string; value: number | string; change: string }) => {
            if (stat.id === 'total_users') {
              statsObj.total_users = Number(stat.value);
              statsObj.total_users_change = stat.change;
            } else if (stat.id === 'active_counselors') {
              statsObj.active_counselors = Number(stat.value);
              statsObj.active_counselors_change = stat.change;
            } else if (stat.id === 'pending_applications') {
              statsObj.pending_applications = Number(stat.value);
              statsObj.pending_applications_change = stat.change;
            } else if (stat.id === 'revenue_this_month') {
              statsObj.monthly_revenue = Number(stat.value);
              statsObj.monthly_revenue_change = stat.change;
            }
          });
          setStats(statsObj as OverviewStats);
        } else {
          setStats(data);
        }
      } else {
        console.error('Stats fetch failed:', statsRes.status);
      }

      if (revenueRes.ok) {
        const data = await revenueRes.json();
        console.log('Revenue response:', data);
        // Map API data to chart format
        const revenueArray = data.data || data.revenue_data || [];
        const formattedRevenue = revenueArray.map((item: { month_name: string; total_revenue: number }) => ({
          month: item.month_name || item.month,
          revenue: item.total_revenue || item.revenue || 0,
        }));
        setRevenueData(formattedRevenue);
      } else {
        console.error('Revenue fetch failed:', revenueRes.status);
      }

      if (assessmentRes.ok) {
        const data = await assessmentRes.json();
        console.log('Assessment response:', data);
        // If API returns chart data array, use it
        if (data.assessment_data && Array.isArray(data.assessment_data)) {
          setAssessmentData(data.assessment_data);
        } else if (data.categories && Array.isArray(data.categories)) {
          setAssessmentData(data.categories);
        } else {
          // Create chart data from summary stats if available
          const chartData: AssessmentDataPoint[] = [];
          if (data.total_assessments_completed !== undefined) {
            chartData.push({ category: 'Completed', completed: data.total_assessments_completed });
          }
          if (data.total_assessments_started !== undefined) {
            chartData.push({ category: 'Started', completed: data.total_assessments_started });
          }
          setAssessmentData(chartData);
        }
        // Update stats with assessment data if stats endpoint didn't have it
        if (data.total_assessments_completed !== undefined) {
          setStats(prev => ({
            ...prev,
            assessments_completed: prev.assessments_completed || data.total_assessments_completed,
          }));
        }
      } else {
        console.error('Assessment fetch failed:', assessmentRes.status);
      }

      if (couplesRes.ok) {
        const data = await couplesRes.json();
        console.log('Couples response:', data);
        const couplesArray = data.recent_couples || data.results || data || [];
        const formatted = couplesArray.map((couple: RecentCouple) => ({
          ...couple,
          // Keep original data structure
        }));
        setRecentCouples(formatted);
      } else {
        console.error('Couples fetch failed:', couplesRes.status);
      }

      if (counselorsRes.ok) {
        const data = await counselorsRes.json();
        console.log('Counselors response:', data);
        const applicationsArray = data.applications || data.pending_applications || data.results || [];
        if (Array.isArray(applicationsArray)) {
          setPendingCounselors(applicationsArray);
        }
        setTotalPending(data.pending_count || data.total_pending || data.count || 0);
      } else {
        console.error('Counselors fetch failed:', counselorsRes.status);
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard overview fetch error:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatTimeAgo = (isoTime: string) => {
    const now = new Date();
    const time = new Date(isoTime);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getStatusDisplay = (status: string) => {
    return status === 'active' ? 'Active' : 'Pending Invite';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with DuringCourtship today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={(stats?.total_users ?? 0).toLocaleString()}
          change={stats?.total_users_change || '0%'}
          trend="up"
          icon={Heart}
          color="pink"
        />
        <StatCard
          title="Assessments Completed"
          value={(stats?.assessments_completed ?? 0).toLocaleString()}
          change={stats?.assessments_completed_change || '0%'}
          trend="up"
          icon={ClipboardCheck}
          color="blue"
        />
        <StatCard
          title="Pending Applications"
          value={(stats?.pending_applications ?? 0).toString()}
          change={stats?.pending_applications_change || '0%'}
          trend="up"
          icon={UserCheck}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats?.monthly_revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          change={stats?.monthly_revenue_change || '0%'}
          trend="up"
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Top Assessment Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assessmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="completed" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Couples */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Recent Couples</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentCouples.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No recent couples found</p>
                <p className="text-xs mt-1">Check browser console for API response</p>
              </div>
            ) : (
              recentCouples.map((couple) => (
                <div key={couple.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{couple.partner1?.name} & {couple.partner2?.name}</p>
                      <p className="text-sm text-gray-500">
                        Joined {couple.created_at ? formatTimeAgo(couple.created_at) : 'N/A'} • 
                        Score: {couple.compatibility_score?.toFixed(1) || 'N/A'}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {couple.status === 'active' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={`text-sm ${
                        couple.status === 'active' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {getStatusDisplay(couple.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Counselor Applications */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Pending Counselor Applications</h3>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                {totalPending} pending
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingCounselors.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No pending applications found</p>
                <p className="text-xs mt-1">Check browser console for API response</p>
              </div>
            ) : (
              pendingCounselors.map((counselor) => (
                <div key={counselor.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-900">{counselor.professional_name}</p>
                      <p className="text-sm text-gray-600">
                        {counselor.specialties?.slice(0, 2).join(', ')}{counselor.specialties?.length > 2 ? '...' : ''}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {counselor.application_date ? formatTimeAgo(counselor.application_date) : 'N/A'}
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-sm hover:bg-rose-100 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
