import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, Calendar, Award, ArrowRight, ChevronLeft, ChevronRight, CheckCircle, Users, BookOpen, Shield, Loader2, AlertCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://3.107.197.17/api';

// API Response Types
interface ApiCounselor {
  id: number;
  professional_name: string;
  credentials?: string;
  specializations: string[];
  rating?: number;
  total_reviews?: number;
  years_of_experience: number;
  location?: string;
  profile_picture?: string;
  availability_status?: string;
  hourly_rate?: string;
  biography?: string;
  verification_status?: string;
}

interface Counselor {
  id: number;
  name: string;
  credentials: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  location: string;
  image: string;
  availability: string;
  hourlyRate?: string;
}

// Fallback data
const fallbackCounselors: Counselor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    credentials: "PhD, LMFT",
    specializations: ["Pre-marital Counseling", "Communication", "Conflict Resolution"],
    rating: 4.9,
    reviewCount: 127,
    yearsExperience: 12,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    availability: "Available this week"
  },
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    credentials: "PhD, LMFT",
    specializations: ["Pre-marital Counseling", "Communication", "Conflict Resolution"],
    rating: 4.9,
    reviewCount: 127,
    yearsExperience: 12,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    availability: "Available this week"
  },
  {
    id: 2,
    name: "Rev. Michael Chen",
    credentials: "MDiv, LPC",
    specializations: ["Faith-Based Counseling", "Values Alignment", "Spiritual Growth"],
    rating: 5.0,
    reviewCount: 94,
    yearsExperience: 15,
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    availability: "Available next week"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    credentials: "PsyD, LCSW",
    specializations: ["Financial Planning", "Family Dynamics", "Cultural Integration"],
    rating: 4.8,
    reviewCount: 156,
    yearsExperience: 10,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    availability: "Available this week"
  },
  {
    id: 4,
    name: "Dr. James Williams",
    credentials: "PhD, LMHC",
    specializations: ["Intimacy Building", "Emotional Intelligence", "Attachment Theory"],
    rating: 4.9,
    reviewCount: 203,
    yearsExperience: 18,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    availability: "Available this week"
  },
  {
    id: 5,
    name: "Dr. Aisha Patel",
    credentials: "PhD, LMFT",
    specializations: ["Cross-Cultural Relationships", "Communication", "Life Transitions"],
    rating: 5.0,
    reviewCount: 88,
    yearsExperience: 8,
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    availability: "Available next week"
  },
  {
    id: 6,
    name: "Robert Taylor",
    credentials: "MA, LPC",
    specializations: ["Conflict Resolution", "Trust Building", "Relationship Repair"],
    rating: 4.7,
    reviewCount: 112,
    yearsExperience: 14,
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    availability: "Available this week"
  }
];

const benefits = [
  {
    icon: Shield,
    title: "Verified & Vetted",
    description: "All counselors undergo thorough background checks and credential verification"
  },
  {
    icon: Award,
    title: "Licensed Professionals",
    description: "Only certified marriage and family therapists with proven track records"
  },
  {
    icon: Users,
    title: "Specialized Expertise",
    description: "Counselors trained specifically in pre-marital and courtship guidance"
  },
  {
    icon: BookOpen,
    title: "Ongoing Support",
    description: "Access to resources, workshops, and continuous guidance throughout your journey"
  }
];

export function Counselors() {
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const counselorsPerSlide = 3;
  const totalSlides = Math.ceil(counselors.length / counselorsPerSlide);

  // Transform API data to UI format
  const transformCounselor = (apiCounselor: ApiCounselor): Counselor => {
    return {
      id: apiCounselor.id,
      name: apiCounselor.professional_name,
      credentials: apiCounselor.credentials || 'Licensed Counselor',
      specializations: apiCounselor.specializations || [],
      rating: apiCounselor.rating || 4.5,
      reviewCount: apiCounselor.total_reviews || 0,
      yearsExperience: apiCounselor.years_of_experience || 0,
      location: apiCounselor.location || 'Remote',
      image: apiCounselor.profile_picture || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      availability: apiCounselor.availability_status || 'Contact for availability',
      hourlyRate: apiCounselor.hourly_rate,
    };
  };

  // Fetch counselors from API
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/counselors/`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch counselors');
        }

        const data = await response.json();
        const transformedCounselors = data.map(transformCounselor);
        setCounselors(transformedCounselors);
        setError(null);
      } catch (err) {
        console.error('Error fetching counselors:', err);
        setError(err instanceof Error ? err.message : 'Failed to load counselors');
        // Use fallback data on error
        setCounselors(fallbackCounselors);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleCounselors = counselors.slice(
    currentSlide * counselorsPerSlide,
    (currentSlide + 1) * counselorsPerSlide
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading counselors...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Unable to load counselors from server. Showing sample data.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">
              Connect With Expert Marriage Counselors
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Our vetted network of licensed professionals is here to guide you and your partner toward a strong, lasting foundation. Get personalized support tailored to your unique relationship journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-center"
              >
                Find Your Counselor
              </button>
              <button 
                onClick={() => navigate('/counselor-application')}
                className="px-8 py-4 bg-purple-700 text-white border-2 border-white rounded-lg hover:bg-purple-600 transition-colors text-center"
              >
                Apply as a Counselor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Counselors Carousel */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              Featured Counselors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet some of our top-rated professionals who specialize in helping couples build strong foundations
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCounselors.map((counselor) => (
                <div 
                  key={counselor.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={counselor.image}
                        alt={counselor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-900 mb-1">
                          {counselor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{counselor.credentials}</p>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-gray-900">{counselor.rating}</span>
                          <span className="text-sm text-gray-500">({counselor.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>{counselor.yearsExperience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>{counselor.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{counselor.availability}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {counselor.specializations.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/counselor/${counselor.id}`)}
                        className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate('/signup')}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Our Counselors */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect you with the best marriage counselors who are committed to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started with professional counseling is simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                1
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and complete your relationship assessment to help us understand your needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                2
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Get Matched</h3>
              <p className="text-gray-600">
                Browse our vetted counselors and find the perfect match for your relationship goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                3
              </div>
              <h3 className="text-xl text-gray-900 mb-2">Start Your Journey</h3>
              <p className="text-gray-600">
                Book sessions and begin building a stronger foundation for your future together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Professional Counselors Choose Our Platform */}
      <div className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">
              Why Professional Counselors Choose Our Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a community of dedicated professionals helping couples build lasting foundations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Qualified Client Leads</h3>
              <p className="text-gray-600">
                Connect with serious couples who have already completed compatibility assessments and are committed to pre-marital counseling
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Set your own availability and session formats. Offer video, in-person, or hybrid sessions that work with your practice
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Professional Support</h3>
              <p className="text-gray-600">
                Access to resources, peer support network, and ongoing training to enhance your practice and serve clients better
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Enhanced Credibility</h3>
              <p className="text-gray-600">
                Verified profile with credentials displayed, client reviews, and platform endorsement that builds trust with potential clients
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Assessment Integration</h3>
              <p className="text-gray-600">
                Access to client assessment results before first session, enabling more targeted and effective counseling from day one
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg text-gray-900 mb-2">Streamlined Practice</h3>
              <p className="text-gray-600">
                Simplified booking, scheduling, and client management tools that let you focus on what matters most - helping couples
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={() => navigate('/counselor-application')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
            >
              Apply to Join Our Network
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Join 500+ professional counselors making a difference in couples&apos; lives
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA for Couples */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-white mb-4">
            Ready to Strengthen Your Relationship?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Connect with a professional counselor today and start building the foundation for a lifetime of love
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}