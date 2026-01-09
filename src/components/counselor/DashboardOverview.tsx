import { AppointmentsCard } from "./AppointmentsCard";
import { FinancialSummaryCard } from "./FinancialSummaryCard";
import { ActionAlertsCard } from "./ActionAlertsCard";
import { AvailabilityCalendarCard } from "./AvailabilityCalendarCard";
import { EarningsChart } from "./charts/EarningsChart";
import { SessionsChart } from "./charts/SessionsChart";

interface DashboardOverviewProps {
  onViewAllAppointments: () => void;
}

export function DashboardOverview({ onViewAllAppointments }: DashboardOverviewProps) {
  const upcomingAppointments = [
    {
      id: "1",
      coupleName: "Sarah & James Mitchell",
      date: "Dec 12, 2025",
      time: "2:00 PM - 3:00 PM",
      sessionType: "Pre-Marriage Counseling - Session 3",
      status: "confirmed" as const,
    },
    {
      id: "2",
      coupleName: "Emily & Michael Rodriguez",
      date: "Dec 13, 2025",
      time: "10:00 AM - 11:00 AM",
      sessionType: "Initial Consultation",
      status: "pending" as const,
    },
    {
      id: "3",
      coupleName: "Jessica & David Thompson",
      date: "Dec 14, 2025",
      time: "4:00 PM - 5:00 PM",
      sessionType: "Communication Workshop",
      status: "upcoming" as const,
    },
  ];

  const financialData = {
    totalEarningsThisMonth: 8450,
    pendingPayout: 2350,
    nextPayoutDate: "Dec 15, 2025",
  };

  const actionAlerts = [
    {
      id: "1",
      type: "message" as const,
      title: "1 New Client Message",
      description: "Sarah Mitchell sent you a message about rescheduling",
      time: "10 minutes ago",
    },
    {
      id: "2",
      type: "confirmation" as const,
      title: "Appointment Confirmation Needed",
      description: "Emily Rodriguez is waiting for session confirmation",
      time: "1 hour ago",
    },
    {
      id: "3",
      type: "alert" as const,
      title: "Update Your Availability",
      description: "Please review your availability for next week",
      time: "3 hours ago",
    },
  ];

  const earningsData = [
    { month: "Jun", earnings: 6200, sessions: 42 },
    { month: "Jul", earnings: 6800, sessions: 45 },
    { month: "Aug", earnings: 7100, sessions: 48 },
    { month: "Sep", earnings: 7400, sessions: 50 },
    { month: "Oct", earnings: 7200, sessions: 47 },
    { month: "Nov", earnings: 7550, sessions: 51 },
    { month: "Dec", earnings: 8450, sessions: 56 },
  ];

  const sessionsData = [
    { month: "Jun", completed: 42, cancelled: 3 },
    { month: "Jul", completed: 45, cancelled: 2 },
    { month: "Aug", completed: 48, cancelled: 4 },
    { month: "Sep", completed: 50, cancelled: 2 },
    { month: "Oct", completed: 47, cancelled: 5 },
    { month: "Nov", completed: 51, cancelled: 3 },
    { month: "Dec", completed: 56, cancelled: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Appointments and Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <AppointmentsCard 
            appointments={upcomingAppointments} 
            onViewAll={onViewAllAppointments}
          />
          <ActionAlertsCard alerts={actionAlerts} />
        </div>

        {/* Right column - Financial and Availability */}
        <div className="space-y-6">
          <FinancialSummaryCard data={financialData} />
          <AvailabilityCalendarCard />
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="text-[var(--color-text-dark)] mb-6">Earnings Trend</h3>
          <div className="h-64">
            <EarningsChart data={earningsData} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="text-[var(--color-text-dark)] mb-6">Session Analytics</h3>
          <div className="h-64">
            <SessionsChart data={sessionsData} />
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <p className="text-xs text-[var(--color-text-gray)] mb-2">Total Sessions</p>
          <p className="text-2xl text-[var(--color-text-dark)]">142</p>
          <p className="text-xs text-[var(--color-success)] mt-2">+8 this week</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <p className="text-xs text-[var(--color-text-gray)] mb-2">Active Couples</p>
          <p className="text-2xl text-[var(--color-text-dark)]">24</p>
          <p className="text-xs text-[var(--color-primary-teal)] mt-2">3 new this month</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <p className="text-xs text-[var(--color-text-gray)] mb-2">Avg. Rating</p>
          <p className="text-2xl text-[var(--color-text-dark)]">4.9</p>
          <p className="text-xs text-[var(--color-text-gray)] mt-2">Based on 87 reviews</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <p className="text-xs text-[var(--color-text-gray)] mb-2">Hours This Month</p>
          <p className="text-2xl text-[var(--color-text-dark)]">56</p>
          <p className="text-xs text-[var(--color-text-gray)] mt-2">72% capacity</p>
        </div>
      </div>
    </div>
  );
}
