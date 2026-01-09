import { useState } from 'react';
import { Activity, Users, TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityLog {
  id: number;
  type: 'user_signup' | 'assessment_completed' | 'counselor_booked' | 'payment' | 'blog_view';
  description: string;
  user?: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const activityData = [
  { hour: '00:00', users: 12, assessments: 5, bookings: 2 },
  { hour: '04:00', users: 8, assessments: 3, bookings: 1 },
  { hour: '08:00', users: 45, assessments: 18, bookings: 7 },
  { hour: '12:00', users: 67, assessments: 28, bookings: 12 },
  { hour: '16:00', users: 89, assessments: 35, bookings: 15 },
  { hour: '20:00', users: 54, assessments: 22, bookings: 9 },
];

const recentActivity: ActivityLog[] = [
  {
    id: 1,
    type: 'user_signup',
    description: 'New couple registered: Sarah & James',
    user: 'Sarah Johnson',
    timestamp: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'assessment_completed',
    description: 'Communication assessment completed',
    user: 'Emily & Michael',
    timestamp: '5 minutes ago',
    status: 'success',
  },
  {
    id: 3,
    type: 'counselor_booked',
    description: 'Counseling session booked with Dr. Wilson',
    user: 'Lisa & David',
    timestamp: '12 minutes ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'payment',
    description: 'Payment processed: $150.00',
    user: 'Anna & Robert',
    timestamp: '15 minutes ago',
    status: 'success',
  },
  {
    id: 5,
    type: 'assessment_completed',
    description: 'Finances assessment - Low score flagged',
    user: 'Maria & John',
    timestamp: '23 minutes ago',
    status: 'warning',
  },
  {
    id: 6,
    type: 'blog_view',
    description: 'Blog post viewed: "5 Essential Conversations"',
    timestamp: '28 minutes ago',
    status: 'success',
  },
];

const systemHealth = [
  { metric: 'API Response Time', value: '127ms', status: 'healthy', color: 'green' },
  { metric: 'Database Performance', value: 'Optimal', status: 'healthy', color: 'green' },
  { metric: 'Payment Gateway', value: 'Active', status: 'healthy', color: 'green' },
  { metric: 'Email Delivery', value: '98.7%', status: 'healthy', color: 'green' },
];

export function PlatformMonitoring() {
  const [timeRange, setTimeRange] = useState('24h');
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  const [showSupportQueue, setShowSupportQueue] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'user_signup':
        return <Users className="w-4 h-4" />;
      case 'assessment_completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'counselor_booked':
        return <Clock className="w-4 h-4" />;
      case 'payment':
        return <CheckCircle className="w-4 h-4" />;
      case 'blog_view':
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-600';
      case 'warning':
        return 'bg-amber-50 text-amber-600';
      case 'error':
        return 'bg-red-50 text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Platform Monitoring</h1>
          <p className="text-gray-600">Real-time oversight of platform activity and health.</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users Now</p>
              <p className="text-3xl text-gray-900">247</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12 from 1h ago</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assessments Today</p>
              <p className="text-3xl text-gray-900">156</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+23% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sessions Booked</p>
              <p className="text-3xl text-gray-900">34</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+8 from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">System Health</p>
              <p className="text-3xl text-green-600">100%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">All systems operational</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Platform Activity (Last 24 Hours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="hour" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Active Users" />
            <Line type="monotone" dataKey="assessments" stroke="#8b5cf6" strokeWidth={2} name="Assessments" />
            <Line type="monotone" dataKey="bookings" stroke="#ec4899" strokeWidth={2} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">System Health</h3>
          </div>
          <div className="p-6 space-y-4">
            {systemHealth.map((item) => (
              <div key={item.metric} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-900">{item.metric}</span>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-500 mt-1">{activity.user}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
        <h3 className="text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 text-left"
            onClick={() => setShowErrorLogs(true)}
          >
            <p className="font-medium">View Error Logs</p>
            <p className="text-sm text-gray-500 mt-1">Check system errors and issues</p>
          </button>
          <button
            className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 text-left disabled:opacity-50"
            disabled={exportingReport}
            onClick={() => {
              setExportingReport(true);
              setTimeout(() => {
                console.log('Exporting activity report...');
                alert('Activity report downloaded successfully!');
                setExportingReport(false);
              }, 1500);
            }}
          >
            <p className="font-medium">{exportingReport ? 'Exporting...' : 'Export Activity Report'}</p>
            <p className="text-sm text-gray-500 mt-1">Download detailed activity logs</p>
          </button>
          <button
            className="px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 text-left"
            onClick={() => setShowSupportQueue(true)}
          >
            <p className="font-medium">User Support Queue</p>
            <p className="text-sm text-gray-500 mt-1">View pending support tickets</p>
          </button>
        </div>
      </div>

      {/* Error Logs Modal */}
      {showErrorLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-gray-900">System Error Logs</h3>
                <p className="text-gray-600 mt-1">Recent errors and warnings</p>
              </div>
              <button
                onClick={() => setShowErrorLogs(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: 1, level: 'Warning', message: 'Payment gateway response time exceeded 5s', time: '10 minutes ago', details: 'API latency detected' },
                { id: 2, level: 'Info', message: 'Database backup completed successfully', time: '2 hours ago', details: 'Backup size: 2.4GB' },
                { id: 3, level: 'Error', message: 'Email delivery failed for user@example.com', time: '3 hours ago', details: 'SMTP timeout' },
              ].map((log) => (
                <div key={log.id} className={`p-4 rounded-lg border ${
                  log.level === 'Error' ? 'bg-red-50 border-red-200' :
                  log.level === 'Warning' ? 'bg-amber-50 border-amber-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.level === 'Error' ? 'bg-red-100 text-red-700' :
                          log.level === 'Warning' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-gray-500">{log.time}</span>
                      </div>
                      <p className="text-gray-900 break-words">{log.message}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowErrorLogs(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Support Queue Modal */}
      {showSupportQueue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-gray-900">User Support Queue</h3>
                <p className="text-gray-600 mt-1">Pending support tickets</p>
              </div>
              <button
                onClick={() => setShowSupportQueue(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: 1, user: 'Sarah Johnson', email: 'sarah.j@email.com', subject: 'Cannot access assessment results', priority: 'High', time: '15 minutes ago' },
                { id: 2, user: 'Michael Brown', email: 'michael.b@email.com', subject: 'Payment issue with counselor booking', priority: 'High', time: '1 hour ago' },
                { id: 3, user: 'Lisa Anderson', email: 'lisa.a@email.com', subject: 'Question about resource recommendations', priority: 'Medium', time: '3 hours ago' },
              ].map((ticket) => (
                <div key={ticket.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className="text-xs text-gray-500">{ticket.time}</span>
                      </div>
                      <p className="text-gray-900 break-words">{ticket.subject}</p>
                      <p className="text-sm text-gray-600 mt-1">{ticket.user} • {ticket.email}</p>
                    </div>
                    <button className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors text-sm flex-shrink-0">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSupportQueue(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}