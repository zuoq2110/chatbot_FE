import React from "react";
import "./AppBar.css";
import { FiFile, FiMessageSquare, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";

const AppBar = ({ user, onLogout, viewMode, onSwitchMode }) => {
  return (
    <div className="app-bar">
      <div className="app-bar-content">
        <div className="logo-section">
          <img src="/img/kma.png" alt="KMA Logo" className="logo" />
          <div className="title-section">
            <h1 className="main-title">Học viện Kỹ thuật Mật mã</h1>
            <p className="sub-title">Hệ thống trợ lý ảo thông minh</p>
          </div>
        </div>

        <div className="user-section">
          <div className="mode-switcher">
            <button
              className={`mode-btn ${viewMode === "chat" ? "active" : ""}`}
              onClick={() => onSwitchMode("chat")}
              title="Chat thông thường"
            >
              <FiMessageSquare /> Chat
            </button>
            <button
              className={`mode-btn ${viewMode === "file-chat" ? "active" : ""}`}
              onClick={() => onSwitchMode("file-chat")}
              title="Hỏi đáp tài liệu"
            >
              <FiFile /> Tài liệu
            </button>
          </div>

          {user ? (
            <div className="user-info">
              <span className="welcome-text">Xin chào, {user.name}!</span>

              {/* Admin Dashboard Link - only show for admin users */}
              {user.role === "admin" && (
                <Link to="/admin" className="admin-link">
                  <FiSettings /> Quản trị
                </Link>
              )}

              <button className="logout-btn" onClick={onLogout}>
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
