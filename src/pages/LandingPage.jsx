import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import Room from "../pages/Room";
import { 
  FaCode, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaChartLine, 
  FaTimes, 
  FaPlay,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaDiscord,
  FaTwitter,
  FaGithub,
  FaLinkedin
} from "react-icons/fa";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: FaCode,
    title: "Real-Time Coding Arena",
    description: "Collaborate live in a multi-language environment with integrated code execution.",
    extendedDesc: "Support for 15+ programming languages with real-time syntax highlighting and collaborative editing."
  },
  {
    icon: FaChalkboardTeacher,
    title: "Mock Interview Simulator",
    description: "Experience real interview pressure with timer, roles, and shared problems.",
    extendedDesc: "Customizable interview scenarios with role-playing options and performance evaluation metrics."
  },
  {
    icon: FaUsers,
    title: "Live Collaboration",
    description: "Chat, share problems, and code together with peers and mentors.",
    extendedDesc: "Integrated voice/video chat, screen sharing, and collaborative problem-solving tools."
  },
  {
    icon: FaChartLine,
    title: "Performance Insights",
    description: "Track accuracy, speed, and improvements over time with detailed analytics.",
    extendedDesc: "Comprehensive dashboards with skill progression tracking and personalized improvement recommendations."
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    content: "CodeQuest transformed my interview preparation. The mock interviews felt so real that my actual interview was a breeze!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Frontend Developer at Meta",
    content: "The collaborative coding environment is incredible. I found an amazing study group through CodeQuest and we all got job offers!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Computer Science Student",
    content: "As a student with limited resources, CodeQuest provided everything I needed to prepare for technical interviews without breaking the bank.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80",
    rating: 4
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for beginners getting started with coding interviews",
    features: ["5 coding problems per week", "Basic collaboration tools", "Limited mock interviews", "Community support"],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    price: "$15",
    period: "per month",
    description: "For serious job seekers preparing for technical interviews",
    features: ["Unlimited coding problems", "Advanced collaboration tools", "Unlimited mock interviews", "Basic analytics", "Priority support"],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    description: "For teams and organizations preparing together",
    features: ["All Professional features", "Team management", "Custom problem sets", "Advanced analytics dashboard", "Dedicated success manager", "SSO integration"],
    cta: "Contact Sales",
    popular: false
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  },
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage = () => {
  const { darkMode } = useTheme();
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const testimonialRef = useRef(null);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openRoomPopup = () => setIsRoomOpen(true);
  const closeRoomPopup = () => setIsRoomOpen(false);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your backend
      console.log("Subscribed with email:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
     
 

      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-br from-green-400 via-indigo-500 to-purple-600 dark:from-green-500 dark:via-indigo-600 dark:to-purple-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Master Coding Interviews with <span className="text-yellow-300">CodeQuest</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Collaborate, Conquer, Code: Your Path to Interview Success
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={openRoomPopup}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-lg shadow-xl hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2"
            >
              <span>🚀 Start Your Journey</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center gap-2"
            >
              <FaPlay className="text-sm" />
              <span>View Demo</span>
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="mt-16 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-300 mx-0.5" />
                ))}
              </div>
              <span className="ml-2 text-white">4.9/5 from 2,500+ developers</span>
            </div>
          </motion.div>
        </div>

        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-32 h-32 bg-green-300/30 rounded-full top-1/4 left-1/4 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1], 
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />
          <motion.div
            className="absolute w-40 h-40 bg-purple-300/30 rounded-full bottom-1/4 right-1/4 blur-xl"
            animate={{ 
              scale: [1, 1.3, 1], 
              y: [0, 30, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          />
          <motion.div
            className="absolute w-24 h-24 bg-white/20 rounded-full top-2/3 left-1/3 blur-lg"
            animate={{ 
              scale: [1, 1.5, 1], 
              y: [0, -40, 0],
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
        </div>

        {/* Gradient overlay for better text contrast */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/10 to-transparent"></div>
        
        {/* Scrolling indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Logo Cloud Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-center text-gray-500 dark:text-gray-400 text-sm font-semibold mb-8 uppercase tracking-wider">Trusted by developers at</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple"].map((company, index) => (
              <div key={index} className="relative h-8 w-32 grayscale opacity-60 hover:opacity-100 transition-opacity duration-300">
                {/* Company logo placeholder */}
                <div className="flex items-center justify-center w-full h-full font-semibold text-gray-500 dark:text-gray-400">
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        ref={ref}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
        variants={staggerChildren}
        initial="hidden"
        animate={controls}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unleash Your <span className="text-indigo-600">Potential</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to prepare for technical interviews in one powerful platform
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerChildren}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className={`group relative bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-indigo-600"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-2xl text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{feature.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.extendedDesc}</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-indigo-100/30 group-hover:scale-150 transition-transform duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "95%", label: "Success Rate" },
              { number: "500+", label: "Coding Problems" },
              { number: "24/7", label: "Availability" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who have accelerated their career with CodeQuest
            </p>
          </motion.div>
          
          <div className="relative" ref={testimonialRef}>
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 md:p-12"
                >
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                      <img 
                        src={testimonials[activeTestimonial].avatar} 
                        alt={testimonials[activeTestimonial].name}
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < testimonials[activeTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'} mx-1`} 
                          />
                        ))}
                      </div>
                      <p className="text-lg italic mb-6 text-gray-600 dark:text-gray-300">
                        "{testimonials[activeTestimonial].content}"
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonials[activeTestimonial].name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{testimonials[activeTestimonial].role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 bg-white dark:bg-gray-700 rounded-full p-3 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <FaChevronLeft className="text-indigo-600" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 bg-white dark:bg-gray-700 rounded-full p-3 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <FaChevronRight className="text-indigo-600" />
            </button>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${index === activeTestimonial ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for you and your interview preparation needs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular 
                    ? 'ring-2 ring-indigo-600 transform scale-105' 
                    : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8 bg-white dark:bg-gray-800">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.period !== "forever" && <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">{plan.description}</p>
                  
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-4 rounded-lg font-semibold ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors duration-300`}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about the platform
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              {
                question: "How does the real-time collaboration work?",
                answer: "Our platform uses operational transformation algorithms to enable seamless real-time collaboration. Multiple users can edit code simultaneously with changes synced instantly across all connected clients."
              },
              {
                question: "What programming languages are supported?",
                answer: "We support all major programming languages including JavaScript, Python, Java, C++, C#, Ruby, Go, Rust, Swift, and more. Our environment includes syntax highlighting, code completion, and execution for each language."
              },
              {
                question: "Can I use CodeQuest for team interviews?",
                answer: "Yes! Our Enterprise plan includes team management features that allow you to conduct mock interviews with multiple interviewers and evaluate candidates collaboratively."
              },
              {
                question: "How do you ensure interview questions are relevant?",
                answer: "Our question library is curated by industry experts from top tech companies and updated regularly based on current interview trends. Users can also submit their own questions for community use."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Elevate Your Interview Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            CodeQuest empowers you with live collaboration, mock interviews, analytics, and a vast problem library—everything you need to crack top tech interviews with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={openRoomPopup}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-lg shadow-xl hover:bg-gray-100 transition-colors duration-300"
            >
              🔥 Start Your CodeQuest
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              Schedule a Demo
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with CodeQuest</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest interview tips, product updates, and exclusive offers directly to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
            >
              Subscribe
            </motion.button>
          </form>
          
          <AnimatePresence>
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg"
              >
                Thanks for subscribing! Check your email for confirmation.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>



      {/* Modal Room Component */}
      {isRoomOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <button
              onClick={closeRoomPopup}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto">
              <Room />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;
