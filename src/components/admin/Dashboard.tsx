import { useState, useEffect } from 'react';
import { Users, UserCheck, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://3.107.197.17';

interface DashboardStats {
  total_users: number;
  total_couples: number;
  active_couples: number;
  total_counselors: number;
  verified_counselors: number;
  pending_counselor_applications: number;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: string;
  total_counselor_earnings: string;
  assessments_completed: number;
  average_compatibility_score: number;
}

interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
  type: string;
}

interface DashboardData {
  stats: DashboardStats;
  recent_activity: RecentActivity[];
}

interface DashboardProps {
  readonly onNavigate: (section: 'users' | 'counselors' | 'financial' | 'counselor-management') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please login again.');
        } else if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load dashboard data');
        }
        setLoading(false);
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Network error. Please check your connection.');
    } finally {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-(--color-admin-primary) animate-spin mx-auto mb-4" />
          <p className="text-(--color-admin-text-gray)">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg text-(--color-admin-text-dark) mb-2">Error Loading Dashboard</h3>
          <p className="text-(--color-admin-text-gray) mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-(--color-admin-primary) text-white rounded-lg hover:bg-(--color-admin-secondary) transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: data.stats.total_users.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      onClick: () => onNavigate('users')
    },
    {
      label: 'Verified Counselors',
      value: data.stats.verified_counselors.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: UserCheck,
      color: 'green',
      onClick: () => onNavigate('counselors')
    },
    {
      label: 'Pending Applications',
      value: data.stats.pending_counselor_applications.toLocaleString(),
      change: '-3.1%',
      trend: 'down',
      icon: UserCheck,
      color: 'orange',
      onClick: () => onNavigate('counselor-management')
    },
    {
      label: 'Total Revenue',
      value: `$${Number.parseFloat(data.stats.total_revenue).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
      onClick: () => onNavigate('financial')
    },
  ];

  const recentActivity = data.recent_activity.map(activity => ({
    ...activity,
    time: formatTimeAgo(activity.time),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            orange: 'bg-orange-50 text-orange-600',
            purple: 'bg-purple-50 text-purple-600',
          }[stat.color];

          return (
            <button
              key={stat.label}
              onClick={stat.onClick}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl mb-2">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Recent Activity</h3>
            <button className="text-blue-600 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const getActivityColor = () => {
                if (activity.type === 'application') return 'bg-orange-500';
                if (activity.type === 'user') return 'bg-blue-500';
                if (activity.type === 'financial') return 'bg-green-500';
                return 'bg-purple-500';
              };
              
              return (
              <div key={`activity-${activity.id}-${activity.time}`} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor()}`}></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Platform Performance</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">User Growth</span>
                <span className="text-sm">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Counselor Approval Rate</span>
                <span className="text-sm">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Session Completion</span>
                <span className="text-sm">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Revenue Target</span>
                <span className="text-sm">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
