import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reset = searchParams.get("reset");
    if (reset === "success") {
      toast.success("Password reset successful! Please log in.");
    }
  }, [location.search]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    fetch("https://codequestbackend.onrender.com/public/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })
      .then(async (res) => {
        setLoading(false);
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
//           localStorage.setItem("name", email);

          if (onLoginSuccess) {
            onLoginSuccess(data.token);
          }

          navigate(from, { replace: true });
        } else {
          const text = await res.text();
          setError(text || "Log in failed");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Log in failed");
      });
  };

  // const handleGoogleLogin = () => {
  //   window.location.href = "http://localhost:8080/auth/google/callback";
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-90 backdrop-blur-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-white mb-6">
          Login to CodeQuest
        </h2>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-end mt-2">
          <Link
            to="/forgotpassword"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Forgot Password?
          </Link>
        </div>

{/*         <div className="flex items-center justify-center my-4">
          <div className="text-gray-500 dark:text-gray-400">OR</div>
        </div> */}

{/*         <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>
 */}
        <div className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
