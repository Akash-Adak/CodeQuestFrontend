import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";

const ProblemEditor = () => {
  const location = useLocation();
  const problem = location.state?.problem;

  const [code, setCode] = useState("// Write your code here");
  const [status, setStatus] = useState("Not Submitted");
  const [output, setOutput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate code submission result
    setStatus("Accepted");
    setOutput("✅ Test Case Passed\n⏱ Runtime: 0ms");
  };

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-semibold">
        Problem not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel: Problem Description */}
      <div className="lg:w-1/2 w-full overflow-y-auto p-6 bg-white dark:bg-gray-900 border-r dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          📋 {problem.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Difficulty: {problem.difficulty} · Tags: {problem.tags?.join(", ")}
        </p>
        <p className="text-gray-800 dark:text-gray-300 mb-4 whitespace-pre-wrap">
          {problem.description}
        </p>

        {/* Examples */}
        {problem.examples?.map((ex, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-cyan-500">Example {index + 1}</h3>
            <pre className="bg-gray-200 dark:bg-gray-800 text-sm text-green-600 dark:text-green-300 p-3 rounded whitespace-pre-wrap">
              {ex}
            </pre>
          </div>
        ))}
      </div>

      {/* Right Panel: Code Editor */}
      <div className="lg:w-1/2 w-full flex flex-col p-6 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Language: {problem.language || "Java"}
          </h3>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Code
          </button>
        </div>

        <div className="flex-grow mb-4">
          <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Output */}
        <div className="bg-gray-200 dark:bg-gray-900 text-sm text-black dark:text-white p-4 rounded">
          <h4 className="font-bold text-green-500">Test Result:</h4>
          <p>Status: {status}</p>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;
