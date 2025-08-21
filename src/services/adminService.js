import constants from '../utils/constants';
// Uncomment when integrating with real API
import httpClient from '../utils/httpClient';

// Uncomment when integrating with real API
const { API_ENDPOINTS } = constants;

class AdminService {
  // User Management
  async getUsers() {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.get(API_ENDPOINTS.ADMIN_GET_USERS);
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching users:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to fetch users'
    //   };
    // }
    
    // For development, return mock data
    return {
      success: true,
      data: [
        {
          id: '60d21b4667d0d8992e610c85',
          username: 'user1',
          name: 'Nguyen Van A',
          studentCode: 'AT170001',
          studentClass: 'AT17A',
          role: 'user',
          status: 'active',
          createdAt: '2023-05-15T09:12:33Z',
          lastLogin: '2023-07-20T14:30:22Z',
          tokenLimit: 10000,
          requestsPerDay: 100
        },
        {
          id: '60d21b4667d0d8992e610c86',
          username: 'user2',
          name: 'Tran Thi B',
          studentCode: 'AT170002',
          studentClass: 'AT17A',
          role: 'user',
          status: 'active',
          createdAt: '2023-05-16T10:22:41Z',
          lastLogin: '2023-07-19T11:45:13Z',
          tokenLimit: 10000,
          requestsPerDay: 100
        },
        {
          id: '60d21b4667d0d8992e610c87',
          username: 'admin',
          name: 'Admin User',
          role: 'admin',
          status: 'active',
          createdAt: '2023-01-01T00:00:00Z',
          lastLogin: '2023-07-21T08:12:55Z',
          tokenLimit: null,
          requestsPerDay: null
        }
      ]
    };
  }

  async createUser(userData) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.post(API_ENDPOINTS.ADMIN_CREATE_USER, userData);
    //   return response;
    // } catch (error) {
    //   console.error('Error creating user:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to create user'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: 'User created successfully',
      data: {
        id: Math.random().toString(36).substring(2, 15),
        ...userData,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    };
  }

  async updateUser(userId, userData) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.put(`${API_ENDPOINTS.ADMIN_UPDATE_USER}/${userId}`, userData);
    //   return response;
    // } catch (error) {
    //   console.error('Error updating user:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to update user'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: 'User updated successfully',
      data: {
        id: userId,
        ...userData,
        updatedAt: new Date().toISOString()
      }
    };
  }

  async deleteUser(userId) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.delete(`${API_ENDPOINTS.ADMIN_DELETE_USER}/${userId}`);
    //   return response;
    // } catch (error) {
    //   console.error('Error deleting user:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to delete user'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: 'User deleted successfully'
    };
  }

  // Rate Limiting
  async getRateLimits() {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.get(API_ENDPOINTS.ADMIN_GET_RATE_LIMITS);
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching rate limits:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to fetch rate limits'
    //   };
    // }
    
    // For development, return mock data
    return {
      success: true,
      data: {
        defaultLimits: {
          requestsPerDay: 100,
          tokensPerRequest: 2000,
          tokensPerDay: 10000
        },
        roleLimits: {
          user: {
            requestsPerDay: 100,
            tokensPerRequest: 2000,
            tokensPerDay: 10000
          },
          premium: {
            requestsPerDay: 500,
            tokensPerRequest: 4000,
            tokensPerDay: 50000
          },
          admin: {
            requestsPerDay: null, // unlimited
            tokensPerRequest: null, // unlimited
            tokensPerDay: null // unlimited
          }
        },
        userExceptions: [
          {
            userId: '60d21b4667d0d8992e610c85',
            username: 'user1',
            requestsPerDay: 150,
            tokensPerRequest: 3000,
            tokensPerDay: 15000
          }
        ]
      }
    };
  }

  async updateRateLimits(rateLimitsData) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.put(API_ENDPOINTS.ADMIN_UPDATE_RATE_LIMITS, rateLimitsData);
    //   return response;
    // } catch (error) {
    //   console.error('Error updating rate limits:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to update rate limits'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: 'Rate limits updated successfully',
      data: rateLimitsData
    };
  }

  // Usage Statistics
  async getUsageStats(timeRange = 'day') {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.get(`${API_ENDPOINTS.ADMIN_GET_USAGE_STATS}?timeRange=${timeRange}`);
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching usage statistics:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to fetch usage statistics'
    //   };
    // }
    
    // For development, return mock data
    const now = new Date();
    const mockData = {
      totalRequests: 1234,
      tokensUsed: 246800,
      avgResponseTime: 1.8,
      errorRate: 2.5,
      
      // Daily stats for charts
      dailyStats: Array.from({ length: timeRange === 'day' ? 24 : (timeRange === 'week' ? 7 : 30) }, (_, i) => {
        const date = new Date(now);
        if (timeRange === 'day') {
          date.setHours(now.getHours() - (23 - i));
        } else if (timeRange === 'week') {
          date.setDate(now.getDate() - (6 - i));
        } else {
          date.setDate(now.getDate() - (29 - i));
        }
        
        return {
          timestamp: date.toISOString(),
          requests: Math.floor(Math.random() * 50) + 20,
          tokens: Math.floor(Math.random() * 10000) + 5000,
          responseTime: Math.random() * 2 + 1,
          errors: Math.floor(Math.random() * 3)
        };
      }),
      
      // Top users for the period
      topUsers: [
        {
          userId: '60d21b4667d0d8992e610c85',
          username: 'user1',
          name: 'Nguyen Van A',
          requests: 256,
          tokens: 51200
        },
        {
          userId: '60d21b4667d0d8992e610c86',
          username: 'user2',
          name: 'Tran Thi B',
          requests: 189,
          tokens: 37800
        }
      ]
    };
    
    return {
      success: true,
      data: mockData
    };
  }

  // Conversation Logs
  async getConversations(filters = {}) {
    // This would be a real API call in production
    // try {
    //   const queryParams = new URLSearchParams(filters).toString();
    //   const response = await httpClient.get(`${API_ENDPOINTS.ADMIN_GET_CONVERSATIONS}?${queryParams}`);
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching conversations:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to fetch conversations'
    //   };
    // }
    
    // For development, return mock data
    const mockConversations = Array.from({ length: 20 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - i * 2);
      
      const userId = i % 2 === 0 ? '60d21b4667d0d8992e610c85' : '60d21b4667d0d8992e610c86';
      const username = i % 2 === 0 ? 'user1' : 'user2';
      const name = i % 2 === 0 ? 'Nguyen Van A' : 'Tran Thi B';
      
      return {
        id: `conv_${i}`,
        userId,
        username,
        userName: name,
        title: `Cuộc trò chuyện ${i + 1}`,
        startTime: date.toISOString(),
        messageCount: Math.floor(Math.random() * 10) + 2,
        tokensUsed: Math.floor(Math.random() * 1000) + 200,
        messages: [
          {
            id: `msg_${i}_1`,
            content: 'Xin chào, tôi muốn hỏi về quy định học tập của Học viện?',
            sender: 'user',
            timestamp: date.toISOString()
          },
          {
            id: `msg_${i}_2`,
            content: 'Chào bạn! Tôi rất vui được giúp đỡ. Học viện Kỹ thuật Mật mã có nhiều quy định học tập khác nhau tùy theo chương trình đào tạo. Bạn muốn tìm hiểu về vấn đề cụ thể nào?',
            sender: 'bot',
            timestamp: new Date(date.getTime() + 5000).toISOString()
          }
        ]
      };
    });
    
    return {
      success: true,
      data: mockConversations
    };
  }

  // LLM Model Management
  async getModels() {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.get(API_ENDPOINTS.ADMIN_GET_MODELS);
    //   return response;
    // } catch (error) {
    //   console.error('Error fetching models:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to fetch models'
    //   };
    // }
    
    // For development, return mock data
    return {
      success: true,
      data: {
        activeModel: 'falcon-7b-instruct',
        availableModels: [
          {
            id: 'falcon-7b-instruct',
            name: 'Falcon 7B Instruct',
            size: '7B',
            type: 'instruct',
            status: 'active',
            description: 'Falcon 7B Instruct là mô hình ngôn ngữ lớn của TII được tối ưu hoá cho việc phản hồi chỉ dẫn.',
            parameters: {
              temperature: 0.7,
              top_p: 0.9,
              max_tokens: 2000,
              repetition_penalty: 1.1
            }
          },
          {
            id: 'llama-2-7b-chat',
            name: 'LLaMA 2 7B Chat',
            size: '7B',
            type: 'chat',
            status: 'available',
            description: 'LLaMA 2 7B Chat là phiên bản được tối ưu hoá cho hội thoại của mô hình LLaMA 2 từ Meta AI.',
            parameters: {
              temperature: 0.6,
              top_p: 0.9,
              max_tokens: 2000,
              repetition_penalty: 1.2
            }
          },
          {
            id: 'mistral-7b-instruct',
            name: 'Mistral 7B Instruct',
            size: '7B',
            type: 'instruct',
            status: 'available',
            description: 'Mistral 7B Instruct là mô hình ngôn ngữ lớn hiệu suất cao cho việc trả lời theo chỉ dẫn.',
            parameters: {
              temperature: 0.7,
              top_p: 0.9,
              max_tokens: 2000,
              repetition_penalty: 1.1
            }
          }
        ]
      }
    };
  }

  async activateModel(modelId) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.post(`${API_ENDPOINTS.ADMIN_ACTIVATE_MODEL}/${modelId}`);
    //   return response;
    // } catch (error) {
    //   console.error('Error activating model:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to activate model'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: `Model ${modelId} activated successfully`,
      data: {
        activeModel: modelId
      }
    };
  }

  async updateModelParameters(modelId, parameters) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.put(`${API_ENDPOINTS.ADMIN_UPDATE_MODEL_PARAMS}/${modelId}`, parameters);
    //   return response;
    // } catch (error) {
    //   console.error('Error updating model parameters:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to update model parameters'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: `Model ${modelId} parameters updated successfully`,
      data: {
        modelId,
        parameters
      }
    };
  }

  async uploadModel(formData) {
    // This would be a real API call in production
    // try {
    //   const response = await httpClient.post(API_ENDPOINTS.ADMIN_UPLOAD_MODEL, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   });
    //   return response;
    // } catch (error) {
    //   console.error('Error uploading model:', error);
    //   return {
    //     success: false,
    //     error: error.message || 'Failed to upload model'
    //   };
    // }
    
    // For development, return mock success
    return {
      success: true,
      message: 'Model uploaded successfully',
      data: {
        id: 'new-model-' + Date.now(),
        name: formData.get('name'),
        size: formData.get('size'),
        type: formData.get('type'),
        status: 'available',
        description: formData.get('description')
      }
    };
  }

  // RAG Management Methods
  async getTrainingFiles() {
    try {
      console.log('Calling API:', API_ENDPOINTS.ADMIN_LIST_TRAINING_FILES);
      const response = await httpClient.get(API_ENDPOINTS.ADMIN_LIST_TRAINING_FILES);
      console.log('Raw API response:', response);
      return response || { success: false, message: 'No response data' };
    } catch (error) {
      console.error('Error fetching training files:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch training files'
      };
    }
    
    // For development, return mock data
    // return {
    //   success: true,
    //   files: [
    //     {
    //       filename: 'regulation.txt',
    //       size: 105642,
    //       last_modified: '2023-07-15T10:22:33.000Z'
    //     },
    //     {
    //       filename: 'Quy định làm việc đối với giảng viên HVKTMM_Ver10.6.txt',
    //       size: 87524,
    //       last_modified: '2023-05-20T09:45:12.000Z'
    //     },
    //     {
    //       filename: 'QĐ thỉnh giảnh (bản phát hành).txt',
    //       size: 42156,
    //       last_modified: '2023-06-10T14:30:45.000Z'
    //     }
    //   ],
    //   count: 3
    // };
  }

  async uploadTrainingFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Uploading file to:', API_ENDPOINTS.ADMIN_UPLOAD_TRAINING_FILE);
      // Sử dụng phương thức upload thay vì post, và KHÔNG thiết lập header Content-Type
      const response = await httpClient.upload(API_ENDPOINTS.ADMIN_UPLOAD_TRAINING_FILE, formData);
      
      console.log('Upload response:', response);
      return response || { success: false, message: 'No response data' };
    } catch (error) {
      console.error('Error uploading training file:', error);
      return {
        success: false,
        message: error.message || 'Failed to upload training file'
      };
    }
  }

  async deleteTrainingFile(filename) {
    try {
      console.log('Deleting file:', `${API_ENDPOINTS.ADMIN_DELETE_TRAINING_FILE}/${filename}`);
      const response = await httpClient.delete(`${API_ENDPOINTS.ADMIN_DELETE_TRAINING_FILE}/${filename}`);
      console.log('Delete response:', response);
      return response || { success: false, message: 'No response data' };
    } catch (error) {
      console.error('Error deleting training file:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete training file'
      };
    }
  }

  async rebuildRagIndex() {
    try {
      console.log('Rebuilding RAG index at:', API_ENDPOINTS.ADMIN_REBUILD_RAG_INDEX);
      const response = await httpClient.post(API_ENDPOINTS.ADMIN_REBUILD_RAG_INDEX);
      console.log('Rebuild response:', response);
      return response || { success: false, message: 'No response data' };
    } catch (error) {
      console.error('Error rebuilding RAG index:', error);
      return {
        success: false,
        message: error.message || 'Failed to rebuild RAG index'
      };
    }
  }
}

const adminService = new AdminService();
export default adminService;
