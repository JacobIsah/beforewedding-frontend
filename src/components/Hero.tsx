import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onOpenDemo: () => void;
}

export function Hero({ onOpenDemo }: HeroProps) {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Building Stronger Relationships</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl text-gray-900 leading-tight">
              Your Path to a Stronger Marriage
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              Navigate courtship with confidence. DuringCourtship provides structured guidance, 
              compatibility assessments, and expert support to help you build the best possible 
              foundation before you say "I do."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/counselors')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-purple-600 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Browse Counselors
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl text-gray-900">1,000+</div>
                <div className="text-sm text-gray-600">Couples Guided</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-2xl text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-2xl text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Expert Counselors</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1597241612345-a3964d7022ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBoYXBweSUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2NTE4NTc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy couple together"
                className="w-full h-auto"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}