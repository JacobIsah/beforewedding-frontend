import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, CreditCard } from "lucide-react";
import { EarningsChart } from "../charts/EarningsChart";

interface Transaction {
  id: string;
  date: string;
  coupleName: string;
  sessionType: string;
  amount: number;
  status: "paid" | "pending" | "processing";
}

export function EarningsView() {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "Dec 10, 2025",
      coupleName: "Sarah & James Mitchell",
      sessionType: "Pre-Marriage Counseling - Session 3",
      amount: 150,
      status: "paid",
    },
    {
      id: "2",
      date: "Dec 9, 2025",
      coupleName: "Emily & Michael Rodriguez",
      sessionType: "Initial Consultation",
      amount: 200,
      status: "paid",
    },
    {
      id: "3",
      date: "Dec 8, 2025",
      coupleName: "Jessica & David Thompson",
      sessionType: "Communication Workshop",
      amount: 175,
      status: "processing",
    },
    {
      id: "4",
      date: "Dec 7, 2025",
      coupleName: "Amanda & Christopher Lee",
      sessionType: "Conflict Resolution",
      amount: 150,
      status: "paid",
    },
    {
      id: "5",
      date: "Dec 12, 2025",
      coupleName: "Rachel & Steven Brown",
      sessionType: "Financial Planning Session",
      amount: 180,
      status: "pending",
    },
  ];

  const monthlyStats = {
    totalEarnings: 8450,
    pendingPayout: 2350,
    completedSessions: 56,
    averageSessionRate: 162,
    growthPercentage: 12,
  };

  const upcomingPayouts = [
    { date: "Dec 15, 2025", amount: 2350 },
    { date: "Dec 30, 2025", amount: 3100 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const earningsChartData = [
    { month: "Jun", earnings: 6200, sessions: 42 },
    { month: "Jul", earnings: 6800, sessions: 45 },
    { month: "Aug", earnings: 7100, sessions: 48 },
    { month: "Sep", earnings: 7400, sessions: 50 },
    { month: "Oct", earnings: 7200, sessions: 47 },
    { month: "Nov", earnings: 7550, sessions: 51 },
    { month: "Dec", earnings: 8450, sessions: 56 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Earnings & Payouts</h2>
          <p className="text-gray-500 mt-1">
            Track your income and manage payouts
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm">Download Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">+{monthlyStats.growthPercentage}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
          <p className="text-2xl text-gray-900">
            ${monthlyStats.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Pending Payout</p>
          <p className="text-2xl text-gray-900">
            ${monthlyStats.pendingPayout.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Next: Dec 15, 2025</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Completed Sessions</p>
          <p className="text-2xl text-gray-900">
            {monthlyStats.completedSessions}
          </p>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-1">Avg. Session Rate</p>
          <p className="text-2xl text-gray-900">
            ${monthlyStats.averageSessionRate}
          </p>
          <p className="text-xs text-gray-500 mt-2">Per session</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-6">Earnings Overview</h3>
        <div className="h-80">
          <EarningsChart data={earningsChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payouts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-6">Upcoming Payouts</h3>
          <div className="space-y-4">
            {upcomingPayouts.map((payout, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="text-sm text-gray-900 mb-1">Payout Amount</p>
                  <p className="text-xs text-gray-500">{payout.date}</p>
                </div>
                <p className="text-xl text-green-600">
                  ${payout.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-6">Recent Transactions</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-1">
                    {transaction.coupleName}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 mb-1">
                    ${transaction.amount}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-6">All Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500">Client</th>
                <th className="text-left py-3 px-4 text-xs text-gray-500">Session Type</th>
                <th className="text-right py-3 px-4 text-xs text-gray-500">Amount</th>
                <th className="text-right py-3 px-4 text-xs text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">{transaction.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{transaction.coupleName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{transaction.sessionType}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                    ${transaction.amount}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
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