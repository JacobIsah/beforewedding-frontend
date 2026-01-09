import { LayoutDashboard, Calendar, Clock, DollarSign, Users, User } from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "schedule", label: "My Schedule / Availability Manager", icon: Calendar },
    { id: "appointments", label: "Upcoming Appointments", icon: Clock },
    { id: "clients", label: "My Clients", icon: Users },
    { id: "earnings", label: "Earnings & Payouts", icon: DollarSign },
    { id: "profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-blue-900">BeforeWedding</h2>
        <p className="text-xs text-gray-500 mt-1">Counselor Portal</p>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm text-left leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}