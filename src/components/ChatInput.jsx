import React, { useState, useRef } from 'react';
import { FiSend, FiMic, FiMicOff, FiPaperclip } from 'react-icons/fi';
import './ChatInput.css';

const ChatInput = ({ 
  onSendMessage, 
  onVoiceInput, 
  onFileUpload,
  disabled, 
  placeholder = "Nhập tin nhắn của bạn...",
  department = null,
  onDepartmentChange = null
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(department || 'chung');
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      // Send message with department info
      onSendMessage(message, selectedDepartment);
      setMessage('');
    }
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    if (onDepartmentChange) {
      onDepartmentChange(dept);
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
      {/* Department selector */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phạm vi truy vấn:
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleDepartmentChange('chung')}
            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
              selectedDepartment === 'chung'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => handleDepartmentChange('phongdaotao')}
            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
              selectedDepartment === 'phongdaotao'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Đào tạo
          </button>
          <button
            type="button"
            onClick={() => handleDepartmentChange('phongkhaothi')}
            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
              selectedDepartment === 'phongkhaothi'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Khảo thí
          </button>
          <button
            type="button"
            onClick={() => handleDepartmentChange('khoa')}
            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
              selectedDepartment === 'khoa'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Khoa
          </button>
          <button
            type="button"
            onClick={() => handleDepartmentChange('thongtinHVKTMM')}
            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
              selectedDepartment === 'thongtinHVKTMM'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Thông tin HVKTMM
          </button>
          <button
            type="button"
            onClick={() => handleDepartmentChange('viennghiencuuvahoptacphattrien')}
            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
              selectedDepartment === 'viennghiencuuvahoptacphattrien'
                ? 'bg-cyan-500 text-white border-cyan-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Viện NC & HT PT
          </button>
        </div>
      </div>

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
