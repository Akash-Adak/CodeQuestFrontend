import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2, Users, History, UserCircle, Clock, Bell
} from 'lucide-react';

const Dashboard = ({ userName = "User" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username,setUsername]=useState("");
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
 useEffect(() => {
   const nameFromStorage = localStorage.getItem("name");
   if (nameFromStorage) {
     setUsername(nameFromStorage);
   }
 }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <div>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {username} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <span className="text-xl">🚀 Dashboard</span>
      </header>

      <main className="p-6 space-y-8">
        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Join/Create Coding Room"
            desc="Collaborate in live coding sessions."
            to="/room"
            icon={<Code2 className="w-6 h-6 text-indigo-500" />}
          />
          <DashboardCard
            title="Start Mock Interview"
            desc="Timed coding practice with AI or peers."
            to="/InterviewTypes"
            icon={<Users className="w-6 h-6 text-green-500" />}
          />
          <DashboardCard
            title="View Past Interviews"
            desc="Review previous interviews & notes."
            to="/past-interviews"
            icon={<History className="w-6 h-6 text-yellow-500" />}
          />
          <DashboardCard
            title="Profile & Settings"
            desc="Manage profile and preferences."
            to="/profile"
            icon={<UserCircle className="w-6 h-6 text-pink-500" />}
          />
        </section>

        {/* Recent Activity */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <Bell className="w-5 h-5 text-blue-500" /> Recent Activity
          </h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li>✅ Completed a mock interview - <span className="text-gray-500">2 hours ago</span></li>
            <li>🆕 New room invitation from <span className="font-semibold">Alex</span></li>
            <li>📈 Performance updated for "<span className="font-semibold">Sorting Algorithms</span>"</li>
            <li>🛠️ Profile updated - <span className="text-gray-500">Yesterday</span></li>
          </ul>
        </section>
      </main>


    </div>
  );
};

const DashboardCard = ({ title, desc, to, icon }) => (
  <Link
    to={to}
    className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-200 dark:border-gray-700 flex flex-col gap-2"
  >
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">{title}</h2>
      {icon}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
  </Link>
);

export default Dashboard;
