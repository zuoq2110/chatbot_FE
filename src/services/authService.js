import constants from '../utils/constants';

const { API_BASE_URL, API_ENDPOINTS } = constants;

class AuthService {
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Đăng ký thất bại');
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message || 'Lỗi kết nối server'
      };
    }
  }

  async login(credentials) {
    try {
      console.log('Login endpoint:', `${API_BASE_URL}${API_ENDPOINTS.LOGIN_USER}`);
      console.log('Login payload:', {
        username: credentials.username,
        password: credentials.password
      });

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (!response.ok) {
        throw new Error(result.detail || result.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }

      const data = result.data;
      if (!data) {
        throw new Error('No data in login response');
      }

      const userId = data._id || data.id;
      if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
        console.error('Login response data:', data);
        throw new Error('Invalid or missing user ID in login response');
      }

      const userInfo = {
        id: userId,
        username: data.username,
        name: data.student_name || data.username,
        studentCode: data.student_code,
        studentClass: data.student_class,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('isLoggedIn', 'true');

      console.log('Stored userInfo:', userInfo);

      return {
        success: true,
        data: userInfo,
        message: 'Đăng nhập thành công'
      };
    } catch (error) {
      console.error('Login error:', error.message);
      return {
        success: false,
        error: error.message || 'Lỗi kết nối server'
      };
    }
  }

  logout() {
    try {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('chatHistory');
      
      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Lỗi khi đăng xuất'
      };
    }
  }

  isAuthenticated() {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userInfo = localStorage.getItem('userInfo');
      
      return isLoggedIn === 'true' && userInfo !== null;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  getCurrentUser() {
    try {
      const userInfo = localStorage.getItem('userInfo');
      const user = userInfo ? JSON.parse(userInfo) : null;
      console.log('Current user:', user);
      if (user && !user.id) {
        console.error('User object missing id field');
      }
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async updateUser(userData) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('Chưa đăng nhập');
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_USER}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_code: currentUser.studentCode,
          ...userData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Cập nhật thất bại');
      }

      const updatedUser = {
        ...currentUser,
        ...userData
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      return {
        success: true,
        data: updatedUser,
        message: 'Cập nhật thành công'
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.message || 'Lỗi kết nối server'
      };
    }
  }

  async checkConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Connection check error:', error);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;