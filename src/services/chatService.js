import constants from '../utils/constants';

const { API_BASE_URL, API_ENDPOINTS } = constants;

// Tạo fetch wrapper thay cho axios
const apiClient = {
  async request(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options });
  },

  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },
  
  async upload(url, formData, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        body: formData,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  },
};

export const chatService = {
  // Upload file for chat
  uploadFile: async (formData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const options = {};
      
      if (userInfo.token) {
        options.headers = {
          'Authorization': `Bearer ${userInfo.token}`
        };
      }
      
      const response = await apiClient.upload(API_ENDPOINTS.UPLOAD_FILE, formData, options);
      
      return {
        success: true,
        fileInfo: response.fileInfo
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file'
      };
    }
  },
  
  // Query uploaded file
  queryFile: async (fileId, query) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
      
      const response = await apiClient.post(API_ENDPOINTS.QUERY_FILE, {
        file_id: fileId,
        query: query
      }, { headers });
      
      return {
        success: true,
        answer: response.answer,
        sources: response.sources,
        file: response.file,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error('Error querying file:', error);
      return {
        success: false,
        error: error.message || 'Failed to query file'
      };
    }
  },
  
  // Query uploaded file with multiple questions
  multiQueryFile: async (fileId, queries) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
      
      const response = await apiClient.post(API_ENDPOINTS.MULTI_QUERY_FILE, {
        file_id: fileId,
        queries: queries
      }, { headers });
      
      return {
        success: true,
        results: response.results,
        file: response.file,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error('Error multi-querying file:', error);
      return {
        success: false,
        error: error.message || 'Failed to process multiple queries'
      };
    }
  },
  
  // Get information about an uploaded file
  getFileInfo: async (fileId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const headers = {};
      
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
      
      const response = await apiClient.get(`${API_ENDPOINTS.FILE_INFO}/${fileId}`, { headers });
      
      return {
        success: true,
        fileInfo: response.fileInfo
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get file information'
      };
    }
  },
  
  // List all uploaded files
  listFiles: async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const headers = {};
      
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
      
      const response = await apiClient.get(API_ENDPOINTS.LIST_FILES, { headers });
      
      return {
        success: true,
        files: response.files,
        count: response.count
      };
    } catch (error) {
      console.error('Error listing files:', error);
      return {
        success: false,
        error: error.message || 'Failed to list files'
      };
    }
  },
  
  // Delete an uploaded file
  deleteFile: async (fileId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const headers = {};
      
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }
      
      const response = await apiClient.request(`${API_ENDPOINTS.DELETE_FILE}/${fileId}`, {
        method: 'DELETE',
        headers
      });
      
      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete file'
      };
    }
  },
  
  // Quick chat without saving conversation
  sendQuickMessage: async (message) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (userInfo.student_code) {
      headers['student_code'] = userInfo.student_code;
    }

    const response = await apiClient.post(API_ENDPOINTS.QUICK_CHAT, {
      content: message,
    }, { headers });

    if (response.statusCode === 200 && response.data) {
      return {
        success: true,
        message: {
          id: response.data._id || `quick_${Date.now()}`, // Thêm ID mặc định nếu API không cung cấp
          content: response.data.content,
          isUser: response.data.is_user || false,
          createdAt: response.data.created_at,
        },
        metadata: response.metadata || null,
      };
    } else {
      throw new Error(response.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending quick message:', error);
    return {
      success: false,
      message: {
        id: `error_${Date.now()}`,
        content: 'Xin lỗi, hiện tại hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
        isUser: false,
        createdAt: new Date().toISOString(),
      },
      error: error.message,
    };
  }
},

  // Create new conversation
  createConversation: async (userId, title = 'Cuộc trò chuyện mới') => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CONVERSATIONS, {
        user_id: userId,
        title: title,
      });

      if (response.statusCode === 201 && response.data) {
        return {
          success: true,
          conversation: {
            id: response.data._id,
            userId: response.data.user_id,
            title: response.data.title,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at,
          },
        };
      } else {
        throw new Error(response.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get user conversations
  getConversations: async (userId, skip = 0, limit = 20) => {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.CONVERSATIONS}?user_id=${userId}&skip=${skip}&limit=${limit}`
      );

      if (response.statusCode === 200 && response.data) {
        return {
          success: true,
          conversations: response.data.map(conv => ({
            id: conv._id,
            userId: conv.user_id,
            title: conv.title,
            createdAt: conv.created_at,
            updatedAt: conv.updated_at,
          })),
        };
      } else {
        throw new Error(response.message || 'Failed to get conversations');
      }
    } catch (error) {
      console.error('Error getting conversations:', error);
      return {
        success: false,
        conversations: [],
        error: error.message,
      };
    }
  },

  // Get messages from a conversation
  getMessages: async (conversationId, skip = 0, limit = 50) => {
  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.MESSAGES}/${conversationId}?skip=${skip}&limit=${limit}`
    );

    if (response.statusCode === 200 && response.data) {
      return {
        success: true,
        messages: response.data.map(msg => ({
          id: msg._id,
          content: msg.content,
          isUser: msg.is_user,
          createdAt: msg.created_at,
        })),
      };
    } else {
      throw new Error(response.message || 'Failed to get messages');
    }
  } catch (error) {
    console.error('Error getting messages:', error);
    return {
      success: false,
      messages: [],
      error: error.message,
    };
  }
},

  // Send message to a conversation and get AI response
  sendMessage: async (conversationId, message) => {
    try {
        console.log(conversationId, message);
      // Get current user info for context
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add student_code to header if available
      if (userInfo.student_code) {
        headers['student_code'] = userInfo.student_code;
      }
      
      const response = await apiClient.post(
        `/api/chat/${conversationId}/messages`,
        {
          content: message,
          is_user: true,
        },
        { headers }
      );

      if (response.statusCode === 201 && response.data) {
        return {
          success: true,
          message: {
            id: response.data._id,
            content: response.data.content,
            isUser: response.data.is_user,
            createdAt: response.data.created_at,
          },
        };
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Update conversation title
  updateConversation: async (conversationId, title) => {
    try {
      const response = await apiClient.request(
        `/api/chat/conversations/${conversationId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ title }),
        }
      );

      if (response.statusCode === 200 && response.data) {
        return {
          success: true,
          conversation: {
            id: response.data._id,
            userId: response.data.user_id,
            title: response.data.title,
            createdAt: response.data.created_at,
            updatedAt: response.data.updated_at,
          },
        };
      } else {
        throw new Error(response.message || 'Failed to update conversation');
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await apiClient.request(
        `/api/chat/conversations/${conversationId}`,
        { method: 'DELETE' }
      );

      if (response.statusCode === 200) {
        return {
          success: true,
          message: response.message,
        };
      } else {
        throw new Error(response.message || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get chatbot status
  getStatus: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH);
      return {
        success: true,
        status: response.status || 'online',
        data: response,
      };
    } catch (error) {
      console.error('Error getting chatbot status:', error);
      return { 
        success: false,
        status: 'offline',
        error: error.message,
      };
    }
  },

  // Legacy method for backward compatibility
  sendMessageLegacy: async (message, conversationId = null) => {
    if (conversationId) {
      return await chatService.sendMessage(conversationId, message);
    } else {
      return await chatService.sendQuickMessage(message);
    }
  },

  // Get chat history (legacy method for backward compatibility)
  getChatHistory: async (conversationId) => {
    if (conversationId) {
      return await chatService.getMessages(conversationId);
    } else {
      return { success: false, messages: [], error: 'No conversation ID provided' };
    }
  },

  // Feedback on response
  sendFeedback: async (messageId, rating, comment) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.FEEDBACK, {
        message_id: messageId,
        rating: rating,
        comment: comment,
        timestamp: new Date().toISOString(),
      });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Error sending feedback:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

const services = { chatService };
export default services;
