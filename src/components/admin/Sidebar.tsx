import { LayoutDashboard, Users, ClipboardList, BookOpen, Briefcase, DollarSign, Heart, FileText, Activity, Mail, LogOut, UserCheck } from 'lucide-react';

interface SidebarProps {
  readonly activeItem: string;
  readonly onItemClick: (item: string) => void;
  readonly onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'counselor-management', label: 'Counselor Applications', icon: UserCheck },
  { id: 'counselors', label: 'Counselors', icon: Briefcase },
  { id: 'couples', label: 'Couples', icon: Heart },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'contacts', label: 'Support Contacts', icon: Mail },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
] as const;

export function Sidebar({ activeItem, onItemClick, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-(--color-admin-border) flex flex-col h-screen sticky top-0">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900">DuringCourtship</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-linear-to-r from-pink-50 to-rose-50 text-rose-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@duringcourtship.com</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}