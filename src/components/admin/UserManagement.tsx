import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Ban, CheckCircle, Mail, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'http://3.107.197.17';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  date_joined: string;
  last_login: string;
  is_active: boolean;
  email_verified: boolean;
  sessions_completed: number;
  total_spent: number;
  partner_name?: string;
}

interface UsersResponse {
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  results: User[];
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'couple' | 'individual'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, userTypeFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (userTypeFilter !== 'all') params.append('user_type', userTypeFilter);

      const response = await fetch(`${API_BASE_URL}/api/admin/users/?${params}`, {
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
          setError('Failed to load users');
        }
        setLoading(false);
        return;
      }

      const data: UsersResponse = await response.json();
      setUsers(data.results);
      setTotalPages(data.total_pages);
      setTotalCount(data.count);
      setError(null);
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, isActive: boolean) => {
    setUpdating(userId);
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      await fetchUsers();
      setActiveMenu(null);
    } catch (err) {
      alert('Failed to update user status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const sendEmailToUser = async (userId: number, email: string) => {
    const subject = prompt('Enter email subject:');
    if (!subject) return;

    const message = prompt('Enter email message:');
    if (!message) return;

    setUpdating(userId);
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/send-email/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert(`Email sent successfully to ${email}`);
      setActiveMenu(null);
    } catch (err) {
      alert('Failed to send email. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const stats = {
    total: totalCount,
    active: users?.filter(u => u.is_active).length || 0,
    inactive: users?.filter(u => !u.is_active).length || 0,
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-(--color-admin-primary) animate-spin mx-auto mb-4" />
          <p className="text-(--color-admin-text-gray)">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg text-(--color-admin-text-dark) mb-2">Error Loading Users</h3>
          <p className="text-(--color-admin-text-gray) mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-6 py-2 bg-(--color-admin-primary) text-white rounded-lg hover:bg-(--color-admin-secondary) transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl mb-2">User Management</h2>
        <p className="text-gray-600">Manage user accounts and view platform statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Users</p>
          <p className="text-2xl">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Active Users</p>
          <p className="text-2xl text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Inactive Users</p>
          <p className="text-2xl text-gray-600">{stats.inactive}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="couple">Couple</option>
                <option value="individual">Individual</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <Loader2 className="w-6 h-6 text-(--color-admin-primary) animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
              {!loading && users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.partner_name && (
                        <p className="text-xs text-blue-600 mt-1">Partner: {user.partner_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.sessions_completed}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${user.total_spent.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={updating === user.id}
                      >
                        {updating === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MoreVertical className="w-4 h-4" />
                        )}
                      </button>
                      {activeMenu === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => updateUserStatus(user.id, true)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            disabled={user.is_active}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Activate
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.id, false)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            disabled={!user.is_active}
                          >
                            <Ban className="w-4 h-4 text-red-600" />
                            Deactivate
                          </button>
                          <button
                            onClick={() => sendEmailToUser(user.id, user.email)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-t border-gray-200"
                          >
                            <Mail className="w-4 h-4 text-blue-600" />
                            Send Email
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, totalCount)} of {totalCount} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
