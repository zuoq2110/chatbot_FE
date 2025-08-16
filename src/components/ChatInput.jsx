import React, { useState, useRef } from 'react';
import { FiSend, FiMic, FiMicOff, FiPaperclip } from 'react-icons/fi';
import './ChatInput.css';

const ChatInput = ({ 
  onSendMessage, 
  onVoiceInput, 
  onFileUpload,
  disabled, 
  placeholder = "Nhập tin nhắn của bạn..." 
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Voice recognition functionality
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'vi-VN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      if (onVoiceInput) {
        onVoiceInput(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview or notification that file is selected
      setMessage(`File đã chọn: ${file.name}`);
      
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows="1"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              lineHeight: '1.5',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          
          {/* Voice input button */}
          <button
            type="button"
            onClick={handleVoiceClick}
            disabled={disabled}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Dừng thu âm' : 'Nhấn để nói'}
          >
            {isListening ? (
              <FiMicOff className="w-4 h-4" />
            ) : (
              <FiMic className="w-4 h-4" />
            )}
          </button>
        </div>
        
       

        {/* Send button */}
        <button 
          type="submit" 
          disabled={!message.trim() || disabled}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Gửi tin nhắn"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>
      
      {/* Voice recognition status */}
      {isListening && (
        <div className="mt-2 flex items-center justify-center text-sm text-red-600">
          <div className="animate-pulse mr-2">🔴</div>
          Đang nghe...
        </div>
      )}
    </div>
  );
};

export default ChatInput;
