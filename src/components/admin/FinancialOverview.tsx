import { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Users, Download, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', sessions: 3200, subscriptions: 1000 },
  { month: 'Feb', sessions: 4800, subscriptions: 1000 },
  { month: 'Mar', sessions: 6200, subscriptions: 1000 },
  { month: 'Apr', sessions: 7900, subscriptions: 1000 },
  { month: 'May', sessions: 9500, subscriptions: 1000 },
  { month: 'Jun', sessions: 11800, subscriptions: 1000 },
];

const payoutData = [
  { id: 1, name: 'Dr. Jennifer Wilson', sessions: 87, earnings: 13050, pending: 2100, status: 'Pending Approval', lastSession: '2024-12-10' },
  { id: 2, name: 'Dr. Emily Roberts', sessions: 63, earnings: 10080, pending: 1600, status: 'Pending Approval', lastSession: '2024-12-11' },
  { id: 3, name: 'Michael Chen, LCSW', sessions: 51, earnings: 7140, pending: 980, status: 'Pending Approval', lastSession: '2024-12-09' },
  { id: 4, name: 'Dr. Sarah Anderson', sessions: 44, earnings: 6820, pending: 0, status: 'Paid', lastSession: '2024-11-30' },
  { id: 5, name: 'Dr. Robert Williams', sessions: 38, earnings: 5700, pending: 760, status: 'Pending Approval', lastSession: '2024-12-12' },
];

const revenueBreakdown = [
  { name: 'Counseling Sessions', value: 11800, color: '#ec4899' },
  { name: 'Premium Features', value: 1000, color: '#8b5cf6' },
];

export function FinancialOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<typeof payoutData[0] | null>(null);

  const totalRevenue = 12800;
  const counselorPayouts = 30390;
  const platformCommission = totalRevenue - (counselorPayouts * 0.2);
  const pendingPayouts = payoutData.filter(p => p.status === 'Pending Approval').reduce((sum, p) => sum + p.pending, 0);
  const pendingCount = payoutData.filter(p => p.status === 'Pending Approval').length;

  const handleApprovePayout = (counselor: typeof payoutData[0]) => {
    setSelectedPayout(counselor);
    setShowApprovalModal(true);
  };

  const confirmApproval = () => {
    // Handle approval logic here
    console.log('Approved payout for:', selectedPayout?.name);
    setShowApprovalModal(false);
    setSelectedPayout(null);
  };

  const rejectPayout = () => {
    // Handle rejection logic here
    console.log('Rejected payout for:', selectedPayout?.name);
    setShowApprovalModal(false);
    setSelectedPayout(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Financial Overview</h1>
          <p className="text-gray-600">Track revenue, commissions, and counselor payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
            Export
          </button>
        </div>
      </div>

      {/* Alert for Pending Approvals */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-900">
              <strong>{pendingCount} counselor payment{pendingCount > 1 ? 's' : ''}</strong> pending your approval
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Total pending: ${pendingPayouts.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-100">
            <TrendingUp className="w-4 h-4" />
            <span>+21.8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Platform Commission</p>
              <p className="text-3xl text-gray-900">${platformCommission.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">20% of session fees</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Counselor Payouts</p>
              <p className="text-3xl text-gray-900">${counselorPayouts.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Across 47 counselors</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-amber-100 border-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending Approvals</p>
              <p className="text-3xl text-gray-900">${pendingPayouts.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-amber-600">{pendingCount} awaiting approval</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#ec4899" strokeWidth={2} name="Sessions" />
              <Line type="monotone" dataKey="subscriptions" stroke="#8b5cf6" strokeWidth={2} name="Subscriptions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {revenueBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm text-gray-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Counselor Payouts - Payment Approval */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900">Counselor Payment Approvals</h3>
              <p className="text-sm text-gray-600 mt-1">Review and approve pending counselor payments</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Counselor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Pending Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Last Session</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payoutData.map((counselor) => (
                <tr key={counselor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{counselor.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {counselor.sessions}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    ${counselor.earnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {counselor.pending > 0 ? (
                      <span className="text-lg text-gray-900">${counselor.pending.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      counselor.status === 'Pending Approval' 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {counselor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(counselor.lastSession).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {counselor.status === 'Pending Approval' && counselor.pending > 0 ? (
                      <button 
                        onClick={() => handleApprovePayout(counselor)}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Review & Approve
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Approve Payment</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Counselor:</span>
                <span className="text-gray-900">{selectedPayout.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sessions Completed:</span>
                <span className="text-gray-900">{selectedPayout.sessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Session:</span>
                <span className="text-gray-900">{new Date(selectedPayout.lastSession).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="text-gray-900">Payment Amount:</span>
                <span className="text-2xl text-gray-900">${selectedPayout.pending.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                This payment will be processed and transferred to the counselor's registered account within 2-3 business days.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={confirmApproval}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Payment
              </button>
              <button
                onClick={rejectPayout}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </div>
            
            <button
              onClick={() => setShowApprovalModal(false)}
              className="w-full mt-3 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}