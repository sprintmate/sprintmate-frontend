import React from 'react';
import { MessageSquare } from 'lucide-react';

const ApplicationChat = ({ application, onSendMessage, ...props }) => {
  // Function to check if chat is available for the current application
  const isChatAvailable = () => {
    const allowedStatuses = [
      'SHORTLISTED',
      'ACCEPTED',
      'IN_PROGRESS',
      'COMPLETED',
      'SUBMITTED'
    ];
    
    // Ensure case-insensitive comparison
    const applicationStatus = application?.status?.toUpperCase();
    return allowedStatuses.includes(applicationStatus);
  };
  
  // Handler for sending a message
  const handleSendMessage = (message) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };
  
  return (
    <div className="chat-container">
      {isChatAvailable() ? (
        <div>
          {/* Chat UI components go here */}
          <p>Chat is available for this application.</p>
          {/* Example message sending button */}
          <button onClick={() => handleSendMessage("Hello")}>Send Message</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <MessageSquare className="text-gray-400 mb-3 h-12 w-12" />
          <h3 className="text-lg font-medium text-gray-700">Chat Unavailable</h3>
          <p className="text-gray-500 mt-2">
            Chat is only available for applications that are shortlisted, accepted, 
            in progress, completed, or submitted.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationChat;