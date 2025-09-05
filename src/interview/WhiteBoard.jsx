import React, { useRef, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  FaPencilAlt,
  FaEraser,
  FaFont,
  FaUndo,
  FaRedo,
  FaTrash,
  FaSquare,
  FaCircle,
  FaSlash,
} from "react-icons/fa";

const WhiteBoard = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const inputRef = useRef(null);

  const [tool, setTool] = useState("pen");
  const [lineWidth, setLineWidth] = useState(4);
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [inputPos, setInputPos] = useState(null);
  const [socket, setSocket] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    clearCanvas();

    const client = new Client({
      webSocketFactory: () => new SockJS("https://codequestbackend.onrender.com/whiteboard"),
      onConnect: () => {
        client.subscribe("/topic/drawing", (message) => {
            console.log("whiteboard connection succesfully");
          const data = JSON.parse(message.body);
          drawRemote(data);
        });
      },

      onWebSocketError: (e) => console.error("WebSocket error", e),
    });

    client.activate();
    setSocket(client);

    return () => client.deactivate();
  }, []);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const drawRemote = ({ type, x0, y0, x1, y1, color, tool, lineWidth }) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    if (tool === "line") {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    } else if (tool === "rectangle") {
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    } else if (tool === "circle") {
      const radius = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
      ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();
    ctx.closePath();
  };

  const sendDrawData = (type, x0, y0, x1, y1) => {
    if (socket && socket.connected) {
      socket.publish({
        destination: "/app/drawing",
        body: JSON.stringify({ type, x0, y0, x1, y1, color, tool, lineWidth }),
      });
     console.log("white board data send successfully");
    }
  };

  const startDrawing = (e) => {
    const { x, y } = getMousePos(e);
    if (tool === "text") {
      setInputPos({ x, y });
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (["rectangle", "circle", "line"].includes(tool)) {
      setStartPoint({ x, y });
      setIsDrawing(true);
    } else {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
      ctxRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctxRef.current.lineWidth = lineWidth;
      ctxRef.current.__lastX = x;
      ctxRef.current.__lastY = y;
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing || tool === "text") return;
    const { x, y } = getMousePos(e);
    const ctx = ctxRef.current;

    if (["rectangle", "circle", "line"].includes(tool)) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    sendDrawData("free", ctx.__lastX, ctx.__lastY, x, y);
    ctx.__lastX = x;
    ctx.__lastY = y;
  };

  const finishDrawing = (e) => {
    if (!isDrawing || tool === "text") return;
    const { x, y } = getMousePos(e);
    const ctx = ctxRef.current;

    if (tool === "rectangle") {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
      sendDrawData("rectangle", startPoint.x, startPoint.y, x, y);
    } else if (tool === "circle") {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      const radius = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
      sendDrawData("circle", startPoint.x, startPoint.y, x, y);
    } else if (tool === "line") {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
      sendDrawData("line", startPoint.x, startPoint.y, x, y);
    }

    setIsDrawing(false);
    setStartPoint(null);
    saveToHistory();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const text = e.target.elements.textInput.value;
    if (!text.trim()) return;

    const ctx = ctxRef.current;
    ctx.font = `${lineWidth * 4}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, inputPos.x, inputPos.y);
    setInputPos(null);
    saveToHistory();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const saveToHistory = () => {
    const dataUrl = canvasRef.current.toDataURL();
    setHistory((prev) => [...prev, dataUrl]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    setRedoStack((prev) => [...prev, last]);
    setHistory((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    setHistory((prev) => [...prev, last]);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-200 dark:bg-gray-800 border-b">
        <ToolButton icon={<FaPencilAlt />} tool="pen" current={tool} setTool={setTool} />
        <ToolButton icon={<FaEraser />} tool="eraser" current={tool} setTool={setTool} />
        <ToolButton icon={<FaFont />} tool="text" current={tool} setTool={setTool} />
        <ToolButton icon={<FaSquare />} tool="rectangle" current={tool} setTool={setTool} />
        <ToolButton icon={<FaCircle />} tool="circle" current={tool} setTool={setTool} />
        <ToolButton icon={<FaSlash />} tool="line" current={tool} setTool={setTool} />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded border"
        />
        <select
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
            <option key={w} value={w}>Width {w}</option>
          ))}
        </select>
        <button onClick={undo} className="p-2 rounded bg-white dark:bg-gray-700"><FaUndo /></button>
        <button onClick={redo} className="p-2 rounded bg-white dark:bg-gray-700"><FaRedo /></button>
        <button onClick={clearCanvas} className="p-2 rounded bg-white dark:bg-gray-700"><FaTrash /></button>
      </div>

      <div className="relative flex-grow">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          className="w-full h-full bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm"
        />

        {tool === "text" && inputPos && (
          <form
            onSubmit={handleTextSubmit}
            className="absolute z-10"
            style={{ top: inputPos.y, left: inputPos.x }}
          >
            <input
              ref={inputRef}
              name="textInput"
              className="border px-2 py-1 text-sm rounded shadow"
              placeholder="Type..."
              onBlur={() => setInputPos(null)}
            />
          </form>
        )}
      </div>
    </div>
  );
};

const ToolButton = ({ icon, tool, current, setTool }) => (
  <button
    onClick={() => setTool(tool)}
    className={`p-2 rounded ${tool === current ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-700 dark:text-white"}`}
    title={tool}
  >
    {icon}
  </button>
);

export default WhiteBoard;
