import { useState } from 'react';
import { Search, Filter, Mail, Users, CheckSquare, Square, Send } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  type: 'Couple' | 'Counselor';
  phone: string;
  joinedDate: string;
  status: 'Active' | 'Inactive';
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    type: 'Couple',
    phone: '+1 (555) 123-4567',
    joinedDate: '2024-12-08',
    status: 'Active',
  },
  {
    id: 2,
    name: 'James Miller',
    email: 'james.m@email.com',
    type: 'Couple',
    phone: '+1 (555) 123-4568',
    joinedDate: '2024-12-08',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Dr. Jennifer Wilson',
    email: 'j.wilson@email.com',
    type: 'Counselor',
    phone: '+1 (555) 987-6543',
    joinedDate: '2024-06-15',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    type: 'Couple',
    phone: '+1 (555) 234-5678',
    joinedDate: '2024-12-07',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    type: 'Couple',
    phone: '+1 (555) 234-5679',
    joinedDate: '2024-12-07',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Dr. Emily Roberts',
    email: 'e.roberts@email.com',
    type: 'Counselor',
    phone: '+1 (555) 876-5432',
    joinedDate: '2024-07-20',
    status: 'Active',
  },
];

export function UsersContacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesType = typeFilter === 'all' || user.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleSendEmail = () => {
    const recipients = mockUsers.filter((u) => selectedUsers.includes(u.id));
    console.log('Sending email to:', recipients);
    console.log('Subject:', emailData.subject);
    console.log('Message:', emailData.message);
    
    // Reset and close
    setEmailData({ subject: '', message: '' });
    setSelectedUsers([]);
    setShowEmailModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Users & Contacts</h1>
          <p className="text-gray-600">Manage all user contacts and send emails.</p>
        </div>
        {selectedUsers.length > 0 && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all"
          >
            <Mail className="w-5 h-5" />
            <span>Email Selected ({selectedUsers.length})</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl text-gray-900 mt-1">{mockUsers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Couples</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockUsers.filter((u) => u.type === 'Couple').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Counselors</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockUsers.filter((u) => u.type === 'Counselor').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl text-gray-900 mt-1">
            {mockUsers.filter((u) => u.status === 'Active').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="Couple">Couples Only</option>
                <option value="Counselor">Counselors Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-rose-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserSelection(user.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {selectedUsers.includes(user.id) ? (
                        <CheckSquare className="w-5 h-5 text-rose-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.type === 'Couple'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === 'Active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedUsers([user.id]);
                        setShowEmailModal(true);
                      }}
                      className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors text-sm flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl text-gray-900 mb-4">Send Email</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Recipients: {selectedUsers.length} users</p>
              <div className="flex flex-wrap gap-2">
                {mockUsers
                  .filter((u) => selectedUsers.includes(u.id))
                  .map((u) => (
                    <span
                      key={u.id}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {u.name}
                    </span>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Message</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-48"
                  placeholder="Type your message here..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSendEmail}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:from-pink-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Email
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailData({ subject: '', message: '' });
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
