import { useEffect, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL


export const useChatSocket = (roomId, onMessage) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;

        const ws = new WebSocket(`ws://localhost:9090/chat?roomId=${roomId}`);
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            onMessage(data);
        };

        socketRef.current = ws;

        return () => ws.close();
    }, [roomId]);

    const sendMessage = (content, type = 'TEXT') => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ content, eventType: type }));
        }
    };

    return { sendMessage };
};
