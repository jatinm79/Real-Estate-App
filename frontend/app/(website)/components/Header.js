'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Building, Menu, X, Sun, Moon, Phone } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check system preference for dark mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    
    if (isDark) {
      document.body.classList.add('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-smooth border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Building className="h-10 w-10 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-primary-100 rounded-full blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white block leading-tight">
                PrimeProperties
              </span>
              <span className="text-xs text-primary-600 font-medium block leading-tight">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-200 hover:scale-105"
            >
              Home
            </Link>
            <Link 
              href="/properties" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-200 hover:scale-105"
            >
              Properties
            </Link>
            <Link 
              href="/admin" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-all duration-200 hover:scale-105"
            >
              Admin
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-110"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Contact Button */}
            <Link 
              href="tel:+15551234567" 
              className="btn btn-primary flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>Contact Us</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                href="/properties" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                Properties
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 transition-all duration-200"
                onClick={toggleMenu}
              >
                Admin
              </Link>
              <Link 
                href="tel:+15551234567" 
                className="btn btn-primary flex items-center justify-center space-x-2 mt-4"
                onClick={toggleMenu}
              >
                <Phone className="h-4 w-4" />
                <span>Contact Us</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}