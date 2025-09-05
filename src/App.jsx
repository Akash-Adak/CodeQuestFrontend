import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useMatch } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import LandingPage from "./pages/LandingPage";
import OAuth2Success from "./components/OAuth2Success";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import ForgerPasswordPage from "./pages/ForgerPasswordPage";
import Room from "./pages/Room";
import CodeEditor from "./components/CodeEditor";
import { Toaster } from 'react-hot-toast';
import InterviewTypes from "./interview/InterviewTypes";
import InterviewPanel from "./interview/InterviewPanel";
import RequireAuth from "./services/RequireAuth";
import Profile from "./pages/Profile";
import AdminAddProblem from "./pages/AdminAddProblem";
import AdminProblemList from "./pages/AdminProblemList";
import ProblemEditor from "./pages/ProblemEditor";
import PeerMatchPage from "./interview/PeerMatchPage";
import { AuthProvider } from './context/AuthContext';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const location = useLocation();

  const roomPageMatch = useMatch("/roompage/:roomId");
  const interviewPanelMatch = useMatch("/interviewPanel/:sessionId");

  const showNavbar = !roomPageMatch;
  const showFooter = !roomPageMatch && !interviewPanelMatch;
  const handleSignInSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  const handleSignUpSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        {showNavbar && <Navbar token={token} onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<LandingPage onSignInSuccess={handleSignInSuccess} />} />

          <Route path="/landing" element={<LandingPage onSignInSuccess={handleSignInSuccess} />} />

          <Route path="/signup" element={<SignUp onSignUpSuccess={handleSignUpSuccess} />} />

          <Route path="/login" element={<Login onLoginSuccess={(token) => setToken(token)} />} />

          <Route path="/oauth2-success" element={<OAuth2Success onSignInSuccess={handleSignInSuccess} onSignUpSuccess={handleSignUpSuccess} />} />

          <Route
            path="/roompage/:roomId"
            element={
              <RequireAuth>
                <RoomPage />
              </RequireAuth>
            }
          />

          <Route path="/room" element={<Room />} />

          <Route path="/forgotpassword" element={<ForgerPasswordPage />} />
          <Route path="/InterviewTypes" element={<InterviewTypes />} />
          <Route path="/InterviewPanel/:sessionId" element={  <RequireAuth><InterviewPanel />   </RequireAuth>} />
          <Route path="/CodeEditor" element={<CodeEditor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/add-problem" element={<AdminAddProblem />} />
          <Route path="/editor" element={<ProblemEditor />} />
          <Route path="/admin/problem-list" element={<AdminProblemList />} />
          <Route path="/peer-match" element={<PeerMatchPage />} />

          <Route path="/dashboard" element={<Dashboard onSignInSuccess={handleSignInSuccess} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {showFooter && <Footer />}
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </AuthProvider>
  );
}

export default App;
