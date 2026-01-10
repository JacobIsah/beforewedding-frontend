import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'https://beforewedding.duckdns.org';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailabilitySlot {
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface CounselorCalendarProps {
  counselorId: string;
  onSelectSlot: (date: string, time: string) => void;
  selectedDate: string;
  selectedTime: string;
}

export function CounselorCalendar({ counselorId, onSelectSlot, selectedDate, selectedTime }: CounselorCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateInternal, setSelectedDateInternal] = useState<Date | null>(
    selectedDate ? new Date(selectedDate) : null
  );
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    if (selectedDateInternal) {
      fetchAvailability(selectedDateInternal);
    }
  }, [selectedDateInternal, counselorId]);

  const fetchAvailability = async (date: Date) => {
    setLoadingAvailability(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/counselors/${counselorId}/availability/?date=${formattedDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Fall back to empty availability on error
      setAvailability([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Convert API availability to time slots
  const getBookedSlots = (date: Date): string[] => {
    const formattedDate = date.toISOString().split('T')[0];
    const dayAvailability = availability.filter(slot => 
      slot.date === formattedDate && !slot.is_available
    );
    return dayAvailability.map(slot => convertTo12Hour(slot.start_time));
  };

  const convertTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Generate time slots for a day
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const bookedSlots = getBookedSlots(date);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    // Generate slots from 9 AM to 5 PM
    for (let hour = 9; hour <= 17; hour++) {
      const time12hr = hour > 12 ? `${(hour - 12).toString().padStart(2, '0')}:00 PM` : `${hour.toString().padStart(2, '0')}:00 AM`;
      
      // Check if slot is in the past for today
      let isPast = false;
      if (isToday) {
        const slotHour = hour;
        isPast = slotHour < now.getHours();
      }

      const isBooked = bookedSlots.includes(time12hr);
      const available = !isBooked && !isPast;

      slots.push({
        time: time12hr,
        available
      });
    }

    return slots;
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const timeSlots = selectedDateInternal ? generateTimeSlots(selectedDateInternal) : [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow selecting past dates
    if (date < today) return;

    setSelectedDateInternal(date);
  };

  const handleTimeClick = (time: string) => {
    if (!selectedDateInternal) return;
    
    const formattedDate = selectedDateInternal.toISOString().split('T')[0];
    onSelectSlot(formattedDate, time);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date: Date) => {
    return selectedDateInternal?.toDateString() === date.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Select Date
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-900 min-w-[140px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isPastDate = isPast(date);
            const isTodayDate = isToday(date);
            const isSelectedDate = isSelected(date);

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={isPastDate}
                className={`aspect-square rounded-lg text-sm transition-all ${
                  isPastDate
                    ? 'text-gray-300 cursor-not-allowed'
                    : isSelectedDate
                    ? 'bg-purple-600 text-white shadow-md'
                    : isTodayDate
                    ? 'bg-purple-50 text-purple-600 border-2 border-purple-600 hover:bg-purple-100'
                    : 'text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-600"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-purple-600 bg-purple-50"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-gray-200 bg-white"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 text-gray-300"></div>
            <span className="text-gray-600">Past</span>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {selectedDateInternal && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {loadingAvailability ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading available times...</span>
            </div>
          ) : (
            <>
          <h3 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Select Time
            {selectedDateInternal && (
              <span className="text-sm text-gray-600 ml-2">
                ({selectedDateInternal.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })})
              </span>
            )}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map(slot => {
              const isSelectedTime = selectedTime === slot.time;
              
              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => slot.available && handleTimeClick(slot.time)}
                  disabled={!slot.available}
                  className={`px-4 py-3 rounded-lg text-sm transition-all relative ${
                    !slot.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : isSelectedTime
                      ? 'bg-purple-600 text-white shadow-md border-2 border-purple-600'
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <span className="block">{slot.time}</span>
                  {isSelectedTime && (
                    <CheckCircle className="w-4 h-4 absolute top-1 right-1" />
                  )}
                  {!slot.available && (
                    <span className="text-xs block mt-1">Booked</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Slots Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-purple-600 bg-purple-600"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-gray-200 bg-white"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-gray-200 bg-gray-100"></div>
              <span className="text-gray-600">Booked</span>
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {!selectedDateInternal && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-900">
            Please select a date to view available time slots
          </p>
        </div>
      )}
    </div>
  );
}
