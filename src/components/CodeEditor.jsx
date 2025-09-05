import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useTheme } from "../context/ThemeContext";
import WebSocketService from "../services/WebSocketService";
import {
  FaPlay,
  FaTrash,
  FaCopy,
  FaJava,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  SiPython,
  SiJavascript,
  SiCplusplus,
  SiC,
  SiPhp,
  SiSwift,

} from "react-icons/si";
import { toast } from "react-toastify";

const initialCodeTemplates = {
  71: "print('Hello, World!')", // Python
  62: `public class Main {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
    }
  }`, // Java
  63: "console.log('Hello, World!');", // JavaScript
  54: `#include <iostream>
  int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
  }`, // C++
  50: `#include <stdio.h>
  int main() {
    printf("Hello, World!\\n");
    return 0;
  }`, // C

  68: `<?php
  echo "Hello, World!\\n";
  ?>`, // PHP
  85: `import Swift
  print("Hello, World!")`, // Swift
 
};

const CodeEditor = ({ roomId, participant }) => {
  const { darkMode } = useTheme();
  const [code, setCode] = useState(initialCodeTemplates[71]);
  const [languageId, setLanguageId] = useState("71");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [activePanel, setActivePanel] = useState("input"); // "input" or "output"
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const codeRef = useRef(code);
  const isFirstLoad = useRef(true);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      WebSocketService.connect(
        roomId,
        () => {
          WebSocketService.sendMessage(
            JSON.stringify({ type: "join", participant }),
            `/app/code/${roomId}`
          );
        },
        (message) => {
          if (typeof message === "string") {
            setCode(message);
            codeRef.current = message;
          }
        },
        () => {},
        () => {
          console.error("WebSocket connection error.");
          toast.error("WebSocket connection error. Please refresh.");
        }
      );
    };

    if (isFirstLoad.current) {
      connectWebSocket();
      isFirstLoad.current = false;
    }

    return () => {
      WebSocketService.sendMessage(
        JSON.stringify({ type: "leave", participant }),
        `/app/code/${roomId}`
      );
      WebSocketService.disconnect();
    };
  }, [roomId, participant]);

  const handleRunCode = async () => {
    try {
      const response = await axios.post("https://codequestbackend.onrender.com/api/code/run", {
        code,
        languageId,
        input,
      });
      setOutput(response.data.output || response.data.error || "No output.");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Execution failed.";
      setOutput(errorMessage);
      toast.error(`Code execution failed: ${errorMessage}`);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
    WebSocketService.sendCodeMessage(newCode);
  };

  const handleLanguageChange = (val) => {
    setLanguageId(val);
    setCode(initialCodeTemplates[val] || ""); // Set initial code based on language
    const langMap = {
      71: "python",
      62: "java",
      63: "javascript",
      54: "cpp",
      50: "c",
      68: "php",
      85: "swift",

    };
    setLanguage(langMap[val] || "");
  };

  const getLanguageIcon = () => {
    const iconStyle = { fontSize: "1.2rem" };
    switch (languageId) {
      case "71":
        return <SiPython style={iconStyle} />;
      case "63":
        return <SiJavascript style={iconStyle} />;
      case "62":
        return <FaJava style={iconStyle} />;
      case "54":
        return <SiCplusplus style={iconStyle} />;
      case "50":
        return <SiC style={iconStyle} />;

      case "68":
        return <SiPhp style={iconStyle} />;

      case "85":
        return <SiSwift style={iconStyle} />;
    
      default:
        return <SiC style={iconStyle} />; // Default to C icon
    }
  };

  const renderEditor = () => (
    <div className="p-4 w-full rounded-md shadow-md overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div className="mb-2 flex justify-end gap-2">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          title="Copy Code"
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none"
        >
          <FaCopy />
        </button>
      </div>
      <Editor
        height="calc(100vh - 180px)" // Adjusted height
        language={language}
        theme={darkMode ? "vs-dark" : "light"}
        value={code}
        onChange={handleCodeChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          automaticLayout: true,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
        }}
      />
    </div>
  );

  const renderPanelToggle = () => (
    <div className="flex gap-2 mb-3">
      <button
        onClick={() => setActivePanel("input")}
        className={`px-4 py-2 rounded-md text-sm focus:outline-none ${
          activePanel === "input"
            ? "bg-indigo-500 text-white shadow-md"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Custom Input
      </button>
      <button
        onClick={() => setActivePanel("output")}
        className={`px-4 py-2 rounded-md text-sm focus:outline-none ${
          activePanel === "output"
            ? "bg-indigo-500 text-white shadow-md"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
      >
        Output
      </button>
    </div>
  );

  const renderInputOutput = () => (
    <div className="p-4 w-full h-full flex flex-col rounded-md shadow-md bg-gray-100 dark:bg-gray-800">
      {renderPanelToggle()}
      {activePanel === "input" ? (
        <textarea
          className="w-full h-full p-3 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
          placeholder="Enter custom input here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-end gap-2 mb-2">
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-md text-sm focus:outline-none"
              onClick={() => setOutput("")}
              title="Clear Output"
            >
              <FaTrash />
            </button>
            <button
              className="bg-green-400 hover:bg-green-500 text-white px-3 py-2 rounded-md text-sm focus:outline-none"
              onClick={() => navigator.clipboard.writeText(output)}
              title="Copy Output"
            >
              <FaCopy />
            </button>
          </div>
          <div className="bg-gray-900 text-white rounded-md p-3 h-full overflow-auto text-sm">
            <pre className="whitespace-pre-wrap">{output || "No output yet."}</pre>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      {/* Header */}
      <div className="bg-gray-700 dark:bg-gray-900 text-white px-6 py-4 border-b border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getLanguageIcon()}
            <select
              value={languageId}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-600 text-white p-2 rounded-md focus:outline-none"
            >
              <option value="71">Python</option>
              <option value="62">Java</option>
              <option value="63">JavaScript</option>
              <option value="54">C++</option>
              <option value="50">C</option>
              <option value="68">PHP</option>
              <option value="85">Swift</option>
            
            </select>
          </div>
          <button
            onClick={handleRunCode}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md flex items-center gap-2 focus:outline-none"
            title="Run Code"
          >
            <FaPlay /> <span className="hidden sm:inline">Run</span>
          </button>
        </div>
        <button
          onClick={() => setIsVerticalLayout(!isVerticalLayout)}
          className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md focus:outline-none"
          title="Toggle Layout"
        >
          <FaExchangeAlt />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-4">
        <div className={`h-full rounded-md overflow-hidden flex ${isVerticalLayout ? "flex-col" : "lg:flex-row"}`}>
          <div className={`w-full ${isVerticalLayout ? "" : "lg:w-1/2"} pr-0 ${isVerticalLayout ? "" : "lg:pr-4"} pb-4 lg:pb-0`}>
            {renderEditor()}
          </div>
          <div className={`w-full ${isVerticalLayout ? "" : "lg:w-1/2"}`}>
            {renderInputOutput()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
