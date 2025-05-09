import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, Clock, ChevronRight, Search } from "lucide-react";
import { getAllRooms } from "../../api/chatService";
import { authUtils } from "../../utils/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ChatRoom from "./ChatRoom";
import { UserRole } from "../../constants/Role";
import { getBaseRedirectionPath } from "../../utils/applicationUtils";

const PAGE_SIZE = 10;

export const getChatRedirectionPath = (taskId, applicationId) => {
  const baseRedirection = getBaseRedirectionPath();
  console.log('base redirection path is this ', baseRedirection);
  const url = `${baseRedirection}/chat/${taskId}/${applicationId}`
  console.log('url to redirect {} ', url)
  return url;
}

const Rooms = ({ taskId, applicationId, token }) => {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const loaderRef = useRef(null);
  const isLoadingRef = useRef(false);
  const navigate = useNavigate();

  const fetchRooms = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const dataParams = {
        headers: {
          Authorization: authUtils.getAuthToken(),
        },
        params: {
          page,
          size: PAGE_SIZE,
          search: searchTerm.trim(),
        },
      };
      const res = await getAllRooms(dataParams);
      const newRooms = res.data.content || [];
      setRooms((prev) => [...prev, ...newRooms]);
      setHasMore(!res.data.last);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [page, taskId, applicationId, token, hasMore, searchTerm]);

  useEffect(() => {
    setRooms([]);
    setPage(0);
    setHasMore(true);
    fetchRooms();
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRooms();
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => loaderRef.current && observer.unobserve(loaderRef.current);
  }, [fetchRooms, hasMore]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
  };

  if (selectedRoom) {
    const url = getChatRedirectionPath(selectedRoom.taskId, selectedRoom.applicationId);
    console.log('selected room is this ', selectedRoom)
    navigate(url);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-[1500px] mx-auto">
      {/* Hero Section */}
      <motion.div
        className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
              Chat Rooms
              <motion.div
                className="ml-3 inline-flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="bg-white/20 backdrop-blur-sm text-xs rounded-full py-1 px-2 flex items-center gap-1 font-normal">
                  <MessageSquare size={12} className="text-yellow-300" />
                  <span>Total: {rooms.length}</span>
                </span>
              </motion.div>
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
              Connect and collaborate with your team members
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search Section */}
      <Card className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/60 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {rooms.map((room, index) => (
            <motion.div
              key={room.externalId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="overflow-hidden backdrop-blur-sm border-blue-100/50 hover:border-blue-200/70 transition-all duration-300 cursor-pointer"
                onClick={() => handleRoomClick(room)}
              >
                <CardContent className="relative p-4 sm:p-5">
                  {/* Status indicator line */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="flex flex-col gap-3 pl-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <MessageSquare size={16} className="text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">{room.name}</h3>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users size={14} />
                      <span>{room.participants?.length || 0} participants</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>
                          {room.lastMessageAt
                            ? formatDistanceToNow(new Date(room.lastMessageAt), { addSuffix: true })
                            : 'No messages yet'}
                        </span>
                      </div>
                      {room.unreadCount > 0 && (
                        <Badge variant="blue" className="bg-blue-100 text-blue-700">
                          {room.unreadCount} new
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading and No More States */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {hasMore && !isLoading && (
        <div ref={loaderRef} className="text-center py-4 text-gray-500">
          Loading more...
        </div>
      )}

      {!hasMore && rooms.length > 0 && (
        <div className="text-center text-sm text-gray-400 mt-4">
          No more rooms to load
        </div>
      )}

      {!isLoading && rooms.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <MessageSquare size={24} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chat rooms found</h3>
          <p className="text-gray-500">Start a new conversation to connect with others</p>
        </div>
      )}
    </div>
  );
};

export default Rooms;
