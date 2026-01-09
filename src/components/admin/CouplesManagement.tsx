import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle2, Clock, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'http://3.107.197.17';

interface Couple {
  id: number;
  partner1_name: string;
  partner2_name: string;
  partner1_email: string;
  partner2_email: string;
  joined_date: string;
  status: 'active' | 'pending_invite' | 'inactive';
  assessments_completed: number;
  total_assessments: number;
  average_score: number | null;
  sessions_booked: number;
}

interface CouplesResponse {
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  results: Couple[];
}

interface CoupleStats {
  total_couples: number;
  active_couples: number;
  pending_invites: number;
  avg_assessments: number;
}

export function CouplesManagement() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [stats, setStats] = useState<CoupleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCouples();
    fetchStats();
  }, [page, statusFilter]);

  const fetchCouples = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/couples/?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch couples');
      }

      const data: CouplesResponse = await response.json();
      setCouples(data.results);
      setTotalPages(data.total_pages);
      setTotalCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/couples/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: CoupleStats = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch couple stats:', err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCouples();
  };

  const getStatusIcon = (status: Couple['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending_invite':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Couple['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'pending_invite':
        return 'text-amber-600 bg-amber-50';
      case 'inactive':
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: Couple['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending_invite':
        return 'Pending Invite';
      case 'inactive':
        return 'Inactive';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading couples data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">Failed to Load Couples</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setPage(1);
              fetchCouples();
              fetchStats();
            }}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Couples Management</h1>
        <p className="text-gray-600">View and manage all couples on the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Couples</p>
          <p className="text-2xl text-gray-900 mt-1">{stats?.total_couples || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active Couples</p>
          <p className="text-2xl text-gray-900 mt-1">{stats?.active_couples || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pending Invites</p>
          <p className="text-2xl text-gray-900 mt-1">{stats?.pending_invites || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Avg. Assessments</p>
          <p className="text-2xl text-gray-900 mt-1">{stats?.avg_assessments.toFixed(1) || '0.0'}</p>
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
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending_invite">Pending Invite</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Couple</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Avg Score</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {couples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No couples found
                  </td>
                </tr>
              ) : (
                couples.map((couple) => (
                  <tr key={couple.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{couple.partner1_name} & {couple.partner2_name || '(Pending)'}</p>
                        <p className="text-sm text-gray-500">{couple.partner1_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(couple.joined_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(couple.status)}
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(couple.status)}`}>
                          {getStatusLabel(couple.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-rose-600 h-2 rounded-full"
                            style={{ width: `${(couple.assessments_completed / couple.total_assessments) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {couple.assessments_completed}/{couple.total_assessments}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {couple.average_score !== null ? (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          couple.average_score >= 80
                            ? 'bg-green-50 text-green-600'
                            : couple.average_score >= 60
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {couple.average_score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {couple.sessions_booked}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedCouple(couple)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * 10) + 1}-{Math.min(page * 10, totalCount)} of {totalCount} couples
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
