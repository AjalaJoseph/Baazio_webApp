import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from "react-type-animation";
import { motion } from 'framer-motion'; 
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import heroImage from '../assets/images/BizFlow-homepage-image2.jpg'; 
import businessOwnerDashboard from "../assets/images/BizflowownerDashboard.png";
import reportMockupImage from "../assets/images/report-mockup image.jpg";
import staffTerminalImage from "../assets/images/staff terminal.jpg"
export default function Home() {
    const servicesData = [
    {
      icon: "📊",
      title: "Report Generation",
      description: "Instantly downloads clean, professional PDF and Excel financial files of your business performance.",
    },
    {
      icon: "📈",
      title: "Sales Summary",
      description: "Shows you your daily store profits, transaction charts, and overall business health in real-time.",
    },
    {
      icon: "🧾",
      title: "Sales Receipt",
      description: "Prints or emails clean receipts to your customers in less than a second while logging every transaction.",
    },
    {
      icon: "🏆",
      title: "Top Sales Product",
      description: "Tracks your top 5 fastest-selling inventory items so you know exactly what your customers are buying.",
    },
    {
      icon: "👥",
      title: "Staff Management",
      description: "Creates secure, separate login accounts for your cashiers and monitors their terminal sales history.",
    },
    {
      icon: "🛡️",
      title: "High Business Security",
      description: "Locks down your store data using strict staff permissions and safe 5-minute login reset codes.",
    }
  ];

  // 🎭 1. PARENT GRID ANIMATION VARIANT (Handles Staggering)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Smoothly delay each card as it slides into view
      }
    }
  };

  // child card variant
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 // Starts 40 pixels lower down, hidden from view
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut" 
      }
    }
  };
  const coreValues = [
    {
      emoji: "🎯",
      title: "Our Mission",
      statement: "To eliminate checkout delays and tracking stress for retail owners. We provide fast, simple tools so you can focus entirely on growing your business.",
      color: "text-primary"
    },
    {
      emoji: "👁️",
      title: "Our Vision",
      statement: "To become the global standard system for smart store management. We make high-speed automation and data tracking accessible to every shop owner.",
      color: "text-secondary"
    },
    {
      emoji: "⚡",
      title: "Architecture",
      statement: "Built for maximum speed, system stability, and total data privacy. Our backend handles heavy reporting so your cash register never slows down.",
      color: "text-primary-fixed-dim"
    }
  ];

  // 🎭 1. PARENT CONTAINER ANIMATION VARIANT
  const aboutusContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Staggers the text block and cards entry smoothly
      }
    }
  };

  // 🎭 2. SLIDE-IN ELEMENT VARIANT
  const elementVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  return (
   <div>
      <Navbar/>
        <main>
            <section id="home" className="w-full bg-background py-16 px-6 md:px-8 ">
            <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* 🏢 LEFT CORE: HIGH-CONTRAST STATIC TYPOGRAPHY AREA */}
        <div className="flex flex-col gap-6 text-left max-w-xl">
          
          <div className="flex flex-col gap-3">
            {/* 🎯 STITCH ALIGNMENT: text-display-lg creates perfect, tightly tracked 48px header typography */}
            <h1 className="text-display-lg text-on-surface font-bold tracking-tight leading-[110%]">
              The Faster, Smarter Way to Run Your Retail Store.
            </h1>
            {/* 🎯 text-headline-md adds a high-density 24px secondary semantic title string */}
            {/* <h2 className="text-headline-md text-primary font-semibold tracking-tight">
              Record Sales in Seconds & Track Business Performance.
            </h2> */}
          </div>

          <p className="text-body-md text-on-surface-variant leading-relaxed">
            Keep your checkout counters moving instantly without any system slowdowns. Track daily sales, manage cash and card payments easily, and get automatic inventory and profit reports all from one secure, easy-to-use platform .
          </p>

          {/* Core Call to Actions Hub */}
          <div className="flex flex-wrap lg:gap-4 mt-2 md:gap-4 gap-2">
            <Link 
              to="/register" 
              className="text-label-md font-semibold bg-primary-container hover:bg-primary text-white px-6 py-3.5 rounded-sm transition-colors shadow-xs cursor-pointer select-none"
            >
              Start Free Trial
            </Link>
            <a 
              href="#services" 
              className="text-label-md font-semibold bg-surface-lowest hover:bg-surface-low border border-outline rounded-sm text-on-surface px-6 py-3.5 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 select-none"
            >
              See How It Works
            </a>
          </div>
          
        </div>

        {/* 🖼️ RIGHT CORE: HERO PREVIEW CANVAS BLOCK */}
        <div className="w-full flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-[560px] rounded-md  border-outline-variant bg-surface-lowest p-2 shadow-sm relative group overflow-hidden">
            
            {/* Smooth background glow layer token effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <img 
              src={heroImage} 
              alt="BizFlow Operational Terminal Framework" 
              className="w-full h-auto object-contain block rounded-md border-0 border-outline-variant bg-surface-low" 
            />
          </div>
        </div>

      </div>
            </section>
            <section id="features" className="w-full bg-surface-low  pt-4 pb-20 px-6 md:px-8 select-none">
      
      {/* 🚀 THE FIXED GRID LOCKER: Constrained to exactly 1126px wide so card widths stay beautifully compact! */}
        <div className="w-full max-w-[1150px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-10">
        
        <div className="relative group bg-surface-lowest rounded-md p-5 text-left cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xs">
          
          {/* Inner Image Panel: Scaled perfectly inside the parent container card */}
          <div className="w-full aspect-[16/10] bg-surface-low rounded-sm overflow-hidden mb-4 border border-outline-variant/30">
            <img 
              src={businessOwnerDashboard} 
              alt="The Business Owner Dashboard" 
              className="w-full h-full object-cover block"
            />
          </div>
          
          {/* Text Area: Nested inside the same relative white container block layout card */}
          <div className="flex flex-col gap-2">
            {/* text-headline-md matches your 24px bold typography layout ink */}
            <h3 className="text-headline-md text-on-surface font-bold tracking-tight group-hover:text-primary transition-colors duration-200">
              The Business Owner Dashboard
            </h3>
            {/* text-body-sm formats the 14px regular descriptive text layout parameters */}
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Full Operational Command. Centralize your executive analytics, view overall store performance velocity logs, and monitor cash or POS machine terminal configurations instantly.
            </p>
          </div>
        </div>

        {/* Module 2: Executive Financial Reports */}
        <div className="relative group bg-surface-lowest  rounded-md p-5 text-left cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xs">
          
          <div className="w-full aspect-[16/10] bg-surface-low rounded-sm overflow-hidden mb-4 border border-outline-variant/30">
            <img 
              src={reportMockupImage} 
              alt="Executive Financial Reports" 
              className="w-full h-full object-cover block"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-headline-md text-on-surface font-bold tracking-tight group-hover:text-primary transition-colors duration-200">
              Executive Financial Reports
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              On-Demand Data Extraction. Stream production-ready business summaries, clean PDF statements, and structured multi-column data sheets effortlessly.
            </p>
          </div>
        </div>

        {/* Module 3: The Dedicated Staff Terminal */}
        <div className="relative group bg-surface-lowest  rounded-md p-5 text-left cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xs">
          
          <div className="w-full aspect-[16/10] bg-surface-low rounded-sm overflow-hidden mb-4 border border-outline-variant/30">
            <img 
              src={staffTerminalImage} 
              alt="The Dedicated Staff Terminal" 
              className="w-full h-full object-cover block"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-headline-md text-on-surface font-bold tracking-tight group-hover:text-primary transition-colors duration-200">
              The Dedicated Staff Terminal
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              High-Speed Point of Sale. Empower cashiers through minimalist, distraction-free register portals engineered for sub-second retail transaction receipts creation.
            </p>
          </div>
        </div>

      </div>
             </section>
              <section id="services" className="w-full bg-background py-16 px-6 md:px-8 ">
      
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h2 className="text-display-md text-on-surface font-bold tracking-tight">
          Core Services
        </h2>
        {/* <div className="w-12 h-[3px] bg-primary rounded-full mt-3"></div> */}
      </div>

      {/* 🚀 THE ANIMATED MOTION GRID CONTAINER */}
      {/* initial="hidden" whileInView="visible" viewport={{ once: true }} triggers scroll trigger only once */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1130px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
      >
        {servicesData.map((service, index) => (
          /* 🧱 EACH CARD: Upgraded to motion.div inheriting variants natively */
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
             whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative group bg-surface-lowest shadow-md rounded-lg p-6 text-left cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xs"
          >
            {/* Minimal Icon Badge */}
            <div className="w-12 h-12 rounded-md bg-surface-variant flex items-center justify-center text-2xl mb-4 group-hover:bg-primary-fixed-dim transition-colors duration-300">
              {service.icon}
            </div>

            {/* Headline Typography (24px bold) */}
            <h3 className="text-headline-md text-on-surface font-bold tracking-tight mb-2 group-hover:text-primary transition-colors duration-200">
              {service.title}
            </h3>

            {/* Body Typography (14px regular) */}
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

            </section>

            <section id="about" className="w-full bg-surface-low py-24 px-6 md:px-8 ">
      
      {/* 🚀 THE SPLIT MOTION GRID LOGIC WRAPPER */}
      {/* amount: 0.25 ensures elements stay completely hidden until 25% of the section enters the screen viewport */}
      <motion.div
        variants={aboutusContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="w-full max-w-[1126px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
      >
        
        {/* 🏢 LEFT CORE: METRIC TEXT BLOCK OVERVIEW (Spans 5 columns) */}
        <motion.div variants={elementVariants} className="lg:col-span-5 flex flex-col gap-4 text-left">
          <span className="text-label-sm font-bold text-primary uppercase tracking-wider bg-primary-fixed px-2 py-1 rounded-sm w-fit">
            Corporate Philosophy
          </span>
          {/* text-display-md handles clean 36px bold enterprise typography */}
          <h2 className="text-display-md text-on-surface font-bold tracking-tight leading-tight">
            Engineered for Modern Enterprise Scale
          </h2>
          {/* text-body-md applies smooth 16px descriptive ink variables */}
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            At BizFlow, we believe software should empower operators, not slow them down. We combine edge-cache memory clusters with relational transactional safeguards to deliver tools that keep corporate supermarkets fully secure, data-isolated, and scaling seamlessly.
          </p>
        </motion.div>

        {/* 🧱 RIGHT CORE: 3-ROW VALUES GRID CARDS STACK (Spans 7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              variants={elementVariants}
              // Both image assets placeholder equivalents and texts live inside a relative white container block layout card
              className="relative group bg-surface-lowest shadow-md rounded-md p-5 text-left flex flex-col sm:flex-row gap-4 items-start cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xs"
            >
              {/* Minimal Circle Emoji Icon Container */}
              <div className="w-12 h-12 rounded-md bg-surface-low  flex items-center justify-center text-2xl shrink-0 group-hover:bg-surface-container transition-colors duration-200">
                {value.emoji}
              </div>

              <div className="flex flex-col gap-1">
                {/* text-headline-md matches your 24px bold title metrics */}
                <h3 className="text-headline-md text-on-surface font-bold tracking-tight group-hover:text-primary transition-colors duration-200">
                  {value.title}
                </h3>
                {/* text-body-sm formats the 14px regular descriptive parameters text layout */}
                <p className="text-body-sm text-on-surface-variant leading-relaxed italic">
                  {value.statement}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
        </main>
        <Footer/>
   </div>
  );
}
