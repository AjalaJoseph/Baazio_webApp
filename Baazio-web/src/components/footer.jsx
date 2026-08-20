import React from 'react';
import { Link } from 'react-router-dom';
import logoImage2 from "../assets/images/new baazio logo (2).png"

export default function Footer() {
  return (
    // ⚪ MAIN FOOTER WRAPPER: Forced to solid white background
    <footer className="w-full bg-surface-lowest select-none">
      
      {/* 🔵 BLUE BRAND INNER CONTAINER: Features a premium 40px top border radius curve */}
      <div className="bg-primary-container mt-20 rounded-t-[20px] pt-16 pb-12">
        
        {/* 🚀 MAIN CONTENT GRID: Constrained cleanly to your 1126px design boundaries */}
        <div className="w-full max-w-281.5 mx-auto px-6 md:px-0 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Column 1: Brand Copy Abstract Description */}
                    {/* Column 1: Brand Copy Abstract Description */}
          <div className="flex flex-col gap-3">
            {/* 🎯 LOGO IMAGE INTEGRATION: Rendered logoImage2 with custom pixel metrics */}
            <a 
              href="#home" 
              className="font-serif  text-display-lg tracking-tighter text-surface select-none focus:outline-none hover:text-surface-highest transition-colors"
            >
              Baazio
            </a>
            {/* text-body-sm formats the 14px regular description parameters ink layout */}
            <p className="text-body-sm text-on-primary-container leading-relaxed">
              Baazio provides comprehensive retail management software, financial reporting cores, and staff optimization platforms for modern enterprises.
            </p>
          </div>


          {/* Column 2: Quick Links Navigation Row */}
          <div className="flex flex-col gap-3">
            <h5 className="text-[14px] font-bold font-sans tracking-wider uppercase text-white/50">
              Quick Links
            </h5>
            <div className="flex flex-col gap-2.5 text-body-sm text-on-primary-container font-medium">
              <a href="#home" className="hover:text-white transition-colors">
                Home
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About Baazio
              </a>
              <a href="#service" className="hover:text-white transition-colors">
                Explore Features
              </a>
              <Link to="/register">
              Create Free Account
              </Link>
              <Link to="/register" className="hover:text-white transition-colors">
                Launch Workstation
              </Link>
              
              
            </div>
          </div>

          {/* Column 3: Telemetry Infrastructure Platform Status */}
          <div className="flex flex-col gap-3">
            <h5 className="text-[14px] font-bold font-sans tracking-wider uppercase text-white/50">
              Platform Status
            </h5>
            <div className="flex flex-col gap-2.5 text-body-sm text-on-primary-container font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface-lowest"></span>
                System Operational
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface-lowest"></span>
                High Performance
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface-lowest"></span>
                Enterprise Security
              </span>
               <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-surface-lowest"></span>
                Continous update
              </span>
            </div>
          </div>

          {/* Column 4: Corporate Contact Details */}
          <div className="flex flex-col gap-3">
            <h5 className="text-[14px] font-bold font-sans tracking-wider uppercase text-white/50">
              Contact Us
            </h5>
            <div className="flex flex-col gap-3 text-[14px] text-on-primary-container/80 font-sans">
              
              {/* Email Link with Icon */}
              <a 
                href="mailto:ajalaoluwafikayomi27@gmail.com" 
                className="group flex items-center gap-3 font-semibold text-white hover:text-white/80 transition-colors"
              >
                <svg className="w-4 h-4 text-on-primary-container/60 group-hover:text-white transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="truncate">ajalaoluwafikayomi27@gmail.com</span>
              </a>

              {/* WhatsApp Link with Icon */}
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-3 font-semibold text-white hover:text-emerald-400 transition-colors"
              >
                <svg className="w-4 h-4 text-on-primary-container/60 group-hover:text-emerald-400 transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.904-6.99C16.546 1.874 14.067 .843 11.44 0H11.43C5.992 0 1.57 4.422 1.567 9.86c-.001 1.716.452 3.39 1.312 4.869l-1.02 3.722 3.795-1.015zm13.11-7.23c-.302-.15-1.787-.882-2.062-.982-.275-.1-.475-.15-.674.15-.199.3-.773.982-.948 1.182-.175.2-.35.225-.652.075-1.077-.54-1.85-.92-2.585-2.18-.19-.328.19-.304.544-1.01.059-.118.029-.223-.014-.323-.044-.1-.422-1.018-.578-1.396-.153-.368-.31-.318-.423-.324l-.36-.006c-.124 0-.327.046-.498.233-.171.188-.653.639-.653 1.557 0 .918.667 1.803.76 1.93.093.127 1.313 2.005 3.18 2.812.444.192.79.307 1.061.393.447.142.853.122 1.174.074.358-.054 1.787-.73 2.037-1.435.25-.705.25-1.312.175-1.436-.075-.124-.275-.2-.577-.35z"/>
                </svg>
                <span>+234 901 501 7465</span>
              </a>

              {/* Facebook Link with Icon */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-3 font-semibold text-white hover:text-blue-400 transition-colors"
              >
                <svg className="w-4 h-4 text-on-primary-container/60 group-hover:text-blue-400 transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
                <span>Ajala Joseph Fikayo</span>
              </a>

              {/* Availability Subtext */}
              <span className="mt-1 text-[13px] text-on-primary-container/60 block">
                Enterprise Support available 24/7.
              </span>
            </div>
          </div>

        </div>

        {/* 🧾 LOWER LEGAL FOOTNOTE: Darkened dividing border line sits cleanly right above the text */}
        <div className="w-full max-w-281.5 mx-auto px-6 md:px-0 border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-label-sm">
          <span className="font-medium text-on-primary-container/80">
            ©  {new Date().getFullYear()} Baazio Management System. All rights reserved.
          </span>
          <div className="flex gap-6 font-medium text-on-primary-container/80">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
