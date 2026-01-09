import { DollarSign, TrendingUp, Clock } from "lucide-react";

interface FinancialData {
  total_earnings?: number;
  paid_earnings?: number;
  pending_earnings?: number;
  awaiting_approval?: number;
  platform_commission?: number;
  net_earnings?: number;
  next_payout_date?: string;
  hourly_rate?: number;
  // Legacy fields for backwards compatibility
  totalEarningsThisMonth?: number;
  pendingPayout?: number;
  nextPayoutDate?: string;
}

interface FinancialSummaryCardProps {
  data: FinancialData;
}

export function FinancialSummaryCard({ data }: FinancialSummaryCardProps) {
  // Handle both new API format and legacy format
  const totalEarnings = data.total_earnings ?? data.totalEarningsThisMonth ?? 0;
  const pendingPayout = data.pending_earnings ?? data.pendingPayout ?? 0;
  const nextPayoutDate = data.next_payout_date 
    ? new Date(data.next_payout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : data.nextPayoutDate ?? 'Not scheduled';
  const paidEarnings = data.paid_earnings ?? 0;
  const hourlyRate = data.hourly_rate ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Financial Summary</h3>
      
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl text-white">
          <p className="text-sm opacity-90 mb-1">Total Earnings</p>
          <p className="text-3xl font-semibold">${totalEarnings.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Pending Payout</p>
            <p className="text-xl text-gray-900 font-semibold">${pendingPayout.toLocaleString()}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Next Payout</p>
            <p className="text-sm text-gray-900 font-medium">{nextPayoutDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Paid Out</p>
            <p className="text-lg text-green-600 font-semibold">${paidEarnings.toLocaleString()}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
            <p className="text-lg text-gray-900 font-semibold">${hourlyRate}/hr</p>
          </div>
        </div>
        
        <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium">
          View Full Earnings Report
        </button>
      </div>
    </div>
  );
}