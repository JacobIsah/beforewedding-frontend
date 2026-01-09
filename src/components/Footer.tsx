import { Heart, Mail, Twitter, Facebook, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl text-white">DuringCourtship</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Building stronger marriages through structured courtship guidance, 
              compatibility assessments, and expert support.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={handleNavigation('/')} className="text-sm hover:text-white transition-colors text-left">
                  Features
                </button>
              </li>
              <li>
                <button onClick={handleNavigation('/')} className="text-sm hover:text-white transition-colors text-left">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={handleNavigation('/')} className="text-sm hover:text-white transition-colors text-left">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={handleNavigation('/counselors')} className="text-sm hover:text-white transition-colors text-left">
                  Counselor Directory
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={handleNavigation('/insights')} className="text-sm hover:text-white transition-colors text-left">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={handleNavigation('/')} className="text-sm hover:text-white transition-colors text-left">
                  Success Stories
                </button>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <button onClick={handleNavigation('/insights')} className="text-sm hover:text-white transition-colors text-left">
                  Assessment Topics
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={handleNavigation('/')} className="text-sm hover:text-white transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={handleNavigation('/')} className="text-sm hover:text-white transition-colors text-left">
                  Our Mission
                </button>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 DuringCourtship. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@duringcourtship.com" className="hover:text-white transition-colors">
                support@duringcourtship.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}