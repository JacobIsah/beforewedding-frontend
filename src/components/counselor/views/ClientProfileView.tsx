import { useState } from "react";
import { ArrowLeft, Calendar, Clock, FileText, Plus, Edit2, Save, Trash2, Mail, Phone, Heart, CheckCircle, AlertCircle } from "lucide-react";

interface Session {
  id: string;
  date: string;
  time: string;
  type: string;
  status: "completed" | "scheduled" | "cancelled";
  notes?: string;
}

interface ClientProfileViewProps {
  clientId: string;
  onBack: () => void;
}

export function ClientProfileView({ clientId, onBack }: ClientProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "notes">("overview");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Mock client data
  const client = {
    id: clientId,
    coupleName: "Sarah & James Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "+1 (555) 234-5678",
    weddingDate: "June 15, 2026",
    startDate: "Sep 1, 2025",
    status: "active",
    packageType: "Complete Pre-Marriage Package (6 sessions)",
    sessionsCompleted: 3,
    totalSessions: 6,
    nextSession: "Dec 12, 2025 at 2:00 PM",
  };

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      date: "Sep 15, 2025",
      time: "2:00 PM - 3:00 PM",
      type: "Initial Consultation",
      status: "completed",
      notes: "Great first session. Couple shows strong communication foundation. Primary focus areas: financial planning and conflict resolution strategies.",
    },
    {
      id: "2",
      date: "Oct 5, 2025",
      time: "2:00 PM - 3:00 PM",
      type: "Communication Workshop",
      status: "completed",
      notes: "Worked on active listening exercises. Both partners engaged well. Homework assigned: practice 'I feel' statements.",
    },
    {
      id: "3",
      date: "Nov 12, 2025",
      time: "2:00 PM - 3:00 PM",
      type: "Financial Planning Session",
      status: "completed",
      notes: "Discussed budget creation and financial goals. Created joint spending plan. Need to follow up on debt management strategies.",
    },
    {
      id: "4",
      date: "Dec 12, 2025",
      time: "2:00 PM - 3:00 PM",
      type: "Conflict Resolution",
      status: "scheduled",
    },
    {
      id: "5",
      date: "Jan 10, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Family Dynamics",
      status: "scheduled",
    },
    {
      id: "6",
      date: "Feb 7, 2026",
      time: "2:00 PM - 3:00 PM",
      type: "Final Review & Assessment",
      status: "scheduled",
    },
  ]);

  const [counselorNotes, setCounselorNotes] = useState([
    {
      id: "1",
      date: "Nov 15, 2025",
      title: "Progress Assessment",
      content: "Couple is making excellent progress. Communication has improved significantly. Both partners are completing homework assignments.",
      important: true,
    },
    {
      id: "2",
      date: "Oct 20, 2025",
      title: "Follow-up needed",
      content: "Schedule additional session to discuss in-law boundaries if needed.",
      important: false,
    },
  ]);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        title: "Session Note",
        content: newNote,
        important: false,
      };
      setCounselorNotes([note, ...counselorNotes]);
      setNewNote("");
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setCounselorNotes(counselorNotes.filter((note) => note.id !== noteId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-teal-100 text-teal-700";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900">{client.coupleName}</h2>
          <p className="text-gray-500 mt-1">
            Client Profile & Session Management
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Schedule Session</span>
        </button>
      </div>

      {/* Client Overview Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Mail className="w-4 h-4" />
              <span>{client.email}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Phone className="w-4 h-4" />
              <span>{client.phone}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Wedding Date</p>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Heart className="w-4 h-4 text-teal-600" />
              <span>{client.weddingDate}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Client Since</p>
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <Calendar className="w-4 h-4" />
              <span>{client.startDate}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{client.packageType}</p>
              <p className="text-xs text-gray-500">Next: {client.nextSession}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-900">
                  {client.sessionsCompleted} of {client.totalSessions} completed
                </p>
                <div className="w-32 h-2 bg-gray-100 rounded-full mt-2">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${(client.sessionsCompleted / client.totalSessions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === "overview"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === "sessions"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Session History
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === "notes"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Counselor Notes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Progress Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-900">Completed Sessions</span>
                </div>
                <span className="text-xl text-gray-900">{client.sessionsCompleted}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-900">Upcoming Sessions</span>
                </div>
                <span className="text-xl text-gray-900">
                  {client.totalSessions - client.sessionsCompleted}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-900">Counselor Notes</span>
                </div>
                <span className="text-xl text-gray-900">{counselorNotes.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Recent Notes</h3>
            <div className="space-y-3">
              {counselorNotes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border ${
                    note.important
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-gray-900">{note.title}</p>
                    {note.important && <AlertCircle className="w-4 h-4 text-amber-600" />}
                  </div>
                  <p className="text-xs text-gray-500">{note.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="text-[var(--color-text-dark)] mb-6">Session History</h3>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary-teal)] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-[var(--color-text-dark)]">{session.type}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-gray)]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                  {session.status === "completed" && (
                    <button className="p-2 hover:bg-[var(--color-bg-light)] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-[var(--color-text-gray)]" />
                    </button>
                  )}
                </div>
                {session.notes && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-gray)] mb-1">Session Notes:</p>
                    <p className="text-sm text-[var(--color-text-dark)]">{session.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="space-y-4">
          {/* Add Note Button */}
          {!isAddingNote ? (
            <button
              onClick={() => setIsAddingNote(true)}
              className="w-full p-4 border-2 border-dashed border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary-teal)] hover:bg-[var(--color-bg-light)] transition-all flex items-center justify-center gap-2 text-[var(--color-text-gray)] hover:text-[var(--color-primary-teal)]"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Note</span>
            </button>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <h3 className="text-[var(--color-text-dark)] mb-4">New Note</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
                className="w-full h-32 px-4 py-3 border border-[var(--color-border)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-teal)] focus:border-transparent"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-[var(--color-primary-teal)] hover:bg-[var(--color-accent-teal)] text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm">Save Note</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNote("");
                  }}
                  className="px-4 py-2 bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] text-[var(--color-text-dark)] rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-4">
            {counselorNotes.map((note) => (
              <div
                key={note.id}
                className={`bg-white rounded-xl border p-6 ${
                  note.important
                    ? "border-[var(--color-warning)] bg-[var(--color-warning)] bg-opacity-5"
                    : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[var(--color-text-dark)]">{note.title}</h4>
                      {note.important && (
                        <span className="text-xs px-2 py-1 bg-[var(--color-warning)] bg-opacity-20 text-[var(--color-warning)] rounded">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-gray)] mb-3">{note.date}</p>
                    <p className="text-sm text-[var(--color-text-dark)]">{note.content}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-[var(--color-bg-light)] rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-[var(--color-text-gray)]" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
