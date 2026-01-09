import { useEffect, useState } from 'react';
import { DashboardOverview, Sidebar, Header } from '../components/counselor';
import { ScheduleView } from '../components/counselor/views/ScheduleView';
import { AppointmentsView } from '../components/counselor/views/AppointmentsView';
import { ClientsListView } from '../components/counselor/views/ClientsListView';
import { EarningsView } from '../components/counselor/views/EarningsView';
import { CounselorProfileView } from '../components/counselor/views/CounselorProfileView';

interface CounselorDashboardData {
  id: number;
  professional_name: string;
  specialties: string[];
  hourly_rate: string;
  verification_status: string;
  is_active: boolean;
  total_earnings: string;
  pending_balance: string;
  upcoming_appointments_count: number;
}

export default function CounselorDashboard() {
  const [data, setData] = useState<CounselorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('counselor_access_token');
        if (!token) {
          setError('Authentication credentials were not provided. Please log in.');
          setLoading(false);
          return;
        }
        const response = await fetch('https://3.107.197.17/api/counselors/dashboard/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (!response.ok) {
          setError(result.error || result.detail || 'Unable to load dashboard.');
        } else {
          setData(result);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Network error. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeItem={activeView} onItemClick={setActiveView} />
      <div className="flex-1">
        <Header 
          profileImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
          userName={data.professional_name}
          onSettingsClick={() => setActiveView('profile')}
        />
        <main className="p-8">
          {activeView === 'dashboard' && (
            <DashboardOverview 
              onViewAllAppointments={() => setActiveView('appointments')}
            />
          )}
          {activeView === 'schedule' && <ScheduleView />}
          {activeView === 'appointments' && <AppointmentsView />}
          {activeView === 'clients' && <ClientsListView />}
          {activeView === 'earnings' && <EarningsView />}
          {activeView === 'profile' && <CounselorProfileView />}
        </main>
      </div>
    </div>
  );
}
