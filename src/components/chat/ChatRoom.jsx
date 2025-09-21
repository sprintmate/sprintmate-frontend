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

import music from '../../../public/notification.mp3';

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

  // Get current user ID
  const CURRENT_USER_ID = authUtils.getUserProfile().userId;

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
      // 3. Audio element exists
      const isMessageFromCurrentUser = message.senderId === CURRENT_USER_ID;
      
      if (isInitialFetchDone.current && !isMessageFromCurrentUser && audioRef.current) {
        // Try to play sound, handle browser restrictions
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Autoplay blocked, will play on user interaction");
            // If autoplay is blocked, try to resume on user interaction
            const resumeAudio = () => {
              audioRef.current.play();
              document.removeEventListener("click", resumeAudio);
            };
            document.addEventListener("click", resumeAudio);
          });
        }
      }
      
      const updated = [...prev, message];
      return updated.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });
  }, [CURRENT_USER_ID]); // ✅ Added CURRENT_USER_ID to dependencies

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

  // Prevent background scroll when chat is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-2xl">
      {/* Sound for new message */}
      <audio
        ref={audioRef}
        src={music}
        preload="auto"
        style={{ display: "none" }}
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
          <p className="text-sm text-gray-500">
            {isConnected ? "Connected" : "Connecting..."}
          </p>
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