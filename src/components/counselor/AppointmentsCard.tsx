import { Calendar, Clock, ArrowRight, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

interface Appointment {
  id: string;
  coupleName: string;
  date: string;
  time: string;
  sessionType: string;
  status?: "upcoming" | "confirmed" | "pending";
}

interface AppointmentsCardProps {
  appointments: Appointment[];
  onViewAll?: () => void;
}

export function AppointmentsCard({ appointments, onViewAll }: AppointmentsCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Ensure appointments is always an array
  const appointmentsList = Array.isArray(appointments) ? appointments : [];

  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((appointment) => {
      const matchesSearch = 
        appointment.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.sessionType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterStatus === "all" || appointment.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [appointmentsList, searchQuery, filterStatus]);

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
            Pending
          </span>
        );
      case "upcoming":
        return (
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
        <button 
          onClick={onViewAll}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <span className="text-sm">View All Appointments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by couple name or session type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-2">
            {["all", "upcoming", "confirmed", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  filterStatus === status
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-gray-900">{appointment.coupleName}</p>
                  {appointment.status && getStatusBadge(appointment.status)}
                </div>
                <p className="text-xs text-gray-500 mb-2">{appointment.sessionType}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
              
              <button className="px-4 py-2 bg-gray-100 hover:bg-teal-600 hover:text-white text-gray-700 rounded-lg transition-colors text-sm">
                Join Session
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}