import React, { useState, useEffect } from "react";

const AdminAddProblem = ({ socket, roomId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    testCases: [{ input: "", expectedOutput: "" }],
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      testCases: updatedTestCases,
    }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", expectedOutput: "" }],
    }));
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      testCases: updatedTestCases,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTestCases = formData.testCases.map(
      (tc) => `${tc.input} -> ${tc.expectedOutput}`
    );

    const payload = {
      ...formData,
      testCases: formattedTestCases,
    };

    try {
      const response = await fetch("http://localhost:https://codequestbackend-1.onrender.com/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedProblem = await response.json();
        setSuccess(true);

        // ✅ Emit to all users in the room via WebSocket
        if (socket && roomId) {
          socket.emit("share-problem", {
            roomId,
            problem: savedProblem,
          });
        }

        // Reset form
        setFormData({
          title: "",
          description: "",
          difficulty: "Easy",
          testCases: [{ input: "", expectedOutput: "" }],
        });
      } else {
        alert("❌ Failed to add problem.");
      }
    } catch (error) {
      console.error("Error adding problem:", error);
      alert("❌ Error while adding problem.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        ➕ Add Coding Problem
      </h2>

      {success && (
        <div className="mb-4 text-green-600 font-medium">
          ✅ Problem added and shared successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="e.g. Two Sum"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md h-40 dark:bg-gray-700 dark:text-white"
            placeholder="Describe the problem..."
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-200">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-200 font-semibold">
            Test Cases
          </label>
          {formData.testCases.map((testCase, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-md dark:bg-gray-700"
            >
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Input
              </label>
              <input
                name="input"
                value={testCase.input}
                onChange={(e) => handleTestCaseChange(index, e)}
                className="w-full px-3 py-2 mb-2 border rounded-md dark:bg-gray-600 dark:text-white"
                placeholder="e.g. 5 10"
              />
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Expected Output
              </label>
              <input
                name="expectedOutput"
                value={testCase.expectedOutput}
                onChange={(e) => handleTestCaseChange(index, e)}
                className="w-full px-3 py-2 mb-2 border rounded-md dark:bg-gray-600 dark:text-white"
                placeholder="e.g. 15"
              />
              {formData.testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addTestCase}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            ➕ Add Test Case
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md"
        >
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AdminAddProblem;
