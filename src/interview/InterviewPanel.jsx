import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaUsers,
  FaLink,
  FaClock,
  FaSignOutAlt,
  FaUserCircle,
  FaFileAlt,
  FaDownload,
} from 'react-icons/fa';
import CodeEditor from '../components/CodeEditor';
import WhiteBoard from '../interview/WhiteBoard';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const InterviewPanel = () => {
  const navigate = useNavigate();
  const [showWhiteBoard, setShowWhiteBoard] = useState(false);
  const [code, setCode] = useState('// Start coding here...');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const [joinedSession, setJoinedSession] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [interviewerName, setInterviewerName] = useState('');

  const [videoEnabled1, setVideoEnabled1] = useState(true);
  const [audioEnabled1, setAudioEnabled1] = useState(true);

  const webcamRef1 = useRef(null);
  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);
  const location = useLocation();
  const sessionIdFromState = location?.state?.sessionId || '';
  let firstHalfSessionId = '';
  let secondHalfSessionId = '';
  if (sessionIdFromState.length === 14) { // Specifically handle length 14 for 8/6 split
  firstHalfSessionId = sessionIdFromState.substring(0, 8); // Take the first 8 characters
  secondHalfSessionId = sessionIdFromState.substring(8); 
  }else{
    console.log("session id lenfth is:"+sessionIdFromState.length);
  }

  useEffect(() => {
    if (sessionIdFromState) {
      setSessionId(sessionIdFromState);
      setJoinedSession(true);
    }
  }, [sessionIdFromState]);

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setInterviewerName(storedName);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => {
      toast.error('Please allow camera and microphone access');
    });
  }, []);

  useEffect(() => {
    const webcam = webcamRef1.current;
    if (webcam && webcam.video && webcam.video.srcObject) {
      const stream = webcam.video.srcObject;
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) videoTrack.enabled = videoEnabled1;
      if (audioTrack) audioTrack.enabled = audioEnabled1;
    }
  }, [videoEnabled1, audioEnabled1]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (joinedSession && sessionId) {
      connectWebSocket();
      fetchUploadedFiles();
      fetchParticipants();
    }
    return () => disconnectWebSocket();
  }, [joinedSession, sessionId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const connectWebSocket = () => {
    const socket = new SockJS('https://codequestbackend.onrender.com/ws');
    stompClient.current = over(socket);
    stompClient.current.connect(
      {},
      () => {
        stompClient.current.subscribe(`/topic/code/${sessionId}`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            setChatMessages((prev) => [...prev, msg]);
          }
        });
      },
      (err) => {
        console.error('WebSocket connection error:', err);
      }
    );
  };

  const disconnectWebSocket = () => {
    if (stompClient.current?.connected) {
      stompClient.current.disconnect(() => {
        console.log('Disconnected WebSocket');
      });
    }
  };

  const sendMessage = () => {
    if (chatInput.trim() && stompClient.current?.connected && sessionId) {
      const message = {
        from: interviewerName || 'User',
        content: chatInput.trim(),
      };
      stompClient.current.send(`/app/code/${sessionId}`, {}, JSON.stringify(message));
      setChatInput('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);

    try {
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) fetchUploadedFiles();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await fetch(`/api/files/list?sessionId=${sessionId}`);
      if (res.ok) setUploadedFiles(await res.json());
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`https://codequestbackend.onrender.com/api/interview-rooms/${firstHalfSessionId}/participants`);
      if (response.data) {
        setParticipants(response.data);
      }
      console.log(participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Failed to fetch participants.');
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const endSession = () => {
    if (window.confirm('Are you sure you want to end the session?')) {
      disconnectWebSocket();
      toast.info('Session ended', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/InterviewTypes');
    }
  };

  const toggleParticipantsList = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
  };

  const handleCopyLink = () => {
    // Construct the full link that someone would use to join
    const joinURL = `${window.location.origin}/peer-match`; // Assuming a join page
    const copyText = `Join the Interview:\nLink: ${joinURL}\nRoom ID: ${firstHalfSessionId}\nAccess Code: ${secondHalfSessionId}`;

    navigator.clipboard.writeText(copyText)
      .then(() => {
        toast.success('Meeting details copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        toast.error('Failed to copy link. Please copy manually.');
      });
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-blue-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Participants Button */}
          <div className="relative">
            <button
              onClick={toggleParticipantsList}
              className="flex items-center space-x-2 text-blue-500 dark:text-blue-400 focus:outline-none"
            >
              <FaUsers className="h-5 w-5" />
              <span className="font-semibold">{participants.length}</span>
            </button>
            {isParticipantsOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-700 shadow-md rounded-md overflow-hidden z-10">
                <h5 className="p-2 font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-600">
                  Participants
                </h5>
                <ul className="max-h-40 overflow-y-auto p-2">
                  {participants.map((participant, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 py-1 text-gray-700 dark:text-gray-300"
                    >
                      <FaUserCircle className="h-4 w-4" />
                      <span>{participant || 'Guest'}</span>
                    </li>
                  ))}
                  {participants.length === 0 && (
                    <li className="py-1 text-gray-500 dark:text-gray-400 text-center">
                      No participants yet.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{formatTime(seconds)}</span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="ml-2 text-gray-600 dark:text-gray-300 focus:outline-none"
              title={isRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isRunning ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Copy Link */}
          {sessionId && (
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md focus:outline-none transition-colors duration-200 text-sm"
              title="Copy Meeting Details"
            >
              <FaLink className="h-4 w-4" />
              <span>Copy Invite</span>
            </button>
          )}
        </div>

        {/* End Session Button */}
        <button
          onClick={endSession}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none flex items-center space-x-2"
        >
          <FaSignOutAlt className="h-3 w-3" />
          <span>End Session</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex lg:flex-row p-4">
        {/* Left Panel */}
        <div className="w-full lg:w-2/3 p-6 flex flex-col shadow-lg rounded-lg m-4 lg:ml-0 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
              {showWhiteBoard ? '🎨 Interactive Whiteboard' : '💻 Collaborative Code Editor'}
            </h2>
            <button
              onClick={() => setShowWhiteBoard(!showWhiteBoard)}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {showWhiteBoard ? 'Code Editor' : 'Whiteboard'}
            </button>
          </div>
          <div className="flex-grow border rounded-md shadow-md overflow-hidden bg-gray-50 dark:bg-gray-700">
            {showWhiteBoard ? <WhiteBoard /> : <CodeEditor code={code} onChange={setCode} />}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/3 p-6 flex flex-col space-y-5 overflow-y-auto bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg m-4 lg:mr-0">
          {/* Webcam */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 text-center">
            <div className="relative w-full h-48 overflow-hidden rounded-md shadow-inner">
              <Webcam
                ref={webcamRef1}
                audio={audioEnabled1}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 flex justify-center space-x-3">
              <button
                onClick={() => setVideoEnabled1((prev) => !prev)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                {videoEnabled1 ? <FaVideo className="h-5 w-5" /> : <FaVideoSlash className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setAudioEnabled1((prev) => !prev)}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                {audioEnabled1 ? (
                  <FaMicrophone className="h-5 w-5" />
                ) : (
                  <FaMicrophoneSlash className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Chat */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 flex-grow flex flex-col">
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">Chat</h4>
            <div
              className="flex-grow overflow-y-auto border rounded-md p-3 mb-3 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
              ref={chatBoxRef}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    msg.from === interviewerName ? 'text-right text-indigo-500' : 'text-left text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="inline-block bg-indigo-100 dark:bg-indigo-900 px-3 py-2 rounded-md">
                    <strong className="font-semibold">{msg.from}</strong>: {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-grow px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </div>
          </div>

          {/* Files */}
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm p-4">
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center space-x-2">
              <FaFileAlt className="h-5 w-5" />
              <span>Shared Files</span>
            </h4>
            <input
              type="file"
              onChange={handleFileUpload}
              className="mb-3 w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600"
            />
            <ul className="max-h-32 overflow-y-auto list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
              {uploadedFiles.map((file, idx) => (
                <li key={idx} className="hover:underline hover:text-blue-500 flex items-center space-x-2">
                  <a
                    href={`/api/files/download/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-400"
                  >
                    {file.originalFileName}
                  </a>
                  <a
                    href={`/api/files/download/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-500"
                    title={`Download ${file.originalFileName}`}
                  >
                    <FaDownload className="h-4 w-4" />
                  </a>
                </li>
              ))}
              {uploadedFiles.length === 0 && (
                <li className="text-gray-500 dark:text-gray-400">No files shared yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPanel;
