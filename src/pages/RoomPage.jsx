import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WebSocketService from "../services/WebSocketService";
import CodeEditor from "../components/CodeEditor";
import Webcam from "react-webcam";

const RoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [roomId, setRoomId] = useState("");
  const [participant, setParticipant] = useState("");
  const [connected, setConnected] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [code, setCode] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [output, setOutput] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [participants, setParticipants] = useState([]);

  const codeRef = useRef("");
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const [username, setUsername] = useState(location?.state?.username || "Admin");
  const roomIdFromState = location?.state?.roomId || "";

  useEffect(() => {
    if (roomIdFromState) {
      setRoomId(roomIdFromState);
      setParticipant(username);
      setConnected(true);
    }
  }, [roomIdFromState, username]);

  useEffect(() => {
    if (connected && roomId && WebSocketService.stompClient?.connected) {
      WebSocketService.connect(
        roomId,
        (participantsList) => setParticipants(participantsList),
        (codeMessage) => {
          setCode(codeMessage);
          codeRef.current = codeMessage;
        },
        () => alert("WebSocket connection failed.")
      );

      WebSocketService.sendMessage(JSON.stringify({ roomId, participant, type: "join" }));

      return () => {
        WebSocketService.sendMessage(JSON.stringify({ roomId, participant, type: "leave" }));
        WebSocketService.disconnect();
      };
    }
  }, [connected, roomId, participant]);


  const handleCircleClick = () => {
    if (timerActive) return;
    const duration = parseInt(prompt("Enter timer duration (in seconds):", "300"), 10);
    if (!isNaN(duration) && duration > 0) {
      setTimer(duration);
      setTimerActive(true);
      if (intervalId) clearInterval(intervalId);
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;
    WebSocketService.sendCodeMessage(newCode);
  };

  const handleRunCode = async () => {
    const response = await fetch("https://codequestbackend.onrender.com/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    const data = await response.json();
    setOutput(data.output);
  };

  const handleSubmitCode = () => {
    if (window.confirm("Submit your code?")) {
      WebSocketService.sendMessage(
        JSON.stringify({ participant, content: codeRef.current }),
        `/app/code/${roomId}/submit`
      );
      alert("Code submitted successfully!");
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setRecordedChunks([]);
    setIsRecording(true);

    const stream = webcamRef.current.stream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(event.data));
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleDownload = () => {
    if (recordedChunks.length === 0) return;
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-green-100 dark:bg-gray-800 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-600"
            onClick={() => setShowInvite(true)}
          >
            Invite Link
          </button>
          <div className="space-x-4">
            {participants.map((p, index) => (
              <span key={index} className="text-sm text-gray-700 dark:text-gray-300">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <span
            className="cursor-pointer text-lg text-gray-700 dark:text-gray-300"
            onClick={handleCircleClick}
          >
            ⏱ {formatTime(timer)}
          </span>
          <button
            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => {
              if (window.confirm("Are you sure you want to end this session?")) {
                WebSocketService.sendMessage(
                  JSON.stringify({ roomId, participant, type: "leave" })
                );
                WebSocketService.disconnect();
                navigate("/room");
              }
            }}
          >
            ❌ End
          </button>
        </div>
      </header>

      {/* Invite Popup */}
      {showInvite && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              🔗 Invite to Room
            </h3>
            <input
              type="text"
              value={`https://code-quest-frontend-three.vercel.app/roompage/${roomId}`}
              readOnly
              className="w-full p-2 mb-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://code-quest-frontend-three.vercel.app/roompage/${roomId}`);
                alert("📋 Link copied to clipboard!");
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full mb-4"
            >
              📋 Copy Link
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full"
              onClick={() => setShowInvite(false)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="mt-6">
        <CodeEditor code={code} onCodeChange={handleCodeChange} language={language} />
      </div>
    </div>
  );
};

export default RoomPage;
