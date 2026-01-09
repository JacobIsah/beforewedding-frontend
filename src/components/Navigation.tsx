import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl text-gray-900">DuringCourtship</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm xl:text-base text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm xl:text-base text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavClick('/counselors')}
              className="text-sm xl:text-base text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Counselors
            </button>
            <button 
              onClick={() => handleNavClick('/insights')}
              className="text-sm xl:text-base text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Insights
            </button>
            <button 
              onClick={() => handleNavClick('/login')}
              className="text-sm xl:text-base text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleNavClick('/signup')}
              className="px-5 xl:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-purple-700 transition-colors text-sm xl:text-base font-medium shadow-sm"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-purple-600"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => handleNavClick('/counselors')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Counselors
              </button>
              <button 
                onClick={() => handleNavClick('/insights')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Insights
              </button>
              <button 
                onClick={() => handleNavClick('/login')}
                className="text-gray-700 hover:text-purple-600 transition-colors text-left"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleNavClick('/signup')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}