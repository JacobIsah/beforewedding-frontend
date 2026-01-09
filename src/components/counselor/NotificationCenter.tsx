import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, Calendar, AlertCircle, Check, X } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "appointment" | "reminder";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  clientName?: string;
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "message",
      title: "New Message from Sarah & James Mitchell",
      message: "Question about our next session time - can we move it to 3pm?",
      time: "5 minutes ago",
      isRead: false,
      clientName: "Sarah & James Mitchell",
      actionRequired: true,
    },
    {
      id: "2",
      type: "appointment",
      title: "Appointment Reminder",
      message: "Session with Emily & Michael Rodriguez in 1 hour",
      time: "1 hour",
      isRead: false,
      clientName: "Emily & Michael Rodriguez",
      actionRequired: false,
    },
    {
      id: "3",
      type: "reminder",
      title: "Session Notes Pending",
      message: "Please complete session notes for Jessica & David Thompson",
      time: "2 hours ago",
      isRead: false,
      clientName: "Jessica & David Thompson",
      actionRequired: true,
    },
    {
      id: "4",
      type: "message",
      title: "New Message from Amanda & Christopher Lee",
      message: "Thank you for the last session! We've been practicing the communication exercises.",
      time: "3 hours ago",
      isRead: false,
      clientName: "Amanda & Christopher Lee",
      actionRequired: false,
    },
    {
      id: "5",
      type: "appointment",
      title: "Appointment Confirmed",
      message: "Rachel & Steven Brown confirmed their session for tomorrow",
      time: "5 hours ago",
      isRead: true,
      clientName: "Rachel & Steven Brown",
      actionRequired: false,
    },
    {
      id: "6",
      type: "reminder",
      title: "Weekly Schedule Review",
      message: "Review and update your availability for next week",
      time: "1 day ago",
      isRead: true,
      actionRequired: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "appointment":
        return <Calendar className="w-5 h-5" />;
      case "reminder":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "message":
        return "text-[var(--color-primary-teal)] bg-[var(--color-primary-teal)] bg-opacity-10";
      case "appointment":
        return "text-[var(--color-primary-blue)] bg-[var(--color-primary-blue)] bg-opacity-10";
      case "reminder":
        return "text-[var(--color-warning)] bg-[var(--color-warning)] bg-opacity-10";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[var(--color-bg-light)] rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-[var(--color-text-gray)]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl border border-[var(--color-border)] shadow-2xl z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[var(--color-border)] bg-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[var(--color-text-dark)]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[var(--color-primary-teal)] hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-xs text-[var(--color-text-gray)]">
                {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-[var(--color-text-gray)] mx-auto mb-2 opacity-50" />
                <p className="text-sm text-[var(--color-text-gray)]">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-[var(--color-bg-light)] transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (onNotificationClick) {
                        onNotificationClick(notification);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm text-[var(--color-text-dark)] line-clamp-1 font-medium">
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 hover:bg-white rounded transition-colors flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-[var(--color-text-gray)]" />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--color-text-gray)] line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {notification.time}
                          </span>
                          {notification.actionRequired && (
                            <span className="text-xs px-2 py-0.5 bg-[var(--color-warning)] bg-opacity-10 text-[var(--color-warning)] rounded font-medium">
                              Action Required
                            </span>
                          )}
                        </div>
                        {!notification.isRead && (
                          <div className="flex items-center gap-1 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-[var(--color-primary-teal)] hover:underline flex items-center gap-1 font-medium"
                            >
                              <Check className="w-3 h-3" />
                              Mark as read
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[var(--color-border)] bg-white">
              <button className="w-full text-sm text-[var(--color-primary-teal)] hover:bg-[var(--color-bg-light)] py-2 rounded-lg transition-colors font-medium">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}