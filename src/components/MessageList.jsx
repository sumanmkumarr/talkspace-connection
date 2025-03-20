
import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSentByCurrentUser = msg.userId === currentUser;
            const isConsecutive = index > 0 && messages[index - 1].userId === msg.userId;
            
            return (
              <div 
                key={index} 
                className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-3'}`}
              >
                <div 
                  className={`
                    ${isSentByCurrentUser ? 'message-sent animate-slide-in-right' : 'message-received animate-fade-in-up'} 
                    ${isConsecutive ? 'mb-0' : 'mb-1'}
                  `}
                >
                  {!isSentByCurrentUser && !isConsecutive && (
                    <div className="text-xs font-medium text-gray-600 mb-1">{msg.username}</div>
                  )}
                  <div>{msg.text}</div>
                  <div className={`text-xs ${isSentByCurrentUser ? 'text-blue-100' : 'text-gray-500'} text-right mt-1`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
