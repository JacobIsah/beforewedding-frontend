import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Eye, MoreVertical, Star, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE_URL = 'https://beforewedding.duckdns.org';

interface CounselorApplication {
  id: number;
  professional_name: string;
  email: string;
  education: string;
  license_number: string;
  years_of_experience: number;
  hourly_rate: string;
  specializations: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  verification_status?: string;
  bio?: string;
  rejection_reason?: string;
}

interface ApplicationsResponse {
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  results: CounselorApplication[];
}

export function CounselorManagement() {
  const [view, setView] = useState<'applications' | 'counselors'>('applications');
  const [applications, setApplications] = useState<CounselorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CounselorApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [processing, setProcessing] = useState<number | null>(null);

  // Calculate counts for the view toggle buttons
  const pendingCount = applications?.filter(a => a.status === 'pending').length || 0;
  const approvedCount = applications?.filter(a => a.status === 'approved').length || 0;

  useEffect(() => {
    fetchApplications();
  }, [view, page]);

  const fetchApplications = async () => {
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
        limit: '20',
        status: view === 'applications' ? 'pending' : 'approved',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/counselor-applications/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin permissions required.');
        }
        throw new Error('Failed to load applications');
      }

      const data: ApplicationsResponse = await response.json();
      console.log('Applications API response:', data);
      setApplications(data.results || data.applications || []);
      setTotalPages(data.total_pages || 1);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessing(id);
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/verify-counselor/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve application');
      }

      await fetchApplications();
      setSelectedApplication(null);
      alert('Application approved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve application');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessing(id);
    try {
      const token = localStorage.getItem('admin_access_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/reject-counselor/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject application');
      }

      await fetchApplications();
      setSelectedApplication(null);
      alert('Application rejected successfully.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject application');
    } finally {
      setProcessing(null);
    }
  };

  const filteredApplications = (applications || []).filter(app =>
    app.professional_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.specializations?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && applications.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-(--color-admin-primary) animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 mb-2">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-(--color-admin-primary) text-white rounded-lg hover:opacity-90"
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
        <h2 className="text-2xl mb-2">Counselor Management</h2>
        <p className="text-gray-600">Review applications and manage counselor profiles</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setView('applications');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg ${
            view === 'applications'
              ? 'bg-(--color-admin-primary) text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Pending Applications ({pendingCount})
        </button>
        <button
          onClick={() => {
            setView('counselors');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg ${
            view === 'counselors'
              ? 'bg-(--color-admin-primary) text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Active Counselors ({approvedCount})
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Counselor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Experience</th>
                {view === 'applications' && (
                  <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Applied Date</th>
                )}
                {view === 'counselors' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Sessions</th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={view === 'applications' ? 5 : 6} className="px-6 py-8 text-center">
                    <Loader2 className="w-6 h-6 text-(--color-admin-primary) animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={view === 'applications' ? 5 : 6} className="px-6 py-8 text-center text-gray-500">
                    No {view === 'applications' ? 'applications' : 'counselors'} found
                  </td>
                </tr>
              )}
              {!loading && filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm">{application.professional_name}</p>
                      <p className="text-sm text-gray-500">{application.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{application.education}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {application.specializations?.slice(0, 2).map((spec) => (
                        <span key={spec} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                      {application.specializations?.length > 2 && (
                        <span className="text-xs text-gray-500">+{application.specializations.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{application.years_of_experience} years</td>
                  {view === 'applications' && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  )}
                  {view === 'counselors' && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">N/A</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">0</td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {view === 'applications' && (
                        <>
                          <button
                            onClick={() => handleApprove(application.id)}
                            disabled={processing === application.id}
                            className="p-1 hover:bg-green-100 rounded text-green-600 disabled:opacity-50"
                            title="Approve"
                          >
                            {processing === application.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(application.id)}
                            disabled={processing === application.id}
                            className="p-1 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {view === 'counselors' && (
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, totalCount)} of {totalCount} {view === 'applications' ? 'applications' : 'counselors'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Professional Name</p>
                  <p className="text-sm">{selectedApplication.professional_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Education</p>
                  <p className="text-sm">{selectedApplication.education}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">License Number</p>
                  <p className="text-sm">{selectedApplication.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="text-sm">{selectedApplication.years_of_experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hourly Rate</p>
                  <p className="text-sm">${selectedApplication.hourly_rate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Specializations</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedApplication.specializations?.map((spec) => (
                      <span key={spec} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="text-sm mt-1">{selectedApplication.bio}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted At</p>
                  <p className="text-sm">
                    {new Date(selectedApplication.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm capitalize">{selectedApplication.status}</p>
                </div>
                {selectedApplication.rejection_reason && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Rejection Reason</p>
                    <p className="text-sm text-red-600">{selectedApplication.rejection_reason}</p>
                  </div>
                )}
              </div>
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedApplication.id)}
                    disabled={processing === selectedApplication.id}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processing === selectedApplication.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={processing === selectedApplication.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
