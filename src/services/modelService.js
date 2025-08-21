import httpClient from './httpClient';
import { API_ENDPOINTS } from '../config/constants';

/**
 * Dịch vụ quản lý các mô hình LLM
 */
const modelService = {
  /**
   * Lấy danh sách tất cả các mô hình
   * @returns {Promise<Array>} Danh sách các mô hình
   */
  getAllModels: async () => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.MODELS.GET_ALL);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin mô hình đang hoạt động
   * @returns {Promise<Object>} Thông tin mô hình đang hoạt động
   */
  getActiveModel: async () => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.MODELS.GET_ACTIVE);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching active model:', error);
      throw error;
    }
  },

  /**
   * Kích hoạt một mô hình
   * @param {string} modelId - ID của mô hình cần kích hoạt
   * @returns {Promise<Object>} Kết quả kích hoạt
   */
  activateModel: async (modelId) => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.MODELS.ACTIVATE(modelId));
      return response;
    } catch (error) {
      console.error('Error activating model:', error);
      throw error;
    }
  },

  /**
   * Cập nhật tham số của một mô hình
   * @param {string} modelId - ID của mô hình cần cập nhật
   * @param {Object} params - Các tham số mới
   * @returns {Promise<Object>} Kết quả cập nhật
   */
  updateModelParams: async (modelId, params) => {
    try {
      const response = await httpClient.put(API_ENDPOINTS.MODELS.UPDATE_PARAMS(modelId), params);
      return response;
    } catch (error) {
      console.error('Error updating model parameters:', error);
      throw error;
    }
  },

  /**
   * Tải lên một mô hình mới
   * @param {Object} modelData - Thông tin mô hình mới
   * @returns {Promise<Object>} Kết quả tải lên
   */
  uploadModel: async (modelData) => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.MODELS.UPLOAD, modelData);
      return response;
    } catch (error) {
      console.error('Error uploading model:', error);
      throw error;
    }
  }
};

export default modelService;
