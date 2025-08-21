import React, { useState, useEffect } from 'react';
import { FiUpload, FiDatabase, FiRefreshCw, FiTrash2, FiFile, FiFileText } from 'react-icons/fi';
import './RagManagement.css';
import adminService from '../../services/adminService';

const RagManagement = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching training files...');
      const response = await adminService.getTrainingFiles();
      console.log('API Response from component:', response); // Debug log
      
      if (response && response.success) {
        // Ensure we have an array of files
        const fileList = Array.isArray(response.files) ? response.files : [];
        console.log('File list to be set:', fileList);
        setFiles(fileList);
        
        if (fileList.length === 0) {
          console.log('No files found or empty files array');
        }
      } else {
        const errorMsg = response?.message || 'Không thể tải danh sách file';
        console.error('Error message:', errorMsg);
        setMessage(errorMsg);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error in fetchFiles:', error);
      setMessage(`Lỗi: ${error.message || 'Đã xảy ra lỗi khi tải danh sách file'}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Vui lòng chọn file để tải lên');
      setMessageType('error');
      return;
    }

    const allowedTypes = ['.txt', '.pdf', '.docx'];
    const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      setMessage(`Định dạng file không được hỗ trợ. Vui lòng sử dụng: ${allowedTypes.join(', ')}`);
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('Đang tải file lên...');
    setMessageType('info');

    try {
      const response = await adminService.uploadTrainingFile(selectedFile);
      console.log('Upload File Response:', response); // Debug log
      
      if (response.success) {
        setMessage('File đã được tải lên thành công');
        setMessageType('success');
        setSelectedFile(null);
        // Reset file input
        document.getElementById('file-upload').value = '';
        // Refresh file list
        fetchFiles();
      } else {
        setMessage(`Lỗi: ${response.message || 'Không thể tải file lên'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage(`Lỗi khi tải file lên: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa file "${filename}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminService.deleteTrainingFile(filename);
      console.log('Delete File Response:', response); // Debug log
      
      if (response.success) {
        setMessage('File đã được xóa thành công');
        setMessageType('success');
        // Update file list
        setFiles(files.filter(file => file.filename !== filename));
      } else {
        setMessage(`Lỗi: ${response.message || 'Không thể xóa file'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage(`Lỗi khi xóa file: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRebuildIndex = async () => {
    if (!window.confirm('Xác nhận xây dựng lại chỉ mục RAG? Quá trình này có thể mất vài phút.')) {
      return;
    }

    setRebuilding(true);
    setMessage('Đang xây dựng lại chỉ mục RAG...');
    setMessageType('info');

    try {
      const response = await adminService.rebuildRagIndex();
      console.log('Rebuild RAG Index Response:', response); // Debug log
      
      if (response && response.success) {
        const chunksCount = response.chunks || 0;
        setMessage(`Chỉ mục RAG đã được xây dựng lại thành công với ${chunksCount} đoạn văn bản`);
        setMessageType('success');
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể xây dựng lại chỉ mục'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error rebuilding RAG index:', error);
      setMessage(`Lỗi khi xây dựng lại chỉ mục: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    } finally {
      setRebuilding(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  const getFileIcon = (filename) => {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    switch (ext) {
      case '.pdf':
        return <FiFile className="file-icon pdf" />;
      case '.docx':
        return <FiFile className="file-icon docx" />;
      case '.txt':
        return <FiFileText className="file-icon txt" />;
      default:
        return <FiFile className="file-icon" />;
    }
  };

  return (
    <div className="rag-management">
      <h2>Quản lý dữ liệu huấn luyện RAG</h2>
      <p className="description">
        Tải lên và quản lý các tài liệu để huấn luyện chatbot. Sau khi tải lên hoặc xóa tài liệu, hãy nhớ xây dựng lại chỉ mục RAG.
      </p>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="upload-section">
        <h3>Tải lên tài liệu mới</h3>
        <div className="file-input-container">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="file-input-label">
            <FiUpload /> Chọn file
          </label>
          <span className="selected-filename">
            {selectedFile ? selectedFile.name : 'Chưa chọn file'}
          </span>
          <button 
            className="upload-button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            <FiUpload /> {uploading ? 'Đang tải lên...' : 'Tải lên'}
          </button>
        </div>
        <div className="file-types">
          <span>Định dạng được hỗ trợ: .txt, .pdf, .docx</span>
        </div>
      </div>

      <div className="rebuild-section">
        <button 
          className="rebuild-button"
          onClick={handleRebuildIndex}
          disabled={rebuilding}
        >
          <FiRefreshCw /> {rebuilding ? 'Đang xây dựng...' : 'Xây dựng lại chỉ mục RAG'}
        </button>
      </div>

      <div className="file-list-section">
        <div className="file-list-header">
          <h3>Danh sách tài liệu ({files.length})</h3>
          <button 
            className="refresh-button"
            onClick={fetchFiles}
            disabled={isLoading}
          >
            <FiRefreshCw /> Làm mới
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Đang tải danh sách tài liệu...</div>
        ) : (
          <>
            {files.length === 0 ? (
              <div className="no-files">Không có tài liệu nào trong thư mục data</div>
            ) : (
              <table className="file-table">
                <thead>
                  <tr>
                    <th>Tên file</th>
                    <th>Kích thước</th>
                    <th>Ngày cập nhật</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.filename}>
                      <td className="file-name">
                        {getFileIcon(file.filename)}
                        {file.filename}
                      </td>
                      <td>{formatFileSize(file.size)}</td>
                      <td>{new Date(file.last_modified).toLocaleString()}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(file.filename)}
                          title="Xóa file"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RagManagement;
