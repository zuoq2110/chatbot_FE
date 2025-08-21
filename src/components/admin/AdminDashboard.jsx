import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiUsers, FiSettings, FiBarChart2, 
  FiClock, FiDatabase, FiAlertCircle, FiSliders,
  FiLogOut, FiMenu, FiX, FiUserCheck, FiBook
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Login from '../Login';
import UsageStatistics from './UsageStatistics';
import ConversationLogs from './ConversationLogs';
import UserManagement from './UserManagement';
import RateLimiting from './RateLimiting';
import ModelManagement from './ModelManagement';
import RagManagement from './RagManagement';
import authService from '../../services/authService';

// Admin Dashboard Views
const VIEWS = {
  STATS: 'statistics',
  USERS: 'users',
  LOGS: 'logs',
  RATE_LIMITS: 'rate-limits',
  MODEL_MANAGEMENT: 'models',
  RAG_MANAGEMENT: 'rag',
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState(VIEWS.STATS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in and has admin role
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.role === 'admin') {
          setUser(currentUser);
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    // Chuyển hướng về trang chủ
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case VIEWS.STATS:
        return <UsageStatistics />;
      case VIEWS.USERS:
        return <UserManagement />;
      case VIEWS.LOGS:
        return <ConversationLogs />;
      case VIEWS.RATE_LIMITS:
        return <RateLimiting />;
      case VIEWS.MODEL_MANAGEMENT:
        return <ModelManagement />;
      case VIEWS.RAG_MANAGEMENT:
        return <RagManagement />;
      default:
        return <UsageStatistics />;
    }
  };

  // If not logged in or not an admin, show login screen
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="admin-dashboard">
      {/* Mobile menu toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/assets/kma-logo.svg" alt="KMA Logo" className="admin-logo" />
          <h2>Quản trị Chatbot</h2>
        </div>
        
        <nav className="admin-nav">
          <ul>
            <li>
              <button 
                className={activeView === VIEWS.STATS ? 'active' : ''} 
                onClick={() => {
                  setActiveView(VIEWS.STATS);
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiBarChart2 />
                <span>Thống kê sử dụng</span>
              </button>
            </li>
            <li>
              <button 
                className={activeView === VIEWS.USERS ? 'active' : ''} 
                onClick={() => {
                  setActiveView(VIEWS.USERS);
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiUsers />
                <span>Quản lý người dùng</span>
              </button>
            </li>
            <li>
              <button 
                className={activeView === VIEWS.LOGS ? 'active' : ''} 
                onClick={() => {
                  setActiveView(VIEWS.LOGS);
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiClock />
                <span>Lịch sử hội thoại</span>
              </button>
            </li>
            <li>
              <button 
                className={activeView === VIEWS.RATE_LIMITS ? 'active' : ''} 
                onClick={() => {
                  setActiveView(VIEWS.RATE_LIMITS);
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiAlertCircle />
                <span>Giới hạn tốc độ</span>
              </button>
            </li>
            <li>
              <button 
                className={activeView === VIEWS.MODEL_MANAGEMENT ? 'active' : ''} 
                onClick={() => {
                  setActiveView(VIEWS.MODEL_MANAGEMENT);
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiDatabase />
                <span>Quản lý mô hình LLM</span>
              </button>
            </li>
            <li>
              <button 
                className={activeView === VIEWS.RAG_MANAGEMENT ? 'active' : ''} 
                onClick={() => {
                  setActiveView(VIEWS.RAG_MANAGEMENT);
                  setIsMobileMenuOpen(false);
                }}
              >
                <FiBook />
                <span>Quản lý dữ liệu RAG</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <FiUserCheck />
            <span>{user.name || user.username}</span>
          </div>
          <button className="admin-logout-button" onClick={handleLogout}>
            <FiLogOut />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        <header className="admin-content-header">
          <h1>
            {activeView === VIEWS.STATS && 'Thống kê sử dụng'}
            {activeView === VIEWS.USERS && 'Quản lý người dùng'}
            {activeView === VIEWS.LOGS && 'Lịch sử hội thoại'}
            {activeView === VIEWS.RATE_LIMITS && 'Giới hạn tốc độ'}
            {activeView === VIEWS.MODEL_MANAGEMENT && 'Quản lý mô hình LLM'}
            {activeView === VIEWS.RAG_MANAGEMENT && 'Quản lý dữ liệu RAG'}
          </h1>
        </header>
        
        <div className="admin-content-body">
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
