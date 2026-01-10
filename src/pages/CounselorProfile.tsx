import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Award, MapPin, Calendar, CheckCircle, Clock, Video, MessageCircle, ArrowLeft, Heart } from 'lucide-react';

interface SessionFormat {
  type: string;
  label: string;
  available: boolean;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface Counselor {
  id: number;
  name: string;
  credentials: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  location: string;
  image: string;
  availability: string;
  bio: string;
  approach: string;
  education: string[];
  certifications: string[];
  sessionFormats: SessionFormat[];
  reviews: Review[];
}

const getSessionIcon = (type: string) => {
  const icons: { [key: string]: any } = {
    video: Video,
    in_person: MessageCircle,
    flexible: Clock,
    weekend: Clock,
    evening: Clock,
  };
  return icons[type] || Clock;
};

export function CounselorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!localStorage.getItem('access_token') || !!localStorage.getItem('counselor_access_token');

  useEffect(() => {
    const fetchCounselorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://beforewedding.duckdns.org/api/counselors/${id}/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch counselor data');
        }
        
        const data = await response.json();
        setCounselor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCounselorData();
    }
  }, [id]);

  const handleBookConsultation = () => {
    if (isAuthenticated) {
      navigate(`/booking/${id}`);
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading counselor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !counselor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Counselor not found'}</p>
          <button
            onClick={() => navigate('/counselors')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Counselors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/counselors')}
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Counselors</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl text-gray-900">DuringCourtship</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={counselor.image}
              alt={counselor.name}
              className="w-32 h-32 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl text-gray-900 mb-2">
                    {counselor.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">{counselor.credentials}</p>
                  <p className="text-gray-700 mb-3">{counselor.title}</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg text-gray-900">{counselor.rating}</span>
                  <span className="text-gray-600">({counselor.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>{counselor.yearsExperience} years of experience</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span>{counselor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>{counselor.availability}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {counselor.specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Book Consultation CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl mb-2">Ready to Start Your Journey?</h2>
              <p className="text-purple-100">
                Book a consultation with {counselor.name.split(' ')[1]} and take the first step toward a stronger relationship
              </p>
            </div>
            <button
              onClick={handleBookConsultation}
              className="px-8 py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              {isAuthenticated ? 'Book Consultation' : 'Sign In to Book'}
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{counselor.bio}</p>
        </div>

        {/* Approach */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl text-gray-900 mb-4">My Approach</h2>
          <p className="text-gray-700 leading-relaxed">{counselor.approach}</p>
        </div>

        {/* Session Formats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl text-gray-900 mb-6">Session Formats</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {counselor.sessionFormats.map((format, idx) => {
              const Icon = getSessionIcon(format.type);
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{format.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education & Credentials */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Education</h2>
            <div className="space-y-3">
              {counselor.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{edu}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Certifications</h2>
            <div className="space-y-3">
              {counselor.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl text-gray-900 mb-6">Client Reviews</h2>
          <div className="space-y-6">
            {counselor.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-gray-900">{review.author}</span>
                  <span className="text-gray-500 text-sm">• {review.date}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Take the first step toward building a stronger foundation for your relationship. Book a consultation today.
          </p>
          <button
            onClick={handleBookConsultation}
            className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isAuthenticated ? 'Book Consultation Now' : 'Sign In to Book Consultation'}
          </button>
        </div>
      </div>
    </div>
  );
}
