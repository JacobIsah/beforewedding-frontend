import { useState } from 'react';
import { Star, Clock, BookOpen, Download, Share2, Heart, Play, CheckCircle, User } from 'lucide-react';

interface MaterialViewProps {
  materialId: number;
  onNavigateBack: () => void;
}

// Mock data - in real app this would come from a database
const getMaterialById = (id: number) => {
  const materials: { [key: number]: any } = {
    1: {
      id: 1,
      title: "The Seven Principles for Making Marriage Work",
      author: "John Gottman, Ph.D.",
      type: "Book",
      category: "Communication",
      description: "Based on groundbreaking research, this book reveals the seven principles that guide couples on a path toward a harmonious and long-lasting relationship.",
      fullDescription: `Dr. John Gottman's breakthrough research on marriage has revolutionized the way we understand relationships. Through extensive studies of thousands of couples, he's identified seven key principles that can help any couple build a lasting, loving relationship.

This groundbreaking book offers practical advice and exercises based on decades of research. You'll learn how to enhance your love maps, nurture fondness and admiration, turn toward each other instead of away, let your partner influence you, solve solvable problems, overcome gridlock, and create shared meaning.

The principles outlined in this book are research-backed and have been proven to work for couples at any stage of their relationship. Whether you're dating, engaged, or have been married for years, these insights will help you build a stronger foundation.`,
      rating: 4.8,
      reviewCount: 3456,
      readTime: "6 hours",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop",
      featured: true,
      price: "Free",
      keyTakeaways: [
        "Build and maintain detailed love maps of your partner's world",
        "Nurture fondness and admiration to strengthen your friendship",
        "Turn toward each other in everyday moments",
        "Accept your partner's influence and work as a team",
        "Solve solvable problems with effective communication",
        "Learn to overcome relationship gridlock",
        "Create shared meaning and purpose in your relationship"
      ],
      chapters: [
        { number: 1, title: "The Seven Principles - An Overview", duration: "45 min" },
        { number: 2, title: "Enhance Your Love Maps", duration: "1 hour" },
        { number: 3, title: "Nurture Fondness and Admiration", duration: "50 min" },
        { number: 4, title: "Turn Toward Each Other", duration: "40 min" },
        { number: 5, title: "Let Your Partner Influence You", duration: "55 min" },
        { number: 6, title: "Solve Your Solvable Problems", duration: "1 hour 15 min" },
        { number: 7, title: "Overcome Gridlock", duration: "1 hour" },
        { number: 8, title: "Create Shared Meaning", duration: "45 min" }
      ]
    },
    // Add more materials as needed
  };

  return materials[id] || materials[1]; // Fallback to first material
};

const reviews = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    comment: "This book transformed our relationship! The exercises are practical and the research-backed approach made it easy for both of us to engage with the material.",
    helpful: 234
  },
  {
    id: 2,
    author: "Michael T.",
    rating: 5,
    date: "1 month ago",
    comment: "As someone who was skeptical about relationship books, I was pleasantly surprised. The seven principles are clear, actionable, and backed by real science.",
    helpful: 189
  },
  {
    id: 3,
    author: "Jennifer L.",
    rating: 4,
    date: "1 month ago",
    comment: "Great content overall. Some sections felt a bit repetitive, but the core principles are invaluable for any couple.",
    helpful: 156
  }
];

export function MaterialView({ materialId, onNavigateBack }: MaterialViewProps) {
  const [isSaved, setIsSaved] = useState(false);
  const material = getMaterialById(materialId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
        <img
          src={material.image}
          alt={material.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <button
              onClick={onNavigateBack}
              className="text-white hover:text-gray-200 mb-4 flex items-center gap-2"
            >
              ← Back to Materials
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                {material.type}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                {material.category}
              </span>
              {material.featured && (
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl text-white mb-3">
              {material.title}
            </h1>
            <p className="text-xl text-white/90">by {material.author}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-xl">{material.rating}</span>
                    <span className="text-gray-600">({material.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    {material.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2 rounded-lg transition-colors ${
                      isSaved ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl text-gray-900 mb-4">About This {material.type}</h2>
                <p className="text-gray-600 mb-4">{material.description}</p>
                {material.fullDescription.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl text-gray-900 mb-4">Key Takeaways</h2>
              <div className="space-y-3">
                {material.keyTakeaways.map((takeaway: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{takeaway}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters/Contents */}
            {material.chapters && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl text-gray-900 mb-4">Chapters</h2>
                <div className="space-y-3">
                  {material.chapters.map((chapter: any) => (
                    <div
                      key={chapter.number}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          {chapter.number}
                        </div>
                        <div>
                          <h3 className="text-gray-900">{chapter.title}</h3>
                          <p className="text-sm text-gray-600">{chapter.duration}</p>
                        </div>
                      </div>
                      {material.type === 'Video' && (
                        <Play className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Reviews</h2>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Write a Review
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">{review.author}</p>
                          <p className="text-sm text-gray-600">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <div className="mb-6">
                <div className="text-3xl text-gray-900 mb-2">{material.price}</div>
                <p className="text-sm text-gray-600">Access to all content</p>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  {material.type === 'Video' ? (
                    <>
                      <Play className="w-5 h-5" />
                      Start Watching
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5" />
                      Start Reading
                    </>
                  )}
                </button>
                <button className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="text-gray-900">{material.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="text-gray-900">{material.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900">{material.readTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <span className="text-gray-900">{material.rating}/5.0</span>
                </div>
              </div>
            </div>

            {/* Related Materials */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg text-gray-900 mb-4">Related Materials</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img
                      src={`https://images.unsplash.com/photo-${1544947950 + i}000-fa07a98d237f?w=100&h=100&fit=crop`}
                      alt="Related material"
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-sm text-gray-900 mb-1 line-clamp-2">
                        Related Material Title {i}
                      </h4>
                      <p className="text-xs text-gray-600">Author Name</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
