import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const socket = io("https://your-backend-url.com");

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    socket.on("image-response", (data) => {
      if (data.status === "success") {
        setImage(data.image);
        setLoading(false);
      }
    });
    return () => socket.off("image-response");
  }, []);

  const generateImage = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setProgress(0);
    socket.emit("request-image", prompt);
    
    let progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return oldProgress + 10;
      });
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <button className="absolute top-5 right-5 p-2 bg-gray-700 text-white rounded" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <h1 className="text-3xl font-bold mb-4">AI Image Generator</h1>
      <input
        type="text"
        className="p-2 border rounded w-96 text-black"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateImage}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {loading && (
        <div className="w-96 h-2 bg-gray-300 rounded mt-4">
          <motion.div
            className="h-full bg-blue-600 rounded"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
      {image && <img src={image} alt="Generated" className="mt-6 rounded shadow-lg" />}
    </div>
  );
}
