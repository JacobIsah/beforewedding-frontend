import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Calendar, Award, DollarSign, X, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

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
  price: number;
  image: string;
  availability: string;
  verified: boolean;
}

// Fallback data for offline/error scenarios
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
    price: 150,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    availability: "Available this week",
    verified: true
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
    price: 120,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    availability: "Available next week",
    verified: true
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
    price: 180,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    availability: "Available this week",
    verified: true
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
    price: 200,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    availability: "Available this week",
    verified: true
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
    price: 160,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    availability: "Available next week",
    verified: true
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
    price: 130,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    availability: "Available this week",
    verified: true
  },
  {
    id: 7,
    name: "Dr. Lisa Anderson",
    credentials: "PsyD, LMFT",
    specializations: ["Pre-marital Counseling", "Intimacy", "Communication"],
    rating: 4.8,
    reviewCount: 145,
    yearsExperience: 11,
    location: "Boston, MA",
    price: 170,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    availability: "Available this week",
    verified: true
  },
  {
    id: 8,
    name: "Dr. Marcus Thompson",
    credentials: "PhD, LPC",
    specializations: ["Financial Planning", "Life Goals", "Career Transitions"],
    rating: 4.9,
    reviewCount: 176,
    yearsExperience: 16,
    location: "Miami, FL",
    price: 165,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    availability: "Available next week",
    verified: true
  }
];

export function CounselorsMarketplace() {
  const navigate = useNavigate();
  const [allCounselors, setAllCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

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
      price: parseFloat(apiCounselor.hourly_rate || '150'),
      image: apiCounselor.profile_picture || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      availability: apiCounselor.availability_status || 'Contact for availability',
      verified: apiCounselor.verification_status === 'verified',
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
        setAllCounselors(transformedCounselors);
        setError(null);
      } catch (err) {
        console.error('Error fetching counselors:', err);
        setError(err instanceof Error ? err.message : 'Failed to load counselors');
        // Use fallback data on error
        setAllCounselors(fallbackCounselors);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const specializations = [
    'All Specializations',
    'Pre-marital Counseling',
    'Communication',
    'Conflict Resolution',
    'Financial Planning',
    'Faith-Based Counseling',
    'Intimacy Building',
    'Cultural Integration'
  ];

  const filteredCounselors = allCounselors.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         counselor.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                  counselor.specializations.some(s => s === selectedSpecialization);
    
    const matchesPrice = priceRange === 'all' ||
                        (priceRange === 'under150' && counselor.price < 150) ||
                        (priceRange === '150-200' && counselor.price >= 150 && counselor.price <= 200) ||
                        (priceRange === 'over200' && counselor.price > 200);
    
    const matchesRating = ratingFilter === 'all' ||
                         (ratingFilter === '4.5+' && counselor.rating >= 4.5) ||
                         (ratingFilter === '4.8+' && counselor.rating >= 4.8);

    return matchesSearch && matchesSpecialization && matchesPrice && matchesRating;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading counselors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl text-gray-900">Counselor Marketplace</h1>
              <p className="text-gray-600 mt-1">
                Browse and connect with verified marriage counselors
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl text-gray-900">{filteredCounselors.length}</div>
              <div className="text-sm text-gray-600">Verified Counselors</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or specialization..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="under150">Under $150</option>
                    <option value="150-200">$150 - $200</option>
                    <option value="over200">Over $200</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.8+">4.8+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Specialization</label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Specializations</option>
                    {specializations.slice(1).map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counselors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCounselors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No counselors found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialization('all');
                setPriceRange('all');
                setRatingFilter('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounselors.map(counselor => (
              <div
                key={counselor.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/counselor/${counselor.id}`)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={counselor.image}
                    alt={counselor.name}
                    className="w-full h-full object-cover"
                  />
                  {counselor.verified && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-white rounded-full text-sm">
                    ${counselor.price}/session
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg text-gray-900">{counselor.name}</h3>
                      <p className="text-sm text-gray-600">{counselor.credentials}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-gray-900">{counselor.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({counselor.reviewCount} reviews)</span>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {counselor.specializations.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {counselor.specializations.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{counselor.specializations.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {counselor.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      {counselor.yearsExperience} years experience
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Calendar className="w-4 h-4" />
                      {counselor.availability}
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
