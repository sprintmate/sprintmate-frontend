import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getOrCreateRoom } from '../../api/chatService';
import ChatRoom from './ChatRoom';

const ChatRoomWrapper = () => {
  const { taskId, applicationId } = useParams(); // Extract both taskId and applicationId from the URL
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getOrCreateRoom(taskId,applicationId);
        console.log('response getOrCreateRoom', res);
        setRoom(res); 
      } catch (err) {
        console.error('Failed to fetch room', err);
        navigate(-1);
      }
    };
    fetchRoom();
  }, [taskId, applicationId, navigate]);

  if (!room) return <div>Loading...</div>;

  const handleCloseChat = () => {
    navigate(-1);
  };

  return <ChatRoom room={room} onClose={handleCloseChat} />;
};

export default ChatRoomWrapper;