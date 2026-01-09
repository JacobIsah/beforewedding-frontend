import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Send, CheckCircle, BookOpen, MessageSquare, Phone, Mail, Loader2, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'support@duringcourtship.com';
const API_BASE_URL = 'http://3.107.197.17';

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const faqs = [
  {
    question: 'How do I invite my partner?',
    answer: 'Go to your dashboard and click on "Invite Partner". Enter their email address and they will receive an invitation link to join and connect with you.'
  },
  {
    question: 'What happens if my partner hasn\'t completed an assessment?',
    answer: 'The compatibility score for that topic will show as "Pending" until both partners complete the assessment. You can still view recommended materials and take other assessments while waiting.'
  },
  {
    question: 'How are compatibility scores calculated?',
    answer: 'Compatibility scores are based on how aligned your answers are with your partner\'s responses. Our AI analyzes your answers and provides personalized insights and recommendations.'
  },
  {
    question: 'Can I retake an assessment?',
    answer: 'Yes! You can retake any assessment at any time. Your most recent scores will be used for your compatibility calculations.'
  },
  {
    question: 'How do I book a counseling session?',
    answer: 'Navigate to the Counselors marketplace from your dashboard. Browse available counselors, view their profiles, and click "Book Session" to schedule an appointment.'
  },
  {
    question: 'Are the recommended materials free?',
    answer: 'Yes, all recommended materials curated by DuringCourtship are free to access. We believe every couple deserves access to quality relationship resources.'
  }
];

export function Help() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data: UserData = await response.json();
        setUserData(data);
        setFormData(prev => ({
          ...prev,
          name: `${data.first_name} ${data.last_name}`.trim(),
          email: data.email,
        }));
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please log in to submit a help request.');
        return;
      }

      const response = await fetch('http://3.107.197.17/api/support/contact/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.detail || 'Failed to send message. Please try again.');
        return;
      }

      // Success - show confirmation
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(prev => ({
          ...prev,
          subject: '',
          message: ''
        }));
      }, 3000);
    } catch (error) {
      console.error('Help form submission error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 text-lg mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-100 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl mb-2">Help & Support</h1>
          <p className="text-blue-100">
            Find answers to common questions or reach out to our support team
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Contact Cards */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get help from our support team via the contact form
              </p>
              <a 
                href="#contact-form"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Send a message →
              </a>
            </div>

            {/* Email Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                Prefer email? Reach us directly at
              </p>
              <a 
                href={`mailto:${ADMIN_EMAIL}`}
                className="text-sm text-blue-600 hover:text-blue-700 break-all"
              >
                {ADMIN_EMAIL}
              </a>
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Documentation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse our comprehensive guides and tutorials
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View docs →
              </button>
            </div>
          </div>

          {/* Middle & Right Columns - FAQs & Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl text-gray-900">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details 
                    key={index}
                    className="group border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center justify-between">
                      <span className="text-gray-900">{faq.question}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div id="contact-form" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-6">
                Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you soon.
              </p>

              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    We&apos;ve received your message and will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Admin Email (Read-only) */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Send To (Support Team)</label>
                    <input
                      type="email"
                      value={ADMIN_EMAIL}
                      readOnly
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      All messages are sent to our support team
                    </p>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a topic...</option>
                      <option value="technical">Technical Support</option>
                      <option value="account">Account & Billing</option>
                      <option value="assessment">Assessment Questions</option>
                      <option value="counselor">Counselor Services</option>
                      <option value="partner">Partner Connection Issues</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Describe your issue or question in detail..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-gray-600">
                      We typically respond within 24 hours
                    </p>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
