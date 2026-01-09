import { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Star, X, Download, ExternalLink, Play } from 'lucide-react';

interface RecommendedMaterialsProps {
  onNavigateToMaterial: (materialId: number) => void;
  onNavigateBack: () => void;
  categoryFilter?: string;
}

const topicCategories = [
  'All Topics',
  'Communication and Conflict Resolution',
  'Finances and Money Management',
  'Children and Parenting Philosophy',
  'Intimacy and Affection',
  'Faith, Spirituality, and Core Values',
  'Family Dynamics and In-Laws',
  'Career and Life Goals',
  'Household Roles and Responsibilities',
  'Health and Well-being',
  'Social Life, Hobbies, and Personal Space'
];

const materialTypes = [
  'All Types',
  'Book',
  'Article',
  'Video',
  'Podcast',
  'Workbook',
  'Guide'
];

const allMaterials = [
  {
    id: 1,
    title: "The Seven Principles for Making Marriage Work",
    author: "John Gottman, Ph.D.",
    type: "Book",
    category: "Communication and Conflict Resolution",
    description: "Based on groundbreaking research, this book reveals the seven principles that guide couples on a path toward a harmonious and long-lasting relationship.",
    rating: 4.8,
    reviewCount: 3456,
    readTime: "6 hours",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    featured: true,
    price: "Free"
  },
  {
    id: 2,
    title: "Financial Planning for Couples: A Complete Guide",
    author: "Sarah Mitchell, CFP",
    type: "Guide",
    category: "Finances and Money Management",
    description: "A comprehensive guide to help couples navigate financial discussions, create budgets, and plan for their financial future together.",
    rating: 4.7,
    reviewCount: 892,
    readTime: "2 hours",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=600&fit=crop",
    featured: true,
    price: "Free"
  },
  {
    id: 3,
    title: "Conflict Resolution in Relationships",
    author: "Dr. Emily Rodriguez",
    type: "Video",
    category: "Communication and Conflict Resolution",
    description: "Learn effective techniques for resolving conflicts in a healthy way that strengthens your relationship rather than damaging it.",
    rating: 4.9,
    reviewCount: 1245,
    readTime: "45 min",
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=400&h=600&fit=crop",
    featured: true,
    price: "Free"
  },
  {
    id: 4,
    title: "Building Emotional Intimacy",
    author: "Dr. James Williams",
    type: "Workbook",
    category: "Intimacy and Affection",
    description: "Interactive exercises and reflections to help couples deepen their emotional connection and build lasting intimacy.",
    rating: 4.8,
    reviewCount: 567,
    readTime: "3 hours",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  },
  {
    id: 5,
    title: "Faith-Based Marriage Preparation",
    author: "Rev. Michael Chen",
    type: "Article",
    category: "Faith, Spirituality, and Core Values",
    description: "Explore how to integrate your shared faith values into your relationship foundation and future marriage.",
    rating: 5.0,
    reviewCount: 423,
    readTime: "20 min",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  },
  {
    id: 6,
    title: "Planning Your Family's Future Together",
    author: "Dr. Lisa Anderson",
    type: "Book",
    category: "Children and Parenting Philosophy",
    description: "A thoughtful guide to discussing family planning, parenting approaches, and creating a vision for your family's future.",
    rating: 4.7,
    reviewCount: 789,
    readTime: "4 hours",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  },
  {
    id: 7,
    title: "Aligning Life Goals as a Couple",
    author: "Marcus Thompson, PhD",
    type: "Podcast",
    category: "Career and Life Goals",
    description: "Listen to expert advice on how to identify, align, and achieve your individual and shared life goals as a couple.",
    rating: 4.6,
    reviewCount: 1123,
    readTime: "1 hour",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  },
  {
    id: 8,
    title: "Defining Roles and Responsibilities",
    author: "Dr. Aisha Patel",
    type: "Guide",
    category: "Household Roles and Responsibilities",
    description: "Navigate conversations about household responsibilities, career priorities, and creating a balanced partnership.",
    rating: 4.8,
    reviewCount: 945,
    readTime: "90 min",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    featured: true,
    price: "Free"
  },
  {
    id: 9,
    title: "10 Essential Questions Every Couple Should Discuss",
    author: "DuringCourtship Team",
    type: "Article",
    category: "Communication and Conflict Resolution",
    description: "Before you walk down the aisle, there are crucial conversations you need to have. This guide covers the most important topics.",
    rating: 4.9,
    reviewCount: 2134,
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=600&fit=crop",
    featured: true,
    price: "Free"
  },
  {
    id: 10,
    title: "Understanding Your Attachment Styles",
    author: "Dr. Sarah Johnson",
    type: "Video",
    category: "Intimacy and Affection",
    description: "Learn about attachment theory and how understanding your attachment style can improve your relationship dynamics.",
    rating: 4.8,
    reviewCount: 876,
    readTime: "55 min",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  },
  {
    id: 11,
    title: "Money Conversations Made Easy",
    author: "Financial Wellness Institute",
    type: "Workbook",
    category: "Finances and Money Management",
    description: "Step-by-step exercises to help you have productive conversations about money, debt, savings, and financial goals.",
    rating: 4.7,
    reviewCount: 654,
    readTime: "2 hours",
    image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  },
  {
    id: 12,
    title: "The Power of Forgiveness in Relationships",
    author: "Dr. Emily Rodriguez",
    type: "Article",
    category: "Communication and Conflict Resolution",
    description: "Discover how practicing forgiveness can transform your relationship and create a stronger emotional bond.",
    rating: 4.9,
    reviewCount: 1567,
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=600&fit=crop",
    featured: false,
    price: "Free"
  }
];

export function RecommendedMaterials({ onNavigateToMaterial, onNavigateBack, categoryFilter }: RecommendedMaterialsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All Topics');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredMaterials = allMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Topics' || material.category === selectedCategory;
    const matchesType = selectedType === 'All Types' || material.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Play className="w-4 h-4" />;
      case 'Book': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <button
              onClick={onNavigateBack}
              className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl text-gray-900">Recommended Materials</h1>
            <p className="text-gray-600 mt-1">
              Curated resources to strengthen your relationship foundation
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials..."
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

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {topicCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Additional Filters */}
            {showFilters && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Material Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {materialTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">View Mode</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                          viewMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMaterials.length} of {allMaterials.length} materials
          </div>
        </div>
      </div>

      {/* Materials Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No materials found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Topics');
                setSelectedType('All Types');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(material => (
              <div
                key={material.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigateToMaterial(material.id)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={material.image}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white rounded-full text-sm flex items-center gap-1">
                    {getTypeIcon(material.type)}
                    {material.type}
                  </div>
                  {material.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {material.category}
                    </span>
                  </div>

                  <h3 className="text-lg text-gray-900 mb-2 line-clamp-2">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">by {material.author}</p>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {material.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-gray-900">{material.rating}</span>
                      <span className="text-sm text-gray-500">({material.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {material.readTime}
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Material
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map(material => (
              <div
                key={material.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onNavigateToMaterial(material.id)}
              >
                <div className="flex gap-6">
                  <img
                    src={material.image}
                    alt={material.title}
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {material.category}
                          </span>
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                            {getTypeIcon(material.type)}
                            {material.type}
                          </span>
                          {material.featured && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl text-gray-900 mb-1">{material.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">by {material.author}</p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {material.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm text-gray-900">{material.rating}</span>
                          <span className="text-sm text-gray-500">({material.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {material.readTime}
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Material
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}