import httpClient from '../utils/httpClient';
import constants from '../utils/constants';

const { API_ENDPOINTS } = constants;

class UserService {
  /**
   * Lấy danh sách tất cả người dùng (chỉ dành cho admin)
   * @returns {Promise<Object>} - Danh sách người dùng
   */
  async getAllUsers() {
    try {
      // Debug authentication state
      const accessToken = localStorage.getItem('accessToken');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      console.group('Auth Debug - getAllUsers');
      console.log('Access Token exists:', !!accessToken);
      console.log('User info:', userInfo);
      console.log('User role:', userInfo.role);
      console.log('isLoggedIn flag:', localStorage.getItem('isLoggedIn'));
      console.groupEnd();
      
      console.log('Gọi API lấy danh sách người dùng');
      const response = await httpClient.get(API_ENDPOINTS.ADMIN_GET_USERS);
      console.log('Kết quả API lấy danh sách người dùng:', response);
      return {
        success: true,
        data: response.data,
        message: response.message || 'Lấy danh sách người dùng thành công'
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      console.error('Error response:', error.response);
      return {
        success: false,
        error: error.message || 'Lỗi khi lấy danh sách người dùng'
      };
    }
  }

  /**
   * Cập nhật thông tin người dùng (chỉ dành cho admin)
   * @param {string} userId - ID của người dùng cần cập nhật
   * @param {Object} userData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Kết quả cập nhật
   */
  async updateUser(userId, userData) {
    try {
      const response = await httpClient.put(`/api/users/admin/${userId}`, userData);
      return {
        success: true,
        data: response.data,
        message: response.message || 'Cập nhật thông tin người dùng thành công'
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      return {
        success: false,
        error: error.message || 'Lỗi khi cập nhật thông tin người dùng'
      };
    }
  }

  /**
   * Xóa người dùng (chỉ dành cho admin)
   * @param {string} userId - ID của người dùng cần xóa
   * @returns {Promise<Object>} - Kết quả xóa
   */
  async deleteUser(userId) {
    try {
      const response = await httpClient.delete(`/api/users/admin/${userId}`);
      return {
        success: true,
        data: response.data,
        message: response.message || 'Xóa người dùng thành công'
      };
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      return {
        success: false,
        error: error.message || 'Lỗi khi xóa người dùng'
      };
    }
  }

  /**
   * Tạo người dùng mới (chỉ dành cho admin)
   * @param {Object} userData - Dữ liệu người dùng mới
   * @returns {Promise<Object>} - Kết quả tạo người dùng
   */
  async createUser(userData) {
    try {
      const response = await httpClient.post('/api/users', userData);
      return {
        success: true,
        data: response.data,
        message: response.message || 'Tạo người dùng thành công'
      };
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      return {
        success: false,
        error: error.message || 'Lỗi khi tạo người dùng'
      };
    }
  }
}

const userService = new UserService();
export default userService;
