import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Counselors } from './pages/Counselors';
import { Insights } from './pages/Insights';
import { CounselorProfile } from './pages/CounselorProfile';
import { BookingPage } from './pages/BookingPage';
import { CounselorApplication } from './pages/CounselorApplication';
import { LoginPage as CounselorLoginPage } from './pages/CounselorLoginPage';
import { BlogPost } from './pages/BlogPost';
import { EmailVerification } from './pages/EmailVerification';
import { EmailVerificationResult } from './pages/EmailVerificationResult';
import { AcceptInvitation } from './pages/AcceptInvitation';
import { PartnerInvitation } from './pages/PartnerInvitation';
import { Dashboard } from './pages/Dashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import { CounselorsMarketplace } from './pages/CounselorsMarketplace';
import { RecommendedMaterials } from './pages/RecommendedMaterials';
import { MaterialView } from './pages/MaterialView';
import { CompatibilityTest } from './pages/CompatibilityTest';
import { Notifications } from './pages/Notifications';
import { Account } from './pages/Account';
import { Help } from './pages/Help';
import { Assessment } from './pages/Assessment';
import { Payment } from './pages/Payment';
import { DemoModal } from './components/DemoModal';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminRegistration } from './pages/admin/AdminRegistration';

export default function App() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home onOpenDemo={() => setIsDemoOpen(true)} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/counselors" element={<Counselors />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/counselor/:id" element={<CounselorProfile />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        
        {/* Counselor Routes */}
        <Route path="/counselor-application" element={<CounselorApplication />} />
        <Route path="/counselor-login" element={<CounselorLoginPage />} />
        <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegistration />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Email Verification */}
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/verify-email" element={<EmailVerificationResult />} />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/partner-invitation" element={<PartnerInvitation />} />
        
        {/* Protected User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking/:counselorId" element={<BookingPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/counselors-marketplace" element={<CounselorsMarketplace />} />
        <Route path="/materials" element={<RecommendedMaterials />} />
        <Route path="/material/:id" element={<MaterialView />} />
        <Route path="/compatibility-test" element={<CompatibilityTest />} />
        <Route path="/assessment/:categoryId" element={<Assessment />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/account" element={<Account />} />
        <Route path="/help" element={<Help />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </BrowserRouter>
  );
}
