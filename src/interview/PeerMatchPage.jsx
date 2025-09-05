import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const PeerMatchPage = () => {
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    if (!name) return alert('Please enter your name');
    try {
      const response = await axios.post('https://codequestbackend.onrender.com/api/interview-rooms/create');
      const room = response.data;

      setSessionId(room.roomCode);
      setAccessCode(room.accessCode);

//       navigate(`/interviewPanel/${room.roomCode}`, {
//         state: {
//           sessionId: room.roomCode,
//           username: name,
//         },
//       });
    } catch {
      alert('Error creating room');
    }
  };

  const handleJoinSession = async () => {
    if (!name || !sessionId || !accessCodeInput) {
      alert('Please enter all fields');
      return;
    }
    try {
      await axios.post('https://codequestbackend.onrender.com/api/interview-rooms/join', null, {
        params: {
          roomCode: sessionId,
          accessCode: accessCodeInput,
          username: name,
        },
      });
      navigate(`/interviewPanel/${sessionId+accessCode}`, {
        state: {
         sessionId: sessionId+accessCode,
          username: name,
        },
      });
    } catch (err) {
      alert(err.response?.data || 'Error joining room');
    }
  };

  return (
    <div className={`w-full h-screen flex justify-center items-center transition duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-6 rounded shadow-lg w-96 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl mb-4 text-center font-semibold">Create or Join Interview Session</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
        />

        <button
          onClick={handleCreateSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 mb-3 rounded"
        >
          Create Session
        </button>

        {accessCode && (
          <p className="text-sm text-green-500 font-semibold mb-3 text-center">
            Room Created! Share this Access Code: <span className="font-bold">{accessCode}</span>
          </p>
        )}

        <hr className="border-t border-gray-400 my-4" />

        <input
          type="text"
          placeholder="Enter Session ID to join"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className={`w-full px-4 py-2 mb-3 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
        />

        <input
          type="text"
          placeholder="Enter Access Code"
          value={accessCodeInput}
          onChange={(e) => setAccessCodeInput(e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
        />

        <button
          onClick={handleJoinSession}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Join Session
        </button>
      </div>
    </div>
  );
};

export default PeerMatchPage;
