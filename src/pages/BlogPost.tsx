import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Share2, Heart, BookmarkPlus } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = parseInt(id || '1');

const blogPostsData: { [key: number]: any } = {
  1: {
    id: 1,
    title: "10 Essential Questions Every Couple Should Discuss Before Marriage",
    excerpt: "Discover the crucial conversations that will set your marriage up for success, from finances to family planning.",
    category: "Communication",
    author: "Dr. Sarah Johnson",
    authorTitle: "PhD, LMFT",
    date: "December 5, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=600&fit=crop",
    content: `
      <p>Starting your journey toward marriage is exciting, but it's also one of the most important decisions you'll make in your life. Before you walk down the aisle, there are crucial conversations that can help ensure you're building your relationship on a solid foundation.</p>

      <p>These ten questions aren't meant to be deal-breakers, but rather conversation starters that can help you and your partner align on important aspects of your future together.</p>

      <h2>1. How Do We Handle Finances?</h2>
      <p>Money is one of the leading causes of stress in marriages. Discuss your spending habits, savings goals, debt, and how you plan to manage finances together. Will you combine accounts, keep them separate, or have a hybrid approach?</p>

      <h2>2. What Are Our Career Aspirations?</h2>
      <p>Understanding each other's professional goals is crucial. Will one partner's career take priority? Are you both open to relocating for job opportunities? How will you balance work and family life?</p>

      <h2>3. Do We Want Children?</h2>
      <p>This is perhaps one of the most important questions. If yes, when? How many? What are your views on parenting styles, education, and discipline?</p>

      <h2>4. How Will We Handle Conflict?</h2>
      <p>Every couple disagrees sometimes. What matters is how you resolve those disagreements. Discuss your conflict resolution styles and establish healthy communication patterns now.</p>

      <h2>5. What Role Will Extended Family Play?</h2>
      <p>Discuss your relationships with in-laws, how often you'll visit family, and how you'll handle family conflicts or interference in your marriage.</p>

      <h2>6. What Are Our Religious or Spiritual Beliefs?</h2>
      <p>Even if you're from the same faith background, discuss how you'll practice together. Will you attend religious services? How will you incorporate faith into your daily life and raise children?</p>

      <h2>7. How Do We Define Roles and Responsibilities?</h2>
      <p>Who does what around the house? How will you divide domestic duties? What are your expectations about traditional versus modern roles?</p>

      <h2>8. What Does Intimacy Mean to Us?</h2>
      <p>Discuss your expectations and desires regarding physical, emotional, and spiritual intimacy. Communication about intimacy is key to a fulfilling marriage.</p>

      <h2>9. How Will We Handle Life's Big Decisions?</h2>
      <p>Establish a framework for making major decisions together. Will all decisions be joint? Are there areas where one partner takes the lead?</p>

      <h2>10. What Are Our Individual and Shared Goals?</h2>
      <p>Discuss your dreams and aspirations. How can you support each other's individual growth while building a life together?</p>

      <h2>Moving Forward Together</h2>
      <p>These conversations might seem daunting, but they're essential for building a strong marriage. Remember, you don't need to agree on everything, but you do need to understand each other's perspectives and find ways to compromise and support one another.</p>

      <p>Take your time with these discussions. Revisit them as you grow together. And consider working with a pre-marital counselor who can help facilitate these important conversations and provide professional guidance as you prepare for your future together.</p>
    `
  },
  2: {
    id: 2,
    title: "How to Navigate Financial Discussions as a Couple",
    excerpt: "Money matters can make or break a relationship. Learn how to have productive conversations about finances without the stress.",
    category: "Financial Planning",
    author: "James Williams",
    authorTitle: "CFP, Marriage Counselor",
    date: "December 3, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1554224311-beee2f770c90?w=1200&h=600&fit=crop",
    content: `
      <p>Financial discussions can be one of the most challenging aspects of any relationship. However, with the right approach, these conversations can strengthen your partnership rather than strain it.</p>

      <h2>Create a Safe Space for Money Talk</h2>
      <p>Choose a calm, neutral time to discuss finances—not during an argument or when bills are due. Make it a regular practice, perhaps monthly, to review your finances together.</p>

      <h2>Be Transparent About Your Financial History</h2>
      <p>Share your complete financial picture, including debts, credit scores, and spending habits. Honesty is crucial for building trust.</p>

      <h2>Align on Shared Goals</h2>
      <p>What are you saving for? A house? Travel? Retirement? Having shared financial goals creates unity and purpose in your money management.</p>

      <h2>Respect Different Money Personalities</h2>
      <p>One partner might be a saver while the other is a spender. Understanding and respecting these differences, rather than trying to change each other, is key to financial harmony.</p>

      <h2>Create a Budget Together</h2>
      <p>Work as a team to create a budget that reflects both of your values and priorities. This collaborative approach ensures both partners feel heard and respected.</p>

      <h2>Plan for the Unexpected</h2>
      <p>Discuss how you'll handle financial emergencies and build an emergency fund together. Having a plan reduces stress when unexpected expenses arise.</p>
    `
  }
};

  const post = blogPostsData[postId] || blogPostsData[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Image */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/insights')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Articles</span>
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-full text-sm mb-4">
              <Tag className="w-4 h-4" />
              {post.category}
            </div>
            <h1 className="text-3xl lg:text-5xl text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span>{post.author}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Info */}
        <div className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-xl">
            {post.author.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="text-lg text-gray-900">{post.author}</p>
            <p className="text-gray-600">{post.authorTitle}</p>
          </div>
        </div>

        {/* Article Actions */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">Save</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BookmarkPlus className="w-5 h-5" />
            <span className="text-sm">Bookmark</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </button>
        </div>

        {/* Article Body */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-h2:mt-8 prose-h2:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm text-gray-600 mb-3">Related Topics:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {post.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Relationships
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Pre-marital Counseling
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Marriage Preparation
            </span>
          </div>
        </div>

        {/* Author CTA */}
        <div className="mt-12 p-8 bg-purple-50 rounded-2xl border border-purple-100">
          <h3 className="text-2xl text-gray-900 mb-2">Work with {post.author.split(' ')[0]}</h3>
          <p className="text-gray-700 mb-6">
            Interested in personalized guidance? {post.author} is available for counseling sessions through our platform.
          </p>
          <button
            onClick={() => navigate('/counselors')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Counselor Profile
          </button>
        </div>
      </article>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl text-white mb-4">
            Never Miss an Insight
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Subscribe to get expert relationship advice delivered to your inbox
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

      <Footer />
    </div>
  );
}
