import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertCircle, Calendar, MessageSquare, Heart, Trash2, Check, Filter } from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';

type NotificationType = 'assessment' | 'appointment' | 'partner' | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionLink?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'partner',
    title: 'Partner Completed Assessment',
    message: 'John Smith completed the "Communication and Conflict Resolution" assessment. View your compatibility results now.',
    time: '2 hours ago',
    read: false,
    actionLabel: 'View Results'
  },
  {
    id: 2,
    type: 'appointment',
    title: 'Upcoming Session Reminder',
    message: 'Your counseling session with Dr. Sarah Johnson is scheduled for tomorrow at 2:00 PM.',
    time: '5 hours ago',
    read: false,
    actionLabel: 'View Details'
  },
  {
    id: 3,
    type: 'assessment',
    title: 'New Assessment Available',
    message: 'The "Health and Well-being" assessment is ready for you to take. Complete it to improve your compatibility insights.',
    time: '1 day ago',
    read: true,
    actionLabel: 'Take Assessment'
  },
  {
    id: 4,
    type: 'system',
    title: 'New Materials Added',
    message: 'We\'ve added 5 new recommended materials about "Financial Planning" to help strengthen your relationship.',
    time: '2 days ago',
    read: true,
    actionLabel: 'Browse Materials'
  },
  {
    id: 5,
    type: 'partner',
    title: 'Partner Invitation Accepted',
    message: 'John Smith accepted your partner invitation. You can now take assessments together!',
    time: '3 days ago',
    read: true
  },
  {
    id: 6,
    type: 'appointment',
    title: 'Session Confirmed',
    message: 'Your appointment with Rev. Michael Chen on Dec 22, 2025 at 10:00 AM has been confirmed.',
    time: '4 days ago',
    read: true,
    actionLabel: 'View Appointment'
  },
  {
    id: 7,
    type: 'assessment',
    title: 'Assessment Reminder',
    message: 'You have 2 pending assessments. Complete them to get a full compatibility overview.',
    time: '5 days ago',
    read: true,
    actionLabel: 'View Assessments'
  }
];

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'assessment':
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-6 h-6 text-purple-600" />;
      case 'partner':
        return <Heart className="w-6 h-6 text-pink-600" />;
      case 'system':
        return <Bell className="w-6 h-6 text-green-600" />;
    }
  };

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case 'assessment':
        return 'bg-blue-100';
      case 'appointment':
        return 'bg-purple-100';
      case 'partner':
        return 'bg-pink-100';
      case 'system':
        return 'bg-green-100';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        currentPage="notifications"
        onNavigateToDashboard={() => navigate('/dashboard')}
        onNavigateToMaterials={() => navigate('/materials')}
        onNavigateToCompatibilityTest={() => navigate('/compatibility-test')}
        onNavigateToNotifications={() => navigate('/notifications')}
        onNavigateToAccount={() => navigate('/account')}
        onNavigateToHelp={() => navigate('/help')}
        onLogout={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        }}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2">Notifications</h1>
                <p className="text-blue-100">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('partner')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === 'partner'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Partner ({notifications.filter(n => n.type === 'partner').length})
              </button>
              <button
                onClick={() => setFilter('assessment')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === 'assessment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Assessments ({notifications.filter(n => n.type === 'assessment').length})
              </button>
              <button
                onClick={() => setFilter('appointment')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === 'appointment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Appointments ({notifications.filter(n => n.type === 'appointment').length})
              </button>
              <button
                onClick={() => setFilter('system')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === 'system'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                System ({notifications.filter(n => n.type === 'system').length})
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "You're all caught up! We'll notify you when there's something new."
                  : `No ${filter} notifications at this time.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl border-2 transition-all ${
                    notification.read 
                      ? 'border-gray-200' 
                      : 'border-blue-500 shadow-md'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 ${getNotificationBgColor(notification.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg text-gray-900">{notification.title}</h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{notification.message}</p>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-gray-500">{notification.time}</span>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Mark as read
                              </button>
                            )}
                            {notification.actionLabel && (
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                {notification.actionLabel}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}