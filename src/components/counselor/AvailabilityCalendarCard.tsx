import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailabilityCalendarCardProps {
  initialDate?: Date;
}

export function AvailabilityCalendarCard({ initialDate = new Date() }: AvailabilityCalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  // Mock time slots for demonstration
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: true },
  ]);

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
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const toggleTimeSlot = (index: number) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index].available = !newTimeSlots[index].available;
    setTimeSlots(newTimeSlots);
  };

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Availability Manager</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-900 font-medium">{monthName}</p>
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

        <div className="grid grid-cols-7 gap-2">
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
                className={`aspect-square rounded-lg text-sm transition-all font-medium ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-sm"
                    : isToday
                    ? "bg-teal-100 text-teal-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-900 mb-4">
            Manage time slots for {monthName.split(" ")[0]} {selectedDate}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => toggleTimeSlot(index)}
                className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                  slot.available
                    ? "bg-green-100 border-green-600 text-green-700"
                    : "bg-gray-100 border-gray-200 text-gray-400 line-through"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Click time slots to toggle availability
          </p>
        </div>
      )}
    </div>
  );
}