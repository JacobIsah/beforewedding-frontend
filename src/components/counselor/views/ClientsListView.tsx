import { useState } from "react";
import { Search, Filter, Users, Calendar, Heart } from "lucide-react";

interface Client {
  id: string;
  coupleName: string;
  weddingDate: string;
  nextSession: string;
  sessionsCompleted: number;
  totalSessions: number;
  status: "active" | "completed" | "inactive";
  packageType: string;
}

interface ClientsListViewProps {
  onSelectClient: (clientId: string) => void;
}

export function ClientsListView({ onSelectClient }: ClientsListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const clients: Client[] = [
    {
      id: "1",
      coupleName: "Sarah & James Mitchell",
      weddingDate: "June 15, 2026",
      nextSession: "Dec 12, 2025",
      sessionsCompleted: 3,
      totalSessions: 6,
      status: "active",
      packageType: "Complete Pre-Marriage Package",
    },
    {
      id: "2",
      coupleName: "Emily & Michael Rodriguez",
      weddingDate: "August 22, 2026",
      nextSession: "Dec 13, 2025",
      sessionsCompleted: 1,
      totalSessions: 6,
      status: "active",
      packageType: "Complete Pre-Marriage Package",
    },
    {
      id: "3",
      coupleName: "Jessica & David Thompson",
      weddingDate: "May 10, 2026",
      nextSession: "Dec 14, 2025",
      sessionsCompleted: 2,
      totalSessions: 4,
      status: "active",
      packageType: "Communication Workshop Series",
    },
    {
      id: "4",
      coupleName: "Amanda & Christopher Lee",
      weddingDate: "July 8, 2026",
      nextSession: "Dec 15, 2025",
      sessionsCompleted: 4,
      totalSessions: 6,
      status: "active",
      packageType: "Complete Pre-Marriage Package",
    },
    {
      id: "5",
      coupleName: "Rachel & Steven Brown",
      weddingDate: "April 3, 2026",
      nextSession: "Dec 16, 2025",
      sessionsCompleted: 1,
      totalSessions: 3,
      status: "active",
      packageType: "Financial Planning Sessions",
    },
    {
      id: "6",
      coupleName: "Lauren & Daniel Martinez",
      weddingDate: "March 20, 2026",
      nextSession: "-",
      sessionsCompleted: 6,
      totalSessions: 6,
      status: "completed",
      packageType: "Complete Pre-Marriage Package",
    },
  ];

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.coupleName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">My Clients</h2>
          <p className="text-gray-500 mt-1">
            Manage your client relationships and sessions
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
          <Users className="w-5 h-5 text-teal-600" />
          <span className="text-gray-900">{clients.length} Total Clients</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by couple name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <div className="flex gap-2">
                {["all", "active", "completed", "inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      filterStatus === status
                        ? "bg-teal-600 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {filteredClients.length} {filteredClients.length === 1 ? "client" : "clients"}
            </p>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-600 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{client.coupleName}</h3>
                  <p className="text-sm text-gray-500">{client.packageType}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Heart className="w-4 h-4 text-teal-600" />
                  <span>Wedding: {client.weddingDate}</span>
                </div>
                {client.nextSession !== "-" && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Next Session: {client.nextSession}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm text-gray-900">
                    {client.sessionsCompleted} / {client.totalSessions} sessions
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${(client.sessionsCompleted / client.totalSessions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
