import {useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { authUtils } from '../utils/authUtils';

const baseurl = "http://localhost:9090";

const useWebSocket = (roomId, onMessage) => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = authUtils.getAuthToken();
    const userProfile = authUtils.getUserProfile();

    if (!token || !roomId || !userProfile?.userId) {
      console.warn("Missing auth token, room ID or user profile");
      return;
    }

    const socket = new SockJS(`${baseurl}/chat`);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: token,
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('🟢 STOMP connected');
        setIsConnected(true);  // 👈 set connected true here

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          try {
            const parsed = JSON.parse(message.body);
            onMessage(parsed);
          } catch (err) {
            console.error("Message parse error:", err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
      onWebSocketError: (error) => {
        console.error('⚠️ WebSocket error:', error);
        setIsConnected(false); // 👈 fallback on error
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        console.log("🔌 WebSocket disconnected");
        setIsConnected(false);  // 👈 clean up connection flag
      }
    };
  }, [roomId, onMessage]);

  const sendMessage = (content, type = "TEXT", documentIds = []) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.warn("WebSocket is not connected");
      return;
    }

    const userId = authUtils.getUserProfile().userId;

    clientRef.current.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify({
        senderId: userId,
        content,
        type,
        documentIds
      }),
      headers: {
        Authorization: authUtils.getAuthToken(),
      }
    });
  };

  return { sendMessage, isConnected }; // 👈 Now returning it
};

export default useWebSocket;
