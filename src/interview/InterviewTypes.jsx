import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaUsers,
  FaHandshake,
  FaDoorOpen,
  FaArrowRight,
} from "react-icons/fa";

const InterviewTypes = () => {
  const types = [
    {
      title: "Mock Interviews",
      description:
        "Simulated interviews with AI or mentor. Auto-evaluated and timed sessions.",
      action: "Start Mock Interview",
      route: "/peer-match",
      icon: FaRobot,
    },
    {
      title: "Peer Interviews",
      description: "Pair up with other users for real-time coding practice.",
      action: "Find Peer",
      route: "/peer-match",
      icon: FaUsers,
    },
    {
      title: "Mentor Interviews",
      description:
        "Book paid/live sessions with industry experts for in-depth guidance.",
      action: "Book Mentor",
      route: "/peer-match",
      icon: FaHandshake,
    },
    {
      title: "Custom Interview Rooms",
      description:
        "Create private rooms and share invite links for custom sessions.",
      action: "Create Room",
      route: "/room",
      icon: FaDoorOpen,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="bg-green-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-12">
        Choose Your Interview Type
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {types.map((type, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              {<type.icon className="h-6 w-6 text-blue-500" />}
              <span>{type.title}</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{type.description}</p>
            <Link
              to={type.route}
              className="w-full inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-center rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
            >
              <span>{type.action}</span>
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InterviewTypes;