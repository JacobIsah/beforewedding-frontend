import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, X } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
  clientName?: string;
}

export function ScheduleView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [selectedWeekView, setSelectedWeekView] = useState<"month" | "week">("month");

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const timeSlots: TimeSlot[] = [
    { time: "8:00 AM", available: true },
    { time: "9:00 AM", available: true, booked: true, clientName: "Sarah & James Mitchell" },
    { time: "10:00 AM", available: true, booked: true, clientName: "Emily & Michael Rodriguez" },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: false },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: true, booked: true, clientName: "Jessica & David Thompson" },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: true },
    { time: "5:00 PM", available: false },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Schedule & Availability Manager</h2>
          <p className="text-gray-500 mt-1">
            Manage your availability and view scheduled sessions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm">Block Time Off</span>
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedWeekView("month")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            selectedWeekView === "month"
              ? "bg-teal-600 text-white"
              : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          Month View
        </button>
        <button
          onClick={() => setSelectedWeekView("week")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            selectedWeekView === "week"
              ? "bg-teal-600 text-white"
              : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          Week View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isSelected = selectedDate === day;
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square rounded-lg text-sm transition-all ${
                    isSelected
                      ? "bg-teal-600 text-white"
                      : isToday
                      ? "bg-teal-100 text-teal-600"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  {day}
                  {(day === 12 || day === 13 || day === 14) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {monthName.split(" ")[0]} {selectedDate}
            </h3>
            <Calendar className="w-5 h-5 text-teal-600" />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all ${
                  slot.booked
                    ? "bg-teal-50 border-teal-600"
                    : slot.available
                    ? "bg-green-50 border-gray-200 hover:border-green-600"
                    : "bg-gray-50 border-gray-200 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{slot.time}</span>
                  </div>
                  {slot.booked ? (
                    <span className="text-xs text-teal-600">Booked</span>
                  ) : slot.available ? (
                    <span className="text-xs text-green-600">Available</span>
                  ) : (
                    <span className="text-xs text-gray-500">Blocked</span>
                  )}
                </div>
                {slot.clientName && (
                  <p className="text-xs text-gray-500 mt-1 ml-6">{slot.clientName}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions & Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-green-100"></div>
            <div>
              <p className="text-sm text-gray-900">Available Slots</p>
              <p className="text-xs text-gray-500">Open for booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-teal-100"></div>
            <div>
              <p className="text-sm text-gray-900">Booked Sessions</p>
              <p className="text-xs text-gray-500">Confirmed appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-900">Blocked Time</p>
              <p className="text-xs text-gray-500">Unavailable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
