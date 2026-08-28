import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import logoImage2 from "../assets/images/new baazio logo (2).png";

/**
 * High-Density Mockup-Matched Responsive Navigation Bar.
 * Upgraded with a mobile menu icon toggle and fluid mobile drawer panel overlay.
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState("home");

  // 2. Automatically detect which section is on screen during scroll events
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "about"];
      const scrollPosition = window.scrollY + 200; // Offset for navbar height

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full bg-surface-lowest border-b border-outline-variant sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 flex items-center justify-between h-18">
        
        {/* 🏢 LEFT LOGO ANCHOR CHANNEL */}
        <div className="flex items-center">
          <Link to="/" className="inline-block w-35 select-none hover:opacity-90 transition-opacity">
            <img 
              src={logoImage2} 
              alt="Baazio" 
              className="w-full h-auto object-contain block" 
            />
          </Link>
        </div>

        {/* 📑 CENTER LINKS STACK WITH ACTIVE LINE INDICATORS (Desktop Layout) */}
        <nav className="hidden md:flex items-center gap-8 h-full text-body-sm font-medium text-on-surface-variant">
          <a 
            href="/" 
            onClick={() => setActiveSection("home")}
            className={`text-body-md font-medium relative py-2 transition-colors cursor-pointer select-none ${
            activeSection === "home" ? "text-primary" : "text-on-surface hover:text-primary"
          }`}
          >
            Home
            {activeSection === "home" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in"></span>
          )}
          </a>
          
          <a 
            href="#services" 
             onClick={() => setActiveSection("services")}
           className={`text-body-md font-medium relative py-2 transition-colors cursor-pointer select-none ${
            activeSection === "services" ? "text-primary" : "text-on-surface hover:text-primary"
          }`}
          >
            Services
            {activeSection === "services" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in"></span>
          )}
          </a>
          
          <a
          href="#about"
          onClick={() => setActiveSection("about")}
          className={`text-body-md font-sans relative py-2 transition-colors cursor-pointer select-none ${
            activeSection === "about" ? "text-primary" : "text-on-surface hover:text-primary"
          }`}
        >
          About Us
          {activeSection === "about" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in"></span>
          )}
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
            className="text-label-md bg-primary-container hover:bg-primary text-white px-5 py-2.5 rounded-sm transition-colors shadow-sm shadow-slate-500 cursor-pointer select-none"
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
