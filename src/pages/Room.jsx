import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { LogIn, PlusCircle, History } from "lucide-react";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // Fetch session history from backend
  const fetchHistoryFromBackend = async (name) => {
    try {
      const res = await axios.get(`https://codequestbackend.onrender.com/api/sessions/${name}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      toast.error("Unable to load session history.");
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUsername(storedName);
      fetchHistoryFromBackend(storedName);
    }
  }, []);

  // Save to backend
  const saveToHistory = async (roomId, name) => {
    const newSession = {
      roomId,
      username: name,
    };

    try {
      await axios.post("https://codequestbackend.onrender.com/api/sessions", newSession);
      fetchHistoryFromBackend(name);
    } catch (error) {
      console.error("Failed to save session:", error);
      toast.error("Failed to save session to backend.");
    }
  };

  const handleJoinRoom = () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error("Please enter both Room ID and your name.");
      return;
    }

    localStorage.setItem("name", username);
    saveToHistory(roomId.trim(), username.trim());
    navigate(`/roompage/${roomId}`, { state: { roomId, username } });
    toast.success("Joined Room!");
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter your name first.");
      return;
    }

    const newRoomId = Math.random().toString(36).substring(2, 10);
    localStorage.setItem("name", username.trim());
    saveToHistory(newRoomId, username.trim());

    navigate(`/roompage/${newRoomId}`, {
      state: { roomId: newRoomId, username: username.trim() },
    });

    toast.success("New Room Created!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:to-gray-800 transition-all">
      <div className="w-full max-w-2xl p-6 rounded-xl bg-white dark:bg-gray-900 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          🚀 Welcome to <span className="text-blue-600">CodeQuest</span>
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="👤 Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="🏷️ Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-4">
            <button
              onClick={handleJoinRoom}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <LogIn className="w-5 h-5" />
              Join Room
            </button>

            <button
              onClick={handleCreateRoom}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              <PlusCircle className="w-5 h-5" />
              Create Room
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-100 mb-4">
              <History className="w-5 h-5" /> Recent Rooms
            </h2>
            <ul className="space-y-3 max-h-64 overflow-auto pr-1">
              {history.map((session) => (
                <li
                  key={session.id}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white">
                      <span className="font-medium text-blue-600">
                        {session.username}
                      </span>{" "}
                      joined room{" "}
                      <span className="font-mono">{session.roomId}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/roompage/${session.roomId}`, {
                        state: {
                          roomId: session.roomId,
                          username: session.username,
                        },
                      })
                    }
                    className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-md"
                  >
                    Rejoin
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
