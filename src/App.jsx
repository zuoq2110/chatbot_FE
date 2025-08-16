import React, { useState, useEffect, useRef } from 'react';
import AppBar from './components/AppBar';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import Login from './components/Login';
import FileChat from './components/FileChat';
import { chatService } from './services/chatService';
import authService from './services/authService';
import { v4 as uuidv4 } from 'uuid';
import { FiMenu, FiX, FiFile, FiMessageSquare } from 'react-icons/fi';
import ConversationList from './components/ConversationList';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' or 'file-chat'
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check authentication status on app start
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id && /^[0-9a-fA-F]{24}$/.test(currentUser.id)) {
        console.log('Authenticated user:', currentUser);
        setUser(currentUser);
        setError(null);
      } else {
        console.error('Invalid or missing user ID:', currentUser);
        setError('Không thể xác thực người dùng: ID người dùng không hợp lệ. Vui lòng đăng nhập lại.');
      }
    }
  }, []);

  // Initialize conversations and conversation
  useEffect(() => {
    const init = async () => {
      if (user && user.id) {
        try {
          const convResponse = await chatService.getConversations(user.id);
          if (convResponse.success) {
            setConversations(convResponse.conversations);
            if (convResponse.conversations.length > 0) {
              setConversationId(convResponse.conversations[0].id);
            }
          } else {
            console.error('Failed to load conversations:', convResponse.error);
            setError('Lỗi khi tải danh sách hội thoại: ' + convResponse.error);
          }
        } catch (error) {
          console.error('Error initializing conversations:', error.message);
          setError('Lỗi khi khởi tạo danh sách hội thoại: ' + error.message);
        }
      }
    };
    init();
  }, [user]);

  // Load messages when conversationId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (conversationId) {
        try {
          setIsLoading(true);
          const result = await chatService.getMessages(conversationId);
          if (result.success) {
            const formattedMessages = result.messages.map(msg => ({
              id: msg.id || uuidv4(),
              content: msg.content,
              sender: msg.isUser ? 'user' : 'bot',
              timestamp: new Date(msg.createdAt),
            }));
            setMessages(formattedMessages);
          } else {
            console.error('Failed to load messages:', result.error);
            setError('Lỗi khi tải tin nhắn: ' + result.error);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          setError('Lỗi khi tải tin nhắn: ' + error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadMessages();
  }, [conversationId]);

  // Save messages to localStorage with debounce
  useEffect(() => {
    const debounceSave = setTimeout(() => {
      if (messages.length > 0) {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      }
    }, 500);
    return () => clearTimeout(debounceSave);
  }, [messages]);

  const handleLogin = (userData) => {
    if (userData && userData.id) {
      console.log('Login successful, user:', userData);
      setUser(userData);
      setError(null);
    } else {
      console.error('Login failed or invalid user data:', userData);
      setError(userData.error || 'Đăng nhập thất bại: Dữ liệu người dùng không hợp lệ. Vui lòng thử lại.');
    }
  };

  // Handle switch between chat modes
  const handleSwitchMode = (mode) => {
    setViewMode(mode);
    // Reset any other state if needed when switching modes
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMessages([]);
    setConversationId(null);
    setConversations([]);
    setError(null);
    localStorage.removeItem('chatMessages');
    setIsSidebarOpen(false);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) {
      console.error('Cannot send message: Missing message text');
      setError('Không thể gửi tin nhắn: Nội dung trống.');
      return;
    }

    const userMessage = {
      id: uuidv4(),
      content: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Nếu chưa có conversationId, tạo hội thoại mới trước
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        if (!user || !user.id) {
          throw new Error('Không tìm thấy thông tin người dùng.');
        }
        console.log('Creating new conversation for user:', user.id);
        const response = await chatService.createConversation(
          user.id,
          `Cuộc trò chuyện ${new Date().toLocaleString()}`
        );
        if (!response.success) {
          throw new Error('Không thể tạo hội thoại mới: ' + response.error);
        }
        const newConversation = response.conversation;
        currentConversationId = newConversation.id;
        setConversationId(currentConversationId); // Gán ngay giá trị mới
        setConversations((prev) => [newConversation, ...prev]);
        console.log('New conversation created, ID:', currentConversationId);
      } else {
        console.log('Using existing conversationId:', currentConversationId);
      }

      // Gửi tin nhắn với conversationId đã xác định
      console.log('Sending message with conversationId:', currentConversationId);
      const response = await chatService.sendMessage(currentConversationId, messageText);
      if (response.success) {
        const botMessage = {
          id: uuidv4(),
          content: response.message.content || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
          sender: 'bot',
          timestamp: response.message.createdAt || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setError(null);
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
      let errorText = 'Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.';
      if (error.message.includes('Invalid ID format')) {
        errorText = 'Lỗi: ID hội thoại không hợp lệ. Vui lòng thử lại.';
      } else if (error.message.includes('Unprocessable')) {
        errorText = 'Lỗi: Dữ liệu gửi không hợp lệ. Vui lòng kiểm tra lại.';
      }
      const errorMessage = {
        id: uuidv4(),
        content: errorText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async (newConversation) => {
    if (!user || !user.id) {
      console.error('User or user.id is not available');
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    if (!/^[0-9a-fA-F]{24}$/.test(user.id)) {
      console.error('Invalid user ID format:', user.id);
      setError('ID người dùng không hợp lệ. Vui lòng đăng nhập lại.');
      return;
    }
    try {
      let conversation = newConversation;
      if (!conversation) {
        console.log('Creating new conversation for user:', user.id);
        const response = await chatService.createConversation(
          user.id,
          `Cuộc trò chuyện ${new Date().toLocaleString()}`
        );
        if (!response.success) {
          console.error('Failed to create new conversation:', response.error);
          setError('Không thể tạo hội thoại mới: ' + response.error);
          return;
        }
        conversation = response.conversation;
      }
      setMessages([]);
      setConversationId(conversation.id);
      setConversations((prev) => [conversation, ...prev]);
      setError(null);
      localStorage.removeItem('chatMessages');
      
      // Scroll to top when creating a new conversation
      window.scrollTo(0, 0);
      
      // Also ensure the chat area scrolls to top
      const chatArea = document.querySelector('.chat-area');
      if (chatArea) {
        chatArea.scrollTop = 0;
      }
    } catch (error) {
      console.error('Error creating new conversation:', error.message);
      setError('Lỗi khi tạo hội thoại mới: ' + error.message);
    }
  };

  const handleConversationSelect = (selectedId) => {
    setConversationId(selectedId);
    setMessages([]); // Reset messages when switching conversation
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    
    // Scroll to top when selecting a new conversation
    window.scrollTo(0, 0);
    
    // Also ensure the chat area scrolls to top
    const chatArea = document.querySelector('.chat-area');
    if (chatArea) {
      chatArea.scrollTop = 0;
    }
  };

  const getWelcomeMessage = () => {
    if (user) {
      return `Xin chào ${user.name || 'người dùng'}! Tôi là trợ lý AI của Học viện Kỹ thuật Mật mã. Tôi có thể giúp bạn về các thông tin học tập, quy định nhà trường, và nhiều câu hỏi khác. Hãy hỏi tôi bất cứ điều gì bạn muốn biết!`;
    }
    return 'Xin chào! Tôi là trợ lý AI của Học viện Kỹ thuật Mật mã.';
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* AppBar luôn ở trên cùng */}
      <AppBar
        user={user}
        onLogout={handleLogout}
        viewMode={viewMode}
        onSwitchMode={handleSwitchMode}
      />
      
      {viewMode === 'file-chat' ? (
        <div className="flex-1 p-4 mt-2">
          <FileChat onBack={() => setViewMode('chat')} />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div
            className={`
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0 lg:static lg:inset-0
              fixed inset-y-0 left-0 z-50 w-80
              transition duration-300 ease-in-out transform
              bg-white border-r border-gray-200
            `}
          >
          <ConversationList
            user={user}
            selectedConversationId={conversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            conversations={conversations}
            setConversations={setConversations}
          />
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Chatbot KMA</h1>
            <div className="w-10"></div>
          </div>
          {/* Chat Content */}
          <main className="flex-1 overflow-hidden pt-2">
            {error && (
              <div className="error-message" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div 
              className="chat-area flex-1 overflow-y-auto" 
              style={{ 
                maxHeight: 'calc(100vh - 120px)', // Điều chỉnh dựa trên chiều cao AppBar (60px) + header di động (60px)
                paddingBottom: '80px', // Đảm bảo không bị che bởi ChatInput (chiều cao ~60px + padding)
                paddingTop: '10px' // Thêm padding-top để tránh bị AppBar che khi tạo cuộc trò chuyện mới
              }}
            >
              {messages.length === 0 ? (
                <WelcomeScreen
                  user={user}
                  onSendMessage={handleSendMessage}
                  welcomeMessage={getWelcomeMessage()}
                />
              ) : (
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>
          {/* ChatInput cố định ở dưới cùng */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || !user} // Chỉ disabled khi loading hoặc chưa đăng nhập
          />
        </div>
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

export default App;