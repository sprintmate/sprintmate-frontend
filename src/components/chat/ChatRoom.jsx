import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, ChevronLeft } from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { authUtils } from "../../utils/authUtils";
import useWebSocket from "../../services/websocketService";

import music from '/notification.mp3';

const PAGE_SIZE = 300; // ✅ Configurable initial fetch count

const ChatRoom = ({ room, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const scrollToBottomRef = useRef(null);
  const isInitialFetchDone = useRef(false);
  const prevMessagesLength = useRef(0);
  const audioRef = useRef(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Get current user ID
  const CURRENT_USER_ID = authUtils.getUserProfile().userId;

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(() => {
    if (audioRef.current && !audioInitialized) {
      // Set volume to a reasonable level
      audioRef.current.volume = 0.7;
      
      // Try to play and immediately pause to initialize audio context
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setAudioInitialized(true);
            console.log('Audio initialized successfully');
          })
          .catch((error) => {
            console.log('Audio initialization failed:', error);
            // Try alternative approach - just set the flag if audio element exists
            if (audioRef.current) {
              setAudioInitialized(true);
              console.log('Audio marked as initialized despite play failure');
            }
          });
      }
    }
  }, [audioInitialized]);

  const fetchMessages = useCallback(async () => {
    if (!room) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${
          room.taskId
        }/applications/${room.applicationId}/communications/messages`,
        {
          headers: { Authorization: authUtils.getAuthToken() },
          params: { page: 0, size: PAGE_SIZE },
        }
      );

      const fetched = response.data.content || [];
      // Assuming backend sends latest first, we reverse to show oldest first (bottom scroll)
      setMessages(fetched.slice().reverse());
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
    }
  }, [room]);

  // Play sound only when chat is open and a new message arrives from OTHER users (not sender)
  const handleNewMessage = useCallback((message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.externalId === message.externalId);
      if (exists) return prev;
      
      // ✅ Only play sound if:
      // 1. Not initial fetch
      // 2. Message is NOT from current user (sender)
      // 3. Audio element exists and is initialized
      const isMessageFromCurrentUser = message.senderId === CURRENT_USER_ID;
      
      if (isInitialFetchDone.current && !isMessageFromCurrentUser && audioRef.current && audioInitialized) {
        console.log('Playing notification sound for new message');
        // Try to play sound
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Notification sound played successfully');
            })
            .catch((error) => {
              console.log('Failed to play notification sound:', error);
              // Reset audio to beginning for next attempt
              audioRef.current.currentTime = 0;
            });
        }
      } else if (isInitialFetchDone.current && !isMessageFromCurrentUser && !audioInitialized) {
        console.log('Audio not initialized, cannot play notification sound');
      }
      
      const updated = [...prev, message];
      return updated.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });
  }, [CURRENT_USER_ID, audioInitialized]); // ✅ Added audioInitialized to dependencies

  const scrollToBottom = () => {
    scrollToBottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const { sendMessage, isConnected } = useWebSocket(
    room?.externalId,
    handleNewMessage
  );

  useEffect(() => {
    setIsWebSocketConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (!room || isInitialFetchDone.current) return;

    setMessages([]);
    isInitialFetchDone.current = true;

    fetchMessages();
  }, [room, fetchMessages]);

  useEffect(() => {
    isInitialFetchDone.current = false;
  }, [room]);

  useEffect(() => {
    // Only scroll to bottom if a new message is added (not on initial fetch)
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;
    sendMessage(newMessage.trim());
    setNewMessage("");
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = format(parseISO(message.createdAt), "yyyy-MM-dd");
    groups[dateKey] = groups[dateKey] || [];
    groups[dateKey].push(message);
    return groups;
  }, {});

  const formatMessageDate = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  // Prevent background scroll when chat is open and initialize audio on user interaction
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Add event listeners for audio initialization on user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [initializeAudio]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-2xl">
      {/* Sound for new message */}
      <audio
        ref={audioRef}
        src={music}
        preload="auto"
        loop={false}
        volume={0.7}
        style={{ display: "none" }}
        onError={(e) => {
          console.error('Audio loading error:', e);
        }}
        onLoadStart={() => {
          console.log('Audio loading started');
        }}
        onCanPlay={() => {
          console.log('Audio can play');
        }}
      />

      {/* Header */}
      <div className="bg-white/80 border-b px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-lg">{room?.name}</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              {isConnected ? "Connected" : "Connecting..."}
            </p>
            {!audioInitialized && (
              <button
                onClick={initializeAudio}
                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                title="Click to enable notification sounds"
              >
                🔇 Enable Sounds
              </button>
            )}
            {audioInitialized && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  🔊 Sounds On
                </span>
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      audioRef.current.play().catch(console.error);
                    }
                  }}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  title="Test notification sound"
                >
                  🔔 Test
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 px-2 sm:px-6 py-4 space-y-6"
        style={{
          overflowY: "auto",
          scrollBehavior: "smooth",
          minHeight: 0,
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <AnimatePresence>
            <div>
              {Object.entries(groupedMessages).map(([date, messagesOnDate]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center mb-2">
                    <span className="text-xs font-semibold text-gray-600 bg-blue-100 px-3 py-1 rounded-full shadow">
                      {formatMessageDate(date)}
                    </span>
                  </div>
                  {messagesOnDate.map((message, index) => {
                    const isOwn = message.senderId === CURRENT_USER_ID;
                    return (
                      <motion.div
                        key={message.externalId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-end gap-2 ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Avatar placeholder */}
                        {!isOwn && (
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold shadow">
                            {message.senderName
                              ? message.senderName[0].toUpperCase()
                              : "U"}
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md transition-all duration-200 border ${
                            isOwn
                              ? "bg-blue-500 text-white border-blue-400"
                              : "bg-white text-gray-900 border-gray-200"
                          }`}
                        >
                          <div className="text-sm whitespace-pre-line break-words">
                            {message.content}
                          </div>
                          <div
                            className={`text-xs mt-1 flex justify-end ${
                              isOwn ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {format(parseISO(message.createdAt), "h:mm a")}
                          </div>
                        </div>
                        {isOwn && (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow">
                            You
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              ))}
              <div ref={scrollToBottomRef} />
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Message Input - sticky bottom */}
      <div className="bg-white/90 border-t px-4 py-3 shadow-lg sticky bottom-0 z-20 backdrop-blur-md">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!isWebSocketConnected}
            className="flex-1 text-base px-4 py-2 rounded-xl border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            style={{ minHeight: "44px" }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isWebSocketConnected}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl px-4 py-2 flex items-center gap-1 shadow"
          >
            <Send size={20} />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;