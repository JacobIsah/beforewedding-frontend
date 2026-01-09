import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CTAProps {
  onOpenDemo: () => void;
}

export function CTA({ onOpenDemo }: CTAProps) {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl text-white mb-6">
          Ready to Build Your Strongest Foundation?
        </h2>
        
        <p className="text-lg lg:text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
          Join couples who are taking intentional steps toward lasting, 
          fulfilling marriages.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/signup')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenDemo}
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Try Demo
          </button>
        </div>
      </div>
    </section>
  );
}