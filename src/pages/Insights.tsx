import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Clock, ArrowRight, Tag } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function Insights() {
  const navigate = useNavigate();

const categories = [
  "All",
  "Communication",
  "Financial Planning",
  "Conflict Resolution",
  "Intimacy",
  "Faith & Values",
  "Wedding Planning"
];

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Questions Every Couple Should Discuss Before Marriage",
    excerpt: "Discover the crucial conversations that will set your marriage up for success, from finances to family planning.",
    category: "Communication",
    author: "Dr. Sarah Johnson",
    date: "December 5, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=500&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "How to Navigate Financial Discussions as a Couple",
    excerpt: "Money matters can make or break a relationship. Learn how to have productive conversations about finances without the stress.",
    category: "Financial Planning",
    author: "James Williams",
    date: "December 3, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224311-beee2f770c90?w=800&h=500&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "The Five Love Languages: Understanding Your Partner's Needs",
    excerpt: "Explore how different expressions of love can strengthen your relationship and prevent misunderstandings.",
    category: "Intimacy",
    author: "Dr. Emily Rodriguez",
    date: "November 28, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=500&fit=crop",
    featured: false
  },
  {
    id: 4,
    title: "Conflict Resolution Strategies That Actually Work",
    excerpt: "Transform disagreements into opportunities for growth with these proven techniques for healthy conflict resolution.",
    category: "Conflict Resolution",
    author: "Dr. Sarah Johnson",
    date: "November 25, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
    featured: true
  },
  {
    id: 5,
    title: "Blending Faith and Relationship: A Guide for Couples",
    excerpt: "How to integrate your spiritual values into your relationship foundation and build a faith-centered partnership.",
    category: "Faith & Values",
    author: "Rev. Michael Chen",
    date: "November 20, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1528998393495-a5e6d9f6b185?w=800&h=500&fit=crop",
    featured: false
  },
  {
    id: 6,
    title: "Wedding Planning Without the Stress: A Couple's Guide",
    excerpt: "Plan your dream wedding while maintaining your sanity and relationship harmony with these practical tips.",
    category: "Wedding Planning",
    author: "Dr. Aisha Patel",
    date: "November 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop",
    featured: false
  },
  {
    id: 7,
    title: "Building Emotional Intimacy: Beyond Physical Connection",
    excerpt: "Learn how to deepen your emotional bond and create lasting intimacy that goes beyond the surface level.",
    category: "Intimacy",
    author: "Dr. Emily Rodriguez",
    date: "November 10, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
    featured: false
  },
  {
    id: 8,
    title: "The Power of Active Listening in Relationships",
    excerpt: "Master the art of truly hearing your partner and watch your communication transform dramatically.",
    category: "Communication",
    author: "Robert Taylor",
    date: "November 5, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800&h=500&fit=crop",
    featured: false
  },
  {
    id: 9,
    title: "Managing In-Law Relationships: Setting Healthy Boundaries",
    excerpt: "Navigate family dynamics with grace while maintaining your couple's independence and unity.",
    category: "Conflict Resolution",
    author: "Dr. Aisha Patel",
    date: "October 30, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop",
    featured: false
  }
];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-4">
              Insights for Stronger Relationships
            </h1>
            <p className="text-xl text-purple-100">
              Expert advice, practical tips, and research-backed guidance to help you build a lasting, fulfilling partnership
            </p>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {selectedCategory === 'All' && searchTerm === '' && featuredPost && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white rounded-full text-sm">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {featuredPost.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-900">{featuredPost.author}</p>
                      <p className="text-sm text-gray-500">{featuredPost.date}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-900">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/blog/${post.id}`)}
                    className="inline-flex items-center gap-1 text-purple-600 hover:gap-2 transition-all"
                  >
                    <span className="text-sm">Read</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-white mb-4">
            Get Relationship Insights Delivered
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Subscribe to our newsletter for expert tips, research updates, and exclusive content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button className="px-8 py-3 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}