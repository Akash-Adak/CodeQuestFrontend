import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaHome,
  FaDoorOpen,
  FaComments,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

function Navbar({ token, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("profile");

    onLogout();
    navigate("/landing");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (location.pathname.startsWith("/interviewPanel")) return null;

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md px-4 py-3 flex items-center justify-between"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={darkMode ? "/codeQuest-dark.png" : "/codeQuest-light.png"}
          alt="CodeQuest"
          className="h-10 sm:h-12 md:h-14 w-auto"
        />
      </Link>

      {/* Hamburger */}
      <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
        ☰
      </div>

      {/* Search Bar */}
      <motion.div
        animate={{
          scale: searchFocused ? 1.05 : 1,
          boxShadow: searchFocused
            ? "0 0 0 2px rgba(59,130,246,0.5)"
            : "none",
        }}
        className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full transition-all duration-200"
      >
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search companies, jobs..."
          className="bg-transparent focus:outline-none text-sm text-gray-700 dark:text-white"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </motion.div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-5">
        {[
          { to: "/", label: "Home", icon: <FaHome /> },
          { to: "/room", label: "Rooms", icon: <FaDoorOpen /> },
          { to: "/InterviewTypes", label: "Interview", icon: <FaComments /> },
          { to: "/about", label: "About", icon: <FaInfoCircle /> },
        ].map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {icon} {label}
          </Link>
        ))}

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          whileTap={{ rotate: 360 }}
          className="text-xl hover:text-yellow-500 dark:hover:text-yellow-300 transition"
          title="Toggle theme"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </motion.button>

        {/* Profile Dropdown */}
        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaUser /> Profile ▼
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50"
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaUser className="mr-2" />DashBoard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaCog className="mr-2" /> ViewProfile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 flex flex-col items-start px-6 py-4 gap-3 md:hidden shadow-lg z-40"
          >
            <Link to="/" onClick={toggleMenu}>
              <FaHome className="inline mr-2" /> Home
            </Link>
            <Link to="/room" onClick={toggleMenu}>
              <FaDoorOpen className="inline mr-2" /> Rooms
            </Link>
            <Link to="/InterviewTypes" onClick={toggleMenu}>
              <FaComments className="inline mr-2" /> Interview
            </Link>
            <Link to="/about" onClick={toggleMenu}>
              <FaInfoCircle className="inline mr-2" /> About
            </Link>
            <button
              onClick={toggleDarkMode}
              className="text-xl mt-2 hover:text-yellow-500 dark:hover:text-yellow-300"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            {token ? (
              <>
                <Link to="/dashboard" onClick={toggleMenu}>
                  <FaUser className="inline mr-2" /> Dashboard
                </Link>
                <Link to="/profile" onClick={toggleMenu}>
                  <FaCog className="inline mr-2" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-red-500"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu}>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded mt-2 hover:bg-blue-700"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
