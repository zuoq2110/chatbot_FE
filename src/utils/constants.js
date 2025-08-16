// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // User endpoints (theo backend routing)
  CREATE_USER: '/api/users',
  LOGIN_USER: '/api/users/login',
  GET_USER: '/api/users',
  
  // Chat endpoints (theo backend routing)
  QUICK_CHAT: '/api/chat/quick-messages',
  CONVERSATIONS: '/api/chat/conversations',
  MESSAGES: '/api/chat/messages',
  SEND_MESSAGE: '/api/chat', // endpoint để gửi tin nhắn trong conversation
  UPLOAD_FILE: '/api/chat/upload-file', // endpoint để upload file
  QUERY_FILE: '/api/chat/query-file', // endpoint để query file đã upload
  MULTI_QUERY_FILE: '/api/chat/multi-query-file', // endpoint để query nhiều câu hỏi vào file
  FILE_INFO: '/api/chat/file-info', // endpoint để lấy thông tin file
  LIST_FILES: '/api/chat/list-files', // endpoint để liệt kê tất cả files
  DELETE_FILE: '/api/chat/delete-file', // endpoint để xóa file
  
  // Legacy endpoints
  CHAT: '/api/chat',
  CHAT_HISTORY: '/api/chat/history',
  HEALTH: '/health',
  FEEDBACK: '/feedback',
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
};

// Message senders
export const MESSAGE_SENDERS = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

// Chat statuses
export const CHAT_STATUS = {
  IDLE: 'idle',
  TYPING: 'typing',
  LOADING: 'loading',
  ERROR: 'error',
};

// Local storage keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'kma_chatbot_history',
  USER_PREFERENCES: 'kma_chatbot_preferences',
  SESSION_ID: 'kma_chatbot_session',
  THEME: 'kma_chatbot_theme',
};

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

// Quick suggestions
export const QUICK_SUGGESTIONS = [
  'Quy định học tập',
  'Điểm số và đánh giá',
  'Lịch thi cuối kỳ',
  'Học phí và chi phí',
  'Thủ tục hành chính',
  'Hoạt động sinh viên',
];

// Sample questions
export const SAMPLE_QUESTIONS = [
  'Điều kiện tốt nghiệp là gì?',
  'Cách tính điểm trung bình tích lũy?',
  'Quy định về đồ án tốt nghiệp',
  'Thủ tục chuyển ngành học',
  'Học bổng dành cho sinh viên',
  'Quy định về thời gian học tập',
  'Cách đăng ký học phần',
  'Thủ tục xin nghỉ học',
];

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  SERVER_ERROR: 'Có lỗi xảy ra từ phía server. Vui lòng thử lại sau.',
  TIMEOUT_ERROR: 'Yêu cầu bị timeout. Vui lòng thử lại.',
  GENERAL_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
  VOICE_NOT_SUPPORTED: 'Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói',
  MICROPHONE_ERROR: 'Không thể truy cập microphone. Vui lòng cấp quyền và thử lại.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Tin nhắn đã được gửi thành công',
  FEEDBACK_SENT: 'Cảm ơn bạn đã gửi phản hồi',
  CHAT_CLEARED: 'Lịch sử trò chuyện đã được xóa',
  COPIED_TO_CLIPBOARD: 'Đã sao chép vào clipboard',
};

// Voice recognition settings
export const VOICE_SETTINGS = {
  LANGUAGE: 'vi-VN',
  INTERIM_RESULTS: false,
  MAX_ALTERNATIVES: 1,
  CONTINUOUS: false,
};

// File upload settings
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'],
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Z-index values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
};

// Export all constants as default
const constants = {
  API_BASE_URL,
  API_ENDPOINTS,
  MESSAGE_TYPES,
  MESSAGE_SENDERS,
  CHAT_STATUS,
  STORAGE_KEYS,
  THEMES,
  QUICK_SUGGESTIONS,
  SAMPLE_QUESTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VOICE_SETTINGS,
  FILE_UPLOAD,
  ANIMATION_DURATION,
  BREAKPOINTS,
  Z_INDEX,
};

export default constants;
