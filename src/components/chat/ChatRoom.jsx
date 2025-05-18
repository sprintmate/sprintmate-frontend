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

const PAGE_SIZE = 50;

const ChatRoom = ({ room, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const scrollToBottomRef = useRef(null); 


  const loaderRef = useRef(null);
  const fetchedPagesRef = useRef(new Set());
  const isInitialFetchDone = useRef(false);
  const observerRef = useRef(null);

  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = format(parseISO(message.createdAt), "yyyy-MM-dd");
    groups[dateKey] = groups[dateKey] || [];
    groups[dateKey].push(message);
    return groups;
  }, {});

  const fetchMessages = useCallback(async () => {
    if (!room || isLoading || fetchedPagesRef.current.has(page)) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${room.taskId}/applications/${room.applicationId}/communications/messages`,
        {
          headers: {
            Authorization: authUtils.getAuthToken(),
          },
          params: {
            page,
            size: PAGE_SIZE,
          },
        }
      );

      const newMessages = response.data.content || [];
      const uniqueMessages = newMessages.filter(
        (msg) => !messages.find((m) => m.externalId === msg.externalId)
      );

      setMessages((prev) => [...prev, ...uniqueMessages]);
      setHasMore(!response.data.last);
      fetchedPagesRef.current.add(page);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, room, isLoading, messages]);

  const handleNewMessage = useCallback((message) => {
    setMessages((prev) =>
      prev.some((m) => m.externalId === message.externalId)
        ? prev
        : [...prev, message]
    );
  }, []);

  const scrollToBottom = () => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };


  const { sendMessage, isConnected } = useWebSocket(room?.externalId, handleNewMessage);

  useEffect(() => {
    setIsWebSocketConnected(isConnected);
    console.log('is connected on useeffetc', isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (!room) return;
    setMessages([]);
    setPage(0);
    setHasMore(true);
    fetchedPagesRef.current.clear();
    isInitialFetchDone.current = false;
  }, [room]);

  useEffect(() => {
    if (!isInitialFetchDone.current && room) {
      isInitialFetchDone.current = true;
      fetchMessages();
    }
  }, [fetchMessages, room]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMessages();
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) observerRef.current.observe(loaderRef.current);
    return () => observerRef.current?.disconnect();
  }, [fetchMessages, hasMore]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(); // smooth scroll
    }
  }, [messages]);

  const handleSendMessage = () => {
    console.log('sending message ', newMessage);
    if (!newMessage.trim() || !isConnected) return;
    sendMessage(newMessage.trim());
    setNewMessage("");
  };

  const formatMessageDate = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const CURRENT_USER_ID = authUtils.getUserProfile().userId;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <ChevronLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{room?.name}</h2>
          <p className="text-sm text-gray-500">{isConnected ? "Connected" : "Connecting..."}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {isLoading && page === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {hasMore && (
              <div ref={loaderRef} className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}

            <AnimatePresence>
              <div className="chat-scroll-container">
                {Object.entries(groupedMessages).map(([date, messagesOnDate]) => (
                  <motion.div key={date} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-center">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {formatMessageDate(date)}
                      </span>
                    </div>
                    {messagesOnDate.map((message, index) => {
                      const isOwn = message.senderId === authUtils.getUserProfile().userId;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn ? "bg-blue-500 text-white" : "bg-white text-gray-900"}`}>
                            <div className="text-sm">{message.content}</div>
                            <div className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                              {format(parseISO(message.createdAt), "h:mm a")}
                            </div>
                          </div>
                        </motion.div>

                      );
                    })}
                  </motion.div>
                ))}
                <div ref={scrollToBottomRef} />
              </div>

            </AnimatePresence>
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!isWebSocketConnected}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !isWebSocketConnected} className="bg-blue-500 hover:bg-blue-600">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
