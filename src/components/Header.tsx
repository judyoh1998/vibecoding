import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Heart className="w-8 h-8 text-blue-600 group-hover:text-indigo-600 transition-colors duration-200" />
              <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BetterFriend
              </h1>
              <p className="text-xs text-blue-600 font-medium -mt-1">AI Communication Coach</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-blue-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Analyze
            </Link>
            <div className="text-blue-600 text-sm">
              Based on proven relationship science
            </div>
          </nav>

          {/* Mobile menu button - for future expansion */}
          <div className="md:hidden">
            <Link 
              to="/" 
              className="text-blue-700 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50 text-sm"
            >
              Analyze
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;