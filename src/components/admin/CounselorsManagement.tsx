import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Star, Loader2 } from 'lucide-react';

const API_BASE_URL = 'https://beforewedding.duckdns.org';

interface Counselor {
  id: number;
  user: number;
  user_email: string;
  professional_name: string;
  specialties: string[];
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  years_of_experience: number;
  total_appointments: number;
  total_earnings: number;
  created_at: string;
  hourly_rate: number | null;
  average_rating?: number;
  total_reviews?: number;
}

export function CounselorsManagement() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/counselors/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }

      const data = await response.json();
      console.log('Counselors API response:', data);
      setCounselors(data.applications || []);
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setError('Failed to load counselors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/admin/counselors/${id}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchCounselors(); // Refresh the list
      } else {
        alert('Failed to approve counselor');
      }
    } catch (err) {
      console.error('Error approving counselor:', err);
      alert('Error approving counselor');
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/admin/counselors/${id}/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchCounselors(); // Refresh the list
      } else {
        alert('Failed to reject counselor');
      }
    } catch (err) {
      console.error('Error rejecting counselor:', err);
      alert('Error rejecting counselor');
    }
  };

  const filteredCounselors = counselors.filter((counselor) => {
    const matchesSearch = 
      counselor.professional_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'Active' && counselor.verification_status === 'verified') ||
      (statusFilter === 'Pending' && counselor.verification_status === 'pending') ||
      (statusFilter === 'Suspended' && counselor.verification_status === 'suspended');
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = counselors.filter(c => c.verification_status === 'pending').length;
  const activeCount = counselors.filter(c => c.verification_status === 'verified').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'suspended':
        return 'text-red-600 bg-red-50';
      case 'rejected':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'suspended':
        return 'Suspended';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading counselors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Counselors Management</h1>
        <p className="text-gray-600">Manage counselor applications and active professionals.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Counselors</p>
          <p className="text-2xl text-gray-900 mt-1">{counselors.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active Counselors</p>
          <p className="text-2xl text-gray-900 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pending Applications</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl text-gray-900">{pendingCount}</p>
            {pendingCount > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                Needs Review
              </span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Sessions</p>
          <p className="text-2xl text-gray-900 mt-1">
            {counselors.reduce((sum, c) => sum + (c.total_appointments || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search counselors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Counselor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCounselors.map((counselor) => (
                <tr key={counselor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">{counselor.professional_name}</p>
                      <p className="text-sm text-gray-500">{counselor.user_email}</p>
                      <p className="text-xs text-gray-400 mt-1">{counselor.years_of_experience} years experience</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">
                      {counselor.specialties?.slice(0, 2).join(', ') || 'N/A'}
                      {counselor.specialties?.length > 2 && ` +${counselor.specialties.length - 2}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">
                      {counselor.hourly_rate ? `$${counselor.hourly_rate}/hr` : 'Not set'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(counselor.verification_status)}`}>
                      {getStatusDisplay(counselor.verification_status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {counselor.total_appointments || 0}
                  </td>
                  <td className="px-6 py-4">
                    {counselor.average_rating && counselor.average_rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-gray-900">{counselor.average_rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({counselor.total_reviews || 0})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No reviews</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    ${(counselor.total_earnings || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {counselor.verification_status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(counselor.id)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleReject(counselor.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
