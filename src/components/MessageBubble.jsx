// Option 1: Update MessageBubble to use 'text' instead of 'content'
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FiUser, FiMessageCircle, FiAlertCircle } from 'react-icons/fi';
import { MESSAGE_SENDERS } from '../utils/constants';
import RateLimitMessage from './RateLimitMessage';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === MESSAGE_SENDERS.USER || message.sender === 'user';
  const isError = message.isError || message.sender === 'error';
  const isRateLimit = message.isRateLimit === true;

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get the message text - handle both 'text' and 'content' properties
  const messageText = message.text || message.content || '';

  console.log('MessageBubble rendering:', { message, messageText, isUser, isError, isRateLimit }); // DEBUG

  // This function is no longer needed since we're not showing stats
  // const handleViewStats = () => {
  //   // Dispatch an event that App.jsx can listen for to show the usage stats
  //   const event = new CustomEvent('showRateLimitStats');
  //   window.dispatchEvent(event);
  // };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`flex max-w-xs lg:max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500' 
            : isError 
              ? 'bg-red-500' 
              : 'bg-gradient-to-r from-green-400 to-blue-500'
        }`}>
          {isUser ? (
            <FiUser className="w-4 h-4 text-white" />
          ) : isError ? (
            <FiAlertCircle className="w-4 h-4 text-white" />
          ) : (
            <FiMessageCircle className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : isError 
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
        }`}>
          {/* Rate limit message special handling */}
          {isRateLimit ? (
            <RateLimitMessage 
              message={messageText}
            />
          ) : (
            <div className="text-sm leading-relaxed">
              {isUser ? (
                <p>{messageText}</p>
              ) : (
                <ReactMarkdown
                  className="prose prose-sm max-w-none"
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {messageText}
                </ReactMarkdown>
              )}
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>

          {/* Metadata */}
          {message.metadata && !isRateLimit && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {message.metadata.source && (
                  <div>Nguồn: {message.metadata.source}</div>
                )}
                {message.metadata.sources && message.metadata.sources.length > 0 && (
                  <div className="mt-1">
                    <div className="font-medium mb-1">Trích dẫn từ tài liệu:</div>
                    {message.metadata.sources.map((source, index) => (
                      <div key={index} className="p-1 bg-gray-50 rounded mb-1 text-xs">
                        {source.substring(0, 150)}...
                      </div>
                    ))}
                  </div>
                )}
                {message.metadata.confidence && (
                  <div>Độ tin cậy: {(message.metadata.confidence * 100).toFixed(1)}%</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;