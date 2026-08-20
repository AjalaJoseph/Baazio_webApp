import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/logo.png'; 
import logoImage2 from "../assets/images/new baazio logo (2).png";

/**
 * High-Density Mockup-Matched Responsive Navigation Bar.
 * Upgraded with a mobile menu icon toggle and fluid mobile drawer panel overlay.
 */
export default function Navbar() {
  // 📱 Track state toggle flag for mobile view overlay panel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-surface-lowest border-b border-outline-variant sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between h-18">
        
        {/* 🏢 LEFT LOGO ANCHOR CHANNEL */}
        <div className="flex items-center">
          <Link to="/" className="inline-block w-35 select-none hover:opacity-90 transition-opacity">
            <img 
              src={logoImage2} 
              alt="BIZFLOW" 
              className="w-full h-auto object-contain block" 
            />
          </Link>
        </div>

        {/* 📑 CENTER LINKS STACK WITH ACTIVE LINE INDICATORS (Desktop Layout) */}
        <nav className="hidden md:flex items-center gap-8 h-full text-body-sm font-medium text-on-surface-variant">
          <a 
            href="/" 
            className="relative flex items-center h-full text-primary font-semibold select-none group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-xs"></span>
          </a>
          
          <a 
            href="#services" 
            className="relative flex items-center h-full hover:text-primary transition-colors select-none"
          >
            Services
          </a>
          
          <a 
            href="#about" 
            className="relative flex items-center h-full hover:text-primary transition-colors select-none"
          >
            About Us
          </a>
        </nav>

        {/* 🔑 RIGHT SECTION ACCESS OPERATIONS CONTROLS (Desktop Layout) */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-label-md font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer select-none"
          >
            Login
          </Link>
          
          <Link 
            to="/register" 
            className="text-label-md bg-primary-container hover:bg-primary text-white px-5 py-2.5 rounded-sm transition-colors shadow-xs cursor-pointer select-none"
          >
            Get Started
          </Link>
        </div>

        {/* 📱 MOBILE NAVIGATION HAMBURGER ICON BUTTON (Visible only on mobile screen viewports) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          className="md:hidden p-2 rounded-md text-on-surface hover:bg-surface-low border border-outline-variant transition-colors focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? (
            // ❌ Close Menu Vector Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // 🍔 Open Hamburger Menu Vector Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* 📊 MOBILE SLIDE-DOWN NAVIGATION PANEL OVERLAY */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-surface-lowest border-t border-outline-variant py-6 px-6 absolute top-18 left-0 shadow-lg flex flex-col gap-4 text-body-sm font-semibold text-on-surface-variant z-50">
          <a
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-primary py-2 border-b border-surface-low"
          >
            Home
          </a>
          <a
            href="#services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-primary py-2 border-b border-surface-low transition-colors"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-primary py-2 border-b border-surface-low transition-colors"
          >
            About Us
          </a>
          
          {/* Action Navigation Rows Within Mobile View */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-2 text-label-md font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center bg-primary-container hover:bg-primary text-white py-2.5 rounded-sm font-medium text-label-md transition-colors shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
