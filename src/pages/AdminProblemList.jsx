import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const AdminProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch all problems from the backend
  const fetchProblems = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://codequestbackend-1.onrender.com/api/problems");
      if (response.ok) {
        const data = await response.json();
        setProblems(data);
      } else {
        throw new Error("Failed to fetch problems.");
      }
    } catch (error) {
      setError(error.message); // Set error message if something goes wrong
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        const response = await fetch(`http://localhost:https://codequestbackend-1.onrender.com/api/problems/${problemId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Problem deleted successfully!");
          fetchProblems(); // Refresh the problem list
        } else {
          throw new Error("Failed to delete problem.");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (problem) => {
    // You can implement the edit functionality as needed
    alert(`Editing: ${problem.title}`);
  };

  const handleViewProblem = (problem) => {
    // Navigate to the ProblemEditor page and pass the problem as state
    navigate("/editor", { state: { problem } });
  };

  useEffect(() => {
    fetchProblems(); // Initial fetch
  }, []);

  if (loading) {
    return <div className="text-center">Loading problems...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📋 Problem List</h2>

      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Title</th>
            <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Difficulty</th>
            <th className="px-6 py-3 text-gray-700 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.length > 0 ? (
            problems.map((problem) => (
              <tr key={problem.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-3 text-gray-800 dark:text-gray-300">{problem.title}</td>
                <td className="px-6 py-3 text-gray-800 dark:text-gray-300">{problem.difficulty}</td>
                <td className="px-6 py-3 space-x-4">
                  <button
                    onClick={() => handleViewProblem(problem)} // Open the problem in the editor
                    className="text-blue-500 hover:text-blue-600"
                  >
                    🔍 View
                  </button>
                  <button
                    onClick={() => handleEdit(problem)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-3 text-center text-gray-800 dark:text-gray-300">
                No problems available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProblemList;
