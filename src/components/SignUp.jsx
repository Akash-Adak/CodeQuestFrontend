import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUp = ({ onSignUpSuccess }) => {
  const [step, setStep] = useState("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Regex to check password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://codequestbackend.onrender.com/public/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      setLoading(false);
      if (res.ok) {
        setStep("verify");
        localStorage.setItem("email", email);
        localStorage.setItem("name", username);
      } else {
        const text = await res.text();
        setError(text || "Sign up failed in backend");
      }
    } catch {
      setLoading(false);
      setError("Sign up failed in frontend");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://codequestbackend.onrender.com/public/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      setLoading(false);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        navigate("/Login");
      } else {
        const text = await res.text();
        setError(text || "Verification failed");
      }
    } catch {
      setLoading(false);
      setError("Verification failed");
    }
  };

  // const handleGoogleLogin = () => {
  //   window.location.href = "https://codequestbackend.onrender.com/auth/google/authorization/google";

  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("code");

  //   if (code) {
  //     fetch(`http://localhost:8080/auth/google/callback?code=${code}`, {
  //       method: "GET",
  //       credentials: "include",
  //     })
  //       .then((res) => {
  //         if (res.redirected) {
  //           window.location.href = res.url;
  //         }
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-90 backdrop-blur-lg">
        {step === "signup" && (
          <>
            <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-white mb-6">
              Create your account
            </h2>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              <small className="text-xs text-gray-500 dark:text-gray-400">
                Minimum 8 characters with uppercase, lowercase, number & special character
              </small>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                disabled={loading}
              >
               {loading ? "Creating your account..." : "Sign Up"}
              </button>
            </form>

            <div className="flex items-center justify-center my-4">
              <div className="text-gray-500 dark:text-gray-400">OR</div>
            </div>

{/*             <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google Logo"
                className="w-5 h-5 mr-2"
              />
              Continue with Google
            </button> */}

            <div className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500"
              >
                Login
              </Link>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-white mb-6">
              Verify Your Email
            </h2>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
              <input
                type="text"
                placeholder="Verification Code"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-4 dark:text-gray-400">
              Didn't receive the code?{" "}
              <button
                onClick={handleSignUp}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500 underline"
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
