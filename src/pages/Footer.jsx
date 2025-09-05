import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function Footer() {
  const { darkMode } = useTheme();
  const textColor = darkMode ? "text-gray-300" : "text-gray-700";
  const subtleTextColor = darkMode ? "text-gray-500" : "text-gray-600";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const hoverColor = "hover:text-indigo-600";

  return (
    <footer
      className={`bg-gray-50 dark:bg-gray-800 ${textColor} py-8 border-t ${borderColor} text-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={darkMode ? "/codeQuest-dark.png" : "/codeQuest-light.png"}
                alt="CodeQuest Logo"
                className="h-7"
              />
{/*               <span className="font-semibold tracking-tight">CodeQuest</span> */}
            </div>
            <p className={`text-xs ${subtleTextColor}`}>
              Collaborative coding platform.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-base">
              Explore
            </h3>
            <ul className="space-y-1">
              <li>
                <Link to="/" className={`${hoverColor}`}>
                  Home
                </Link>
              </li>


              <li>
                <Link to="/about" className={`${hoverColor}`}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`${hoverColor}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-base">
              Connect
            </h3>
            <div className="flex gap-3 text-lg mb-1">
              <a
                href="https://github.com/Akash-Adak/CodeQuestFrontend"
                target="_blank"
                rel="noopener noreferrer"
                className={`${hoverColor}`}
              >
                <FaGithub />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={`${hoverColor}`}
              >
                <FaLinkedin />
              </a>
              <a href="codequest.coding@gmail.com" className={`${hoverColor}`}>
                <FaEnvelope />
              </a>
            </div>
            <p className={`text-xs ${subtleTextColor}`}>
              <a
                href="mailto:support@codequest.com"
                className={`${hoverColor}`}
              >
                support@codequest.com
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-2 border-t text-center text-xs ${subtleTextColor} ${borderColor}">
          © {new Date().getFullYear()} CodeQuest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
