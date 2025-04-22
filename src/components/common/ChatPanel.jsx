import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, X, Phone, Video, MoreVertical, 
  Paperclip, Smile, Image, ChevronDown
} from 'lucide-react';

// Import default avatar image
import image3 from "../../assets/image3.webp";

// Chat message component
const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg py-2 px-4 max-w-[75%] ${
        isOwn 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>
    </div> 
  );
};

// Chat panel component
const ChatPanel = ({ user, isOpen, onClose, apiBaseUrl, initialMessages = [] }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [
    { id: 1, content: "Hello, thanks for connecting!", timestamp: new Date(), sender: 'me' },
    { id: 2, content: "Hi there! How can I help you today?", timestamp: new Date(Date.now() - 50000), sender: 'user' },
  ]);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        content: message,
        timestamp: new Date(),
        sender: 'me'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate a reply after a delay (for demo purposes)
      // In a real app, you would integrate with your chat API here
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          content: "Thanks for your message! I'll get back to you shortly.",
          timestamp: new Date(),
          sender: 'user'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };
  
  return (
    <>
      {/* Chat panel overlay background when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={onClose}
        ></div>
      )}
      
      {/* Main chat panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Chat header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
              <div className="relative">
                <img 
                  src={user?.profilePicture || user?.portfolio?.PROFILE_PIC ? 
                    `${apiBaseUrl}/v1/files/${user.portfolio?.PROFILE_PIC}` : image3} 
                  alt={user?.name || "User"} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{user?.name || "User"}</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-blue-100 text-blue-600">
                <Phone size={16} />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-100 text-blue-600">
                <Video size={16} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          
          {/* Conversation summary */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <span className="text-blue-600 font-medium">Project:</span> {user?.project?.title || user?.task?.title || "Discussion"}
              </div>
              <button className="text-xs text-blue-600 flex items-center">
                Details <ChevronDown size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto h-[calc(100vh-180px)] bg-white">
          <div className="space-y-2">
            {/* Date divider */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-200 h-px flex-grow"></div>
              <div className="mx-4 text-xs text-gray-500">Today</div>
              <div className="bg-gray-200 h-px flex-grow"></div>
            </div>
            
            {/* Messages */}
            {messages.map(msg => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                isOwn={msg.sender === 'me'} 
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
              <Paperclip size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
              <Image size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
              <Smile size={18} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className={`p-2 rounded-full ${message.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPanel;
