import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Room from "../pages/Room";
import { FaCode, FaChalkboardTeacher, FaUsers, FaChartLine } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const features = [
  {
    icon: FaCode,
    title: "Real-Time Coding Arena",
    description: "Collaborate live in a multi-language environment with integrated code execution.",
  },
  {
    icon: FaChalkboardTeacher,
    title: "Mock Interview Simulator",
    description: "Experience real interview pressure with timer, roles, and shared problems.",
  },
  {
    icon: FaUsers,
    title: "Live Collaboration",
    description: "Chat, share problems, and code together with peers and mentors.",
  },
  {
    icon: FaChartLine,
    title: "Performance Insights",
    description: "Track accuracy, speed, and improvements over time with detailed analytics.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 }, // Reduced y offset for mobile
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, // Slightly shorter duration
};

const LandingPage = () => {
  const { darkMode } = useTheme();
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const openRoomPopup = () => setIsRoomOpen(true);
  const closeRoomPopup = () => setIsRoomOpen(false);

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-gradient-to-br from-green-300 to-indigo-300 dark:from-green-300 dark:to-indigo-300 py-16 md:py-24" // Reduced padding
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white drop-shadow-lg">
          Code<span className="text-yellow-300">Quest</span>
        </h1>
        <p className="text-lg md:text-xl text-white mb-6 opacity-90 max-w-2xl">
          Collaborate, Conquer, Code: Your Path to Interview Success
        </p>
        <motion.button
          onClick={openRoomPopup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-full shadow-lg hover:bg-indigo-100 transition duration-300"
        >
          🚀 Ignite Your Quest
        </motion.button>

        {/* Background Animation Bubbles */}
        <motion.div
          className="absolute w-24 h-24 bg-green-200 rounded-full top-1/4 left-1/4 blur-2xl opacity-40" // Reduced size for mobile
          animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }} // Reduced y offset
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <motion.div
          className="absolute w-32 h-32 bg-indigo-200 rounded-full bottom-1/4 right-1/4 blur-3xl opacity-40" // Reduced size for mobile
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={ref}
        className="py-20 px-4 sm:px-6 lg:px-24 bg-green-50 dark:bg-gray-800" // Adjusted padding
        variants={fadeInUp}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12" // Reduced font size on mobile
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          Unleash Your Potential with <span className="text-indigo-600">Key Features</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Reduced gap on mobile */}
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300`} // Reduced padding
              variants={fadeInUp}
              initial="hidden"
              animate={controls}
              transition={{ delay: 0.2 + idx * 0.15 }} // Slightly reduced delay
            >
              <feature.icon className="text-4xl md:text-5xl text-indigo-500 mb-3 md:mb-4" /> {/* Reduced font size on mobile */}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 text-center bg-indigo-50 dark:bg-gray-900" // Adjusted padding
        variants={fadeInUp}
        initial="hidden"
        animate={controls}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6" // Reduced font size on mobile
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
        >
          Ready to Elevate Your Interview Journey?
        </motion.h2>
        <motion.p
          className="text-lg max-w-3xl mx-auto mb-8 text-gray-700 dark:text-gray-300"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          CodeQuest empowers you with live collaboration, mock interviews, analytics, and a vast problem library—everything you need to crack top tech interviews with confidence.
        </motion.p>
        <motion.button
          onClick={openRoomPopup}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-full shadow-xl hover:bg-indigo-800 transition duration-300" // Reduced padding
        >
          🔥 Start Your CodeQuest
        </motion.button>
      </motion.section>

      {/* Modal Room Component */}
      {isRoomOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-2xl max-w-xl w-full" // Adjusted padding
          >
            <button
              onClick={closeRoomPopup}
              className="absolute top-3 right-4 text-2xl text-gray-700 dark:text-gray-300 hover:text-red-500" // Adjusted positioning
            >
              ×
            </button>
            <Room />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

