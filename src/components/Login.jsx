import React, { useState } from 'react';
import './Login.css';
import LoginAppBar from './LoginAppBar';
import authService from '../services/authService';

const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Login validation
        if (!formData.username?.trim() || !formData.password?.trim()) {
          setError('Vui lòng nhập đầy đủ username và password');
          return;
        }

        const result = await authService.login({
          username: formData.username.trim(),
          password: formData.password
        });

        if (result.success) {
          onLogin(result.data);
        } else {
          setError(result.error);
        }
      } else {
        // Registration validation
        if (!formData.username?.trim() || !formData.password?.trim() || !formData.confirmPassword?.trim()) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          return;
        }

        if (formData.password.length < 6) {
          setError('Mật khẩu phải có ít nhất 6 ký tự');
          return;
        }

        const result = await authService.register({
          username: formData.username,
          password: formData.password
        });

        if (result.success) {
          // Reset form và chuyển về login mode
          setFormData({
            username: '',
            password: '',
            confirmPassword: ''
          });
          setIsLoginMode(true);
          setError('');
          alert('Đăng ký thành công! Hãy đăng nhập với username vừa đăng ký.');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  return (
    <div className="login-page">
      <LoginAppBar />
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">
              {isLoginMode ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
            </h2>
            <p className="login-subtitle">
              {isLoginMode 
                ? 'Chatbot AI - Học viện Kỹ thuật Mật mã' 
                : 'Tạo tài khoản mới để sử dụng hệ thống'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nhập tên đăng nhập..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nhập mật khẩu..."
                required
              />
            </div>
            {!isLoginMode && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu..."
                  required={!isLoginMode}
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  {isLoginMode ? 'Đang đăng nhập...' : 'Đang đăng ký...'}
                </>
              ) : (
                isLoginMode ? 'Đăng nhập' : 'Đăng ký'
              )}
            </button>
          </form>

          <div className="form-switch">
            <p>
              {isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button 
                type="button"
                onClick={toggleMode}
                className="switch-mode-btn"
              >
                {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>

          <div className="login-footer">
            <p className="help-text">
              Cần hỗ trợ? Liên hệ: 
              <a href="mailto:support@kma.edu.vn" className="help-link">
                support@kma.edu.vn
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
