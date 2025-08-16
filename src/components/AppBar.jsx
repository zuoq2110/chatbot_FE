import React from 'react';
import './AppBar.css';
import { FiFile, FiMessageSquare } from 'react-icons/fi';

const AppBar = ({ user, onLogout, viewMode, onSwitchMode }) => {
  return (
    <div className="app-bar">
      <div className="app-bar-content">
        <div className="logo-section">
          <img 
            src="/img/kma.png" 
            alt="KMA Logo" 
            className="logo"
          />
          <div className="title-section">
            <h1 className="main-title">Học viện Kỹ thuật Mật mã</h1>
            <p className="sub-title">Hệ thống Chatbot Hỗ trợ Sinh viên</p>
          </div>
        </div>
        
        <div className="user-section">
          <div className="mode-switcher">
            <button 
              className={`mode-btn ${viewMode === 'chat' ? 'active' : ''}`}
              onClick={() => onSwitchMode('chat')}
              title="Chat thông thường"
            >
              <FiMessageSquare /> Chat
            </button>
            <button 
              className={`mode-btn ${viewMode === 'file-chat' ? 'active' : ''}`}
              onClick={() => onSwitchMode('file-chat')}
              title="Hỏi đáp tài liệu"
            >
              <FiFile /> Tài liệu
            </button>
          </div>
          
          {user ? (
            <div className="user-info">
              <span className="welcome-text">Xin chào, {user.name}!</span>
              <button 
                className="logout-btn"
                onClick={onLogout}
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <span className="guest-text">Khách</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;