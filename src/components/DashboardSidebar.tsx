import { LayoutDashboard, BookOpen, FileText, Bell, User, HelpCircle, LogOut, HeartHandshake } from 'lucide-react';

interface DashboardSidebarProps {
  currentPage: string;
  onNavigateToDashboard: () => void;
  onNavigateToMaterials: () => void;
  onNavigateToCompatibilityTest: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToAccount: () => void;
  onNavigateToHelp: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  currentPage,
  onNavigateToDashboard,
  onNavigateToMaterials,
  onNavigateToCompatibilityTest,
  onNavigateToNotifications,
  onNavigateToAccount,
  onNavigateToHelp,
  onLogout
}: DashboardSidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-8 h-8 text-purple-500" />
          <div>
            <div className="text-sm text-gray-400">Before</div>
            <div className="text-sm">Wedding</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <button
          onClick={onNavigateToDashboard}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={onNavigateToMaterials}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            currentPage === 'recommended-materials' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Books</span>
        </button>

        <button
          onClick={onNavigateToCompatibilityTest}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            currentPage === 'compatibility-test' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Compatibility Test</span>
        </button>

        <button
          onClick={onNavigateToNotifications}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            currentPage === 'notifications' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </button>

        <div className="my-6 border-t border-gray-800"></div>

        <button
          onClick={onNavigateToAccount}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            currentPage === 'account' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </button>

        <button
          onClick={onNavigateToHelp}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            currentPage === 'help' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>

        <div className="my-6 border-t border-gray-800"></div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </nav>
    </div>
  );
}
