import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dashboard, 
  DashboardOverview, 
  Header, 
  Sidebar,
  UserManagement,
  CounselorManagement,
  CounselorsManagement,
  CouplesManagement,
  AssessmentsManagement,
  ContentManagement,
  ResourcesManagement,
  BlogManagement,
  UsersContacts,
  FinancialOverview,
  PlatformMonitoring
} from '../../components/admin';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    navigate('/admin/login');
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeItem={activeSection} 
        onItemClick={handleNavigate}
        onLogout={handleLogout}
      />
      
      <div className="flex-1">
        <Header 
          profileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
          userName="Admin"
          onSettingsClick={() => handleNavigate('settings')}
        />
        
        <main className="p-8">
          {activeSection === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} />
          )}
          {activeSection === 'overview' && (
            <DashboardOverview />
          )}
          {activeSection === 'users' && (
            <UserManagement />
          )}
          {activeSection === 'counselor-management' && (
            <CounselorManagement />
          )}
          {activeSection === 'counselors' && (
            <CounselorsManagement />
          )}
          {activeSection === 'couples' && (
            <CouplesManagement />
          )}
          {activeSection === 'assessments' && (
            <AssessmentsManagement />
          )}
          {activeSection === 'content' && (
            <ContentManagement />
          )}
          {activeSection === 'resources' && (
            <ResourcesManagement />
          )}
          {activeSection === 'blog' && (
            <BlogManagement />
          )}
          {activeSection === 'contacts' && (
            <UsersContacts />
          )}
          {activeSection === 'financial' && (
            <FinancialOverview />
          )}
          {activeSection === 'monitoring' && (
            <PlatformMonitoring />
          )}
        </main>
      </div>
    </div>
  );
}
