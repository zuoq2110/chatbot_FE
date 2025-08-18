import constants from './constants';
import * as jwtHelper from './jwtHelper';

const { API_BASE_URL, API_ENDPOINTS } = constants;

/**
 * HTTP Client với tính năng xử lý JWT token
 */
class HttpClient {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Không sử dụng phương thức này trực tiếp nữa, thay vào đó sẽ dùng authService.refreshToken()
  // Giữ lại để tương thích với code cũ
  async refreshToken() {
    try {
      console.warn('Deprecation warning: Use authService.refreshToken() instead');
      
      // Import động để tránh circular dependency
      const authService = await import('../services/authService').then(module => module.default);
      const result = await authService.refreshToken();
      return result.success;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Xóa thông tin đăng nhập nếu refresh token thất bại
      jwtHelper.removeTokens();
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('chatHistory');
      return false;
    }
  }

  // Xử lý các request thất bại do token hết hạn
  processQueue(success, error = null) {
    this.failedQueue.forEach(prom => {
      if (success) {
        prom.resolve();
      } else {
        prom.reject(error);
      }
    });
    
    this.failedQueue = [];
  }

  // Thêm request vào queue chờ xử lý
  addToQueue() {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    });
  }

  // Thực hiện request với JWT authentication
  async request(url, options = {}) {
    // Kiểm tra xem url có phải là full URL không
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    // Bỏ qua việc thêm token cho endpoints không cần authentication
    const isAuthEndpoint = [
      API_ENDPOINTS.LOGIN,
      API_ENDPOINTS.REFRESH_TOKEN,
      API_ENDPOINTS.CREATE_USER
    ].some(endpoint => url.includes(endpoint));
    
    // Clone options để tránh mutation
    const requestOptions = { ...options };
    requestOptions.headers = { ...requestOptions.headers };
    
    // Thêm JWT token vào header nếu không phải auth endpoint
    if (!isAuthEndpoint) {
      const accessToken = jwtHelper.getAccessToken();
      
      // Kiểm tra token hết hạn trước khi gửi request
      if (accessToken && jwtHelper.isTokenExpired(accessToken)) {
        console.log('Access token expired, attempting to refresh before request');
        
        // Nếu đang refresh token, đưa request vào queue
        if (this.isRefreshing) {
          try {
            await this.addToQueue();
            // Thử request lại sau khi refresh token thành công
            return this.request(url, options);
          } catch (error) {
            throw error;
          }
        }
        
        // Bắt đầu refresh token
        this.isRefreshing = true;
        
        try {
          // Import động để tránh circular dependency
          const authService = await import('../services/authService').then(module => module.default);
          const refreshResult = await authService.refreshToken();
          
          this.isRefreshing = false;
          
          if (refreshResult.success) {
            // Thông báo cho các request đang chờ
            this.processQueue(true);
            
            // Sử dụng token mới
            requestOptions.headers['Authorization'] = `Bearer ${jwtHelper.getAccessToken()}`;
          } else {
            // Refresh token thất bại
            this.processQueue(false, new Error('Failed to refresh token'));
            throw new Error('Authentication failed');
          }
        } catch (error) {
          this.isRefreshing = false;
          this.processQueue(false, error);
          throw error;
        }
      } else if (accessToken) {
        // Sử dụng token hiện tại nếu chưa hết hạn
        requestOptions.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    
    try {
      // Thực hiện request
      const response = await fetch(fullUrl, requestOptions);
      
      // Xử lý token hết hạn (401 Unauthorized)
      if (response.status === 401 && !isAuthEndpoint) {
        // Nếu đang refresh token, đưa request vào queue
        if (this.isRefreshing) {
          try {
            await this.addToQueue();
            // Thử request lại sau khi refresh token thành công
            return this.request(url, options);
          } catch (error) {
            throw error;
          }
        }
        
        // Bắt đầu refresh token
        this.isRefreshing = true;
        
        try {
          // Import động để tránh circular dependency
          const authService = await import('../services/authService').then(module => module.default);
          const refreshResult = await authService.refreshToken();
          
          this.isRefreshing = false;
          
          if (refreshResult.success) {
            // Thông báo cho các request đang chờ
            this.processQueue(true);
            
            // Thử request lại với token mới
            return this.request(url, options);
          } else {
            // Refresh token thất bại
            this.processQueue(false, new Error('Failed to refresh token'));
            throw new Error('Authentication failed');
          }
        } catch (error) {
          this.isRefreshing = false;
          this.processQueue(false, error);
          throw error;
        }
      }
      
      // Trả về dữ liệu JSON nếu response ok
      if (response.ok) {
        // Kiểm tra xem response có phải JSON không
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return await response.text();
      }
      
      // Xử lý lỗi HTTP
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
  
  // Helper methods
  async get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options });
  }
  
  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
  }
  
  async put(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
  }
  
  async delete(url, options = {}) {
    return this.request(url, { method: 'DELETE', ...options });
  }
  
  async upload(url, formData, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: formData,
      ...options,
    });
  }
}

const httpClientInstance = new HttpClient();
export default httpClientInstance;
