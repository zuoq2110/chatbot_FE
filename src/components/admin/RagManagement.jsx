import React, { useState, useEffect } from 'react';
import { 
  FiUpload, FiDatabase, FiRefreshCw, FiTrash2, FiFile, FiFileText,
  FiFolder, FiFolderPlus, FiChevronDown, FiChevronRight, FiEdit,
  FiDownload, FiEdit2
} from 'react-icons/fi';
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
  const [folders, setFolders] = useState([{name: 'default', files_count: 0, is_default: true}]);
  const [selectedFolder, setSelectedFolder] = useState('default');
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({default: true});
  const [renamingFolder, setRenamingFolder] = useState('');
  const [newFolderNameForRename, setNewFolderNameForRename] = useState('');
  const [showSubfolderInput, setShowSubfolderInput] = useState(false);
  const [newSubfolderName, setNewSubfolderName] = useState('');
  const [parentFolderForSubfolder, setParentFolderForSubfolder] = useState('');
  const [editingFile, setEditingFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Chỉ chạy khi component mount
    const initData = async () => {
      await fetchFolders();
      await fetchFiles();
    };
    
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFolders = async () => {
    try {
      console.log('Fetching folders...');
      const response = await adminService.getFolders();
      console.log('Folders response:', response);
      
      if (response && response.success) {
        // Đảm bảo rằng danh sách folder có cấu trúc đúng
        const folderNames = Array.isArray(response.folders) ? response.folders : [];
        
        // Chuyển đổi danh sách tên thành các đối tượng với cấu trúc phù hợp
        const formattedFolders = folderNames.map(folderName => {
          const isDefault = folderName === 'default';
          // Đếm số lượng files trong folder này
          const filesCount = files.filter(file => file.folder === folderName).length;
          
          // Xử lý hiển thị cho các subfolder
          let displayName = folderName;
          const isSubfolder = folderName.includes('/');
          let parentFolder = '';
          
          if (isSubfolder) {
            // Tách tên thư mục cha và thư mục con
            const parts = folderName.split('/');
            parentFolder = parts.slice(0, -1).join('/');
            displayName = parts[parts.length - 1];
          }
          
          return {
            name: folderName,         // Tên đầy đủ với đường dẫn (vd: parent/child)
            displayName: displayName, // Tên hiển thị (chỉ phần child)
            parentFolder: parentFolder, // Tên thư mục cha (vd: parent)
            files_count: filesCount,
            is_default: isDefault,
            is_subfolder: isSubfolder
          };
        });
        
        // Đảm bảo luôn có folder default
        if (!formattedFolders.some(f => f.name === 'default')) {
          formattedFolders.push({
            name: 'default', 
            displayName: 'default',
            parentFolder: '',
            files_count: 0, 
            is_default: true,
            is_subfolder: false
          });
        }
        
        console.log('Formatted folders:', formattedFolders);
        setFolders(formattedFolders);
        
        // Nếu không có folder nào được chọn, chọn 'default'
        if (!selectedFolder || !folderNames.includes(selectedFolder)) {
          setSelectedFolder('default');
        }
        
        // Mở rộng folder mặc định
        setExpandedFolders(prev => ({
          ...prev,
          default: true
        }));
      } else {
        console.error('Error fetching folders:', response?.message);
        setMessage(`Lỗi khi lấy danh sách thư mục: ${response?.message || 'Không rõ lỗi'}`);
        setMessageType('error');
        
        // Nếu không thể lấy danh sách thư mục, sử dụng default
        setFolders([{
          name: 'default', 
          displayName: 'default',
          parentFolder: '',
          files_count: 0, 
          is_default: true,
          is_subfolder: false
        }]);
      }
    } catch (error) {
      console.error('Error in fetchFolders:', error);
      setMessage(`Lỗi khi lấy danh sách thư mục: ${error.message || 'Không rõ lỗi'}`);
      setMessageType('error');
      
      // Nếu có lỗi, sử dụng default
      setFolders([{
        name: 'default', 
        displayName: 'default',
        parentFolder: '',
        files_count: 0, 
        is_default: true,
        is_subfolder: false
      }]);
    }
  };

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
        
        // Process files and folders - Ensure proper folder assignment
        fileList.forEach(file => {
          if (!file.folder || file.folder === '') {
            file.folder = 'default';
          }
          
          // Ensure the file knows its parent folder structure for subfolders
          if (file.folder.includes('/')) {
            const folderParts = file.folder.split('/');
            file.parentFolder = folderParts.slice(0, -1).join('/');
            file.folderName = folderParts[folderParts.length - 1];
          } else {
            file.parentFolder = '';
            file.folderName = file.folder;
          }
        });
        
        console.log('Processed file list:', fileList);
        setFiles(fileList);
        
        // Cập nhật số lượng file trong mỗi thư mục, bao gồm cả subfolder
        setFolders(prevFolders => {
          // Tạo bản sao của mảng thư mục hiện tại
          const updatedFolders = [...prevFolders];
          
          // Cập nhật số lượng file cho mỗi thư mục, tính cả file trong thư mục đó
          updatedFolders.forEach(folder => {
            folder.files_count = fileList.filter(f => f.folder === folder.name).length;
          });
          
          return updatedFolders;
        });
        
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

  const handleFolderSelect = (folder) => {
    // Nếu folder là object, lấy folder.name, ngược lại sử dụng folder (string)
    const folderName = typeof folder === 'object' ? folder.name : folder;
    setSelectedFolder(folderName);
  };

  const toggleFolderExpand = (folder) => {
    // Nếu folder là object, lấy folder.name, ngược lại sử dụng folder (string)
    const folderName = typeof folder === 'object' ? folder.name : folder;
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const showNewFolderInput = () => {
    setShowFolderInput(true);
  };

  const handleNewFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      setMessage('Tên thư mục không được để trống');
      setMessageType('error');
      return;
    }

    if (folders.some(f => typeof f === 'object' ? f.name === newFolderName.trim() : f === newFolderName.trim())) {
      setMessage('Thư mục này đã tồn tại');
      setMessageType('error');
      return;
    }

    try {
      console.log('Creating new folder:', newFolderName.trim());
      const response = await adminService.createFolder(newFolderName.trim());
      console.log('Create folder response:', response);
      
      if (response && response.success) {
        setMessage('Đã tạo thư mục mới thành công');
        setMessageType('success');
        
        // Thêm thư mục mới vào state
        const newFolder = {
          name: newFolderName.trim(),
          files_count: 0,
          is_default: false
        };
        setFolders(prev => [...prev, newFolder]);
        
        // Chọn thư mục mới
        setSelectedFolder(newFolder.name);
        
        // Reset form
        setNewFolderName('');
        setShowFolderInput(false);
        
        // Đảm bảo thư mục mới có trong expandedFolders
        setExpandedFolders(prev => ({
          ...prev,
          [newFolder.name]: true
        }));
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể tạo thư mục mới'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      setMessage(`Lỗi khi tạo thư mục: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };

  const showNewSubfolderInput = (parentFolder) => {
    setParentFolderForSubfolder(parentFolder);
    setShowSubfolderInput(true);
  };

  const handleNewSubfolderNameChange = (e) => {
    setNewSubfolderName(e.target.value);
  };

  const createNewSubfolder = async () => {
    if (!newSubfolderName.trim()) {
      setMessage('Tên thư mục con không được để trống');
      setMessageType('error');
      return;
    }

    try {
      console.log('Creating new subfolder:', newSubfolderName.trim(), 'in parent folder:', parentFolderForSubfolder);
      const response = await adminService.createSubfolder(parentFolderForSubfolder, newSubfolderName.trim());
      console.log('Create subfolder response:', response);
      
      if (response && response.success) {
        setMessage('Đã tạo thư mục con mới thành công');
        setMessageType('success');
        
        // Sau khi tạo subfolder, làm mới danh sách thư mục
        await fetchFolders();
        
        // Chọn thư mục con mới
        const newSubfolderPath = `${parentFolderForSubfolder}/${newSubfolderName.trim()}`;
        setSelectedFolder(newSubfolderPath);
        
        // Reset form
        setNewSubfolderName('');
        setShowSubfolderInput(false);
        setParentFolderForSubfolder('');
        
        // Mở rộng thư mục cha
        setExpandedFolders(prev => ({
          ...prev,
          [parentFolderForSubfolder]: true
        }));
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể tạo thư mục con mới'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error creating subfolder:', error);
      setMessage(`Lỗi khi tạo thư mục con: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };

  const handleDelete = async (filename, folder) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa file ${filename}?`)) {
      return;
    }

    try {
      console.log('Deleting file:', filename, 'from folder:', folder);
      const response = await adminService.deleteTrainingFile(filename, folder);
      console.log('Delete response:', response);
      
      if (response && response.success) {
        setMessage(`Đã xóa file ${filename} thành công`);
        setMessageType('success');
        
        // Cập nhật danh sách file và folder sau khi xóa
        await fetchFiles();
        await fetchFolders();
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể xóa file'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setMessage(`Lỗi khi xóa file: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!folder || folder === 'default') {
      setMessage('Không thể xóa thư mục mặc định');
      setMessageType('error');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa thư mục ${folder}? Tất cả các file trong thư mục này sẽ bị xóa.`)) {
      return;
    }

    try {
      console.log('Deleting folder:', folder);
      const response = await adminService.deleteFolder(folder);
      console.log('Delete folder response:', response);
      
      if (response && response.success) {
        setMessage(`Đã xóa thư mục ${folder} thành công`);
        setMessageType('success');
        
        // Cập nhật danh sách thư mục sau khi xóa
        await fetchFolders();
        await fetchFiles();
        
        // Nếu thư mục hiện tại bị xóa, chuyển về thư mục mặc định
        if (selectedFolder === folder) {
          setSelectedFolder('default');
        }
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể xóa thư mục'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      setMessage(`Lỗi khi xóa thư mục: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Vui lòng chọn file để tải lên');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('Đang tải file lên...');
    setMessageType('info');

    try {
      const response = await adminService.uploadTrainingFile(selectedFile, selectedFolder);
      console.log('Upload response:', response);
      
      if (response && response.success) {
        setMessage(`Đã tải lên file ${selectedFile.name} thành công`);
        setMessageType('success');
        setSelectedFile(null);
        
        // Làm mới danh sách file sau khi tải lên
        await fetchFiles();
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể tải lên file'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage(`Lỗi khi tải lên file: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  const showRenameFolder = (folder) => {
    if (folder === 'default') {
      setMessage('Không thể đổi tên thư mục mặc định');
      setMessageType('error');
      return;
    }

    setRenamingFolder(folder);
    
    // Tìm displayName của folder để hiển thị trong input
    const folderObj = folders.find(f => f.name === folder);
    setNewFolderNameForRename(folderObj ? folderObj.displayName : folder);
  };

  const handleRenameFolderChange = (e) => {
    setNewFolderNameForRename(e.target.value);
  };

  const renameFolder = async () => {
    if (!newFolderNameForRename.trim()) {
      setMessage('Tên thư mục không được để trống');
      setMessageType('error');
      return;
    }

    try {
      // Xác định xem đây là thư mục gốc hay thư mục con
      const isSubfolder = renamingFolder.includes('/');
      let newName;
      
      if (isSubfolder) {
        // Nếu là thư mục con, giữ nguyên đường dẫn cha và chỉ đổi tên phần cuối
        const parts = renamingFolder.split('/');
        parts[parts.length - 1] = newFolderNameForRename.trim();
        newName = parts.join('/');
      } else {
        // Nếu là thư mục gốc, sử dụng tên mới trực tiếp
        newName = newFolderNameForRename.trim();
      }

      console.log('Renaming folder from', renamingFolder, 'to', newName);
      const response = await adminService.renameFolder(renamingFolder, newName);
      console.log('Rename folder response:', response);
      
      if (response && response.success) {
        setMessage(`Đã đổi tên thư mục thành công`);
        setMessageType('success');
        
        // Cập nhật danh sách thư mục sau khi đổi tên
        await fetchFolders();
        
        // Nếu đang ở thư mục bị đổi tên, chuyển đến thư mục mới
        if (selectedFolder === renamingFolder) {
          setSelectedFolder(newName);
        }
        
        // Reset form
        setRenamingFolder('');
        setNewFolderNameForRename('');
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể đổi tên thư mục'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
      setMessage(`Lỗi khi đổi tên thư mục: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };

  const cancelRenameFolder = () => {
    setRenamingFolder('');
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
  
  const handleDownload = async (filename, folder) => {
    try {
      // Xây dựng đường dẫn đầy đủ của file
      const filePath = folder ? `${folder}/${filename}` : filename;
      console.log('Downloading file:', filePath);
      
      // Gọi service để tải xuống file
      await adminService.downloadFile(filePath);
    } catch (error) {
      console.error('Error downloading file:', error);
      setMessage(`Lỗi khi tải xuống file: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };
  
  const handleEditClick = async (filename, folder) => {
    try {
      // Trong trường hợp thực tế, bạn sẽ cần tải nội dung file từ server
      // Ở đây tôi giả định có một API để lấy nội dung file
      // const response = await adminService.getFileContent(filename, folder);
      
      // Do chưa có API để lấy nội dung file, tạm thời giả lập
      const filePath = folder ? `${folder}/${filename}` : filename;
      setEditingFile({ filename, folder, filePath });
      
      // Giả lập nội dung file
      setFileContent(`Đây là nội dung file ${filename}.\nBạn có thể chỉnh sửa nó ở đây.\n\nLưu ý: Đây chỉ là nội dung mẫu vì chúng ta chưa có API lấy nội dung file.`);
      
      // Hiện modal chỉnh sửa
      setShowEditModal(true);
    } catch (error) {
      console.error('Error preparing file for edit:', error);
      setMessage(`Lỗi khi chuẩn bị chỉnh sửa file: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };
  
  const handleSaveEdit = async () => {
    try {
      if (!editingFile) return;
      
      console.log('Saving edits to file:', editingFile.filePath);
      const response = await adminService.editFile(editingFile.filePath, fileContent);
      
      if (response && response.success) {
        setMessage('Đã lưu thay đổi thành công');
        setMessageType('success');
        setShowEditModal(false);
        setEditingFile(null);
        setFileContent('');
        
        // Làm mới danh sách file
        await fetchFiles();
      } else {
        setMessage(`Lỗi: ${response?.message || 'Không thể lưu thay đổi'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error saving file edits:', error);
      setMessage(`Lỗi khi lưu thay đổi: ${error.message || 'Đã xảy ra lỗi'}`);
      setMessageType('error');
    }
  };
  
  const cancelEdit = () => {
    setShowEditModal(false);
    setEditingFile(null);
    setFileContent('');
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FiFileText className="file-icon pdf" />;
      case 'docx':
        return <FiFileText className="file-icon docx" />;
      case 'txt':
        return <FiFile className="file-icon txt" />;
      default:
        return <FiFile className="file-icon" />;
    }
  };

  return (
    <>
      <div className="rag-management">
        <h2>Quản lý Tài liệu RAG</h2>
        <p className="description">
          Quản lý các tài liệu để huấn luyện hệ thống truy vấn tài liệu (RAG) cho chatbot.
        </p>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="container">
          <div className="folder-panel">
            <div className="folder-header">
              <h3>Thư mục</h3>
              <button 
                className="new-folder-button"
                onClick={showNewFolderInput}
                title="Tạo thư mục mới"
              >
                <FiFolderPlus /> 
              </button>
            </div>

            {showFolderInput && (
              <div className="new-folder-input">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={handleNewFolderNameChange}
                  placeholder="Tên thư mục mới"
                />
                <div className="folder-input-buttons">
                  <button onClick={createNewFolder}>Tạo</button>
                  <button onClick={() => setShowFolderInput(false)}>Hủy</button>
                </div>
              </div>
            )}

            <div className="folder-list">
              {folders
                .filter(f => !f.is_subfolder)  // Chỉ hiển thị các thư mục gốc ở đây
                .map((folder) => (
                  <div key={folder.name} className="folder-item-container">
                    <div 
                      className={`folder-item ${selectedFolder === folder.name ? 'selected' : ''}`}
                    >
                      <div 
                        className="folder-name"
                        onClick={() => handleFolderSelect(folder.name)}
                      >
                        <span 
                          className="folder-expand-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolderExpand(folder.name);
                          }}
                        >
                          {expandedFolders[folder.name] ? <FiChevronDown /> : <FiChevronRight />}
                        </span>
                        <FiFolder /> 
                        {folder.displayName} ({folder.files_count})
                      </div>
                      <div className="folder-actions">
                        {!folder.is_default && (
                          <>
                            <button 
                              className="new-subfolder-button"
                              onClick={() => showNewSubfolderInput(folder.name)}
                              title="Tạo thư mục con"
                            >
                              <FiFolderPlus />
                            </button>
                            
                            <button 
                              className="rename-folder-button"
                              onClick={() => showRenameFolder(folder.name)}
                              title="Đổi tên thư mục"
                            >
                              <FiEdit />
                            </button>
                            
                            <button 
                              className="delete-folder-button"
                              onClick={() => handleDeleteFolder(folder.name)}
                              title="Xóa thư mục"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hiển thị form tạo subfolder nếu đang ở thư mục này */}
                    {showSubfolderInput && parentFolderForSubfolder === folder.name && (
                      <div className="new-subfolder-input">
                        <input
                          type="text"
                          value={newSubfolderName}
                          onChange={handleNewSubfolderNameChange}
                          placeholder="Tên thư mục con"
                        />
                        <div className="folder-input-buttons">
                          <button onClick={createNewSubfolder}>Tạo</button>
                          <button onClick={() => setShowSubfolderInput(false)}>Hủy</button>
                        </div>
                      </div>
                    )}

                    {/* Hiển thị form đổi tên nếu đang đổi tên thư mục này */}
                    {renamingFolder === folder.name && (
                      <div className="folder-rename-input">
                        <input
                          type="text"
                          value={newFolderNameForRename}
                          onChange={handleRenameFolderChange}
                          placeholder="Tên thư mục mới"
                        />
                        <button onClick={renameFolder}>Lưu</button>
                        <button onClick={cancelRenameFolder}>Hủy</button>
                      </div>
                    )}

                    {/* Hiển thị subfolders nếu thư mục cha được mở rộng */}
                    {expandedFolders[folder.name] && (
                      <div className="subfolder-list">
                        {folders
                          .filter(f => f.is_subfolder && f.parentFolder === folder.name)
                          .map(subfolder => (
                            <div key={subfolder.name} className="subfolder-container">
                              <div 
                                className={`subfolder-item ${selectedFolder === subfolder.name ? 'selected' : ''}`}
                                onClick={() => handleFolderSelect(subfolder.name)}
                              >
                                <div className="folder-name">
                                  <span className="subfolder-indent"></span>
                                  <FiFolder /> 
                                  {subfolder.displayName} ({subfolder.files_count})
                                </div>
                                <div className="folder-actions">
                                  <button 
                                    className="rename-folder-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showRenameFolder(subfolder.name);
                                    }}
                                    title="Đổi tên thư mục"
                                  >
                                    <FiEdit />
                                  </button>
                                  
                                  <button 
                                    className="delete-folder-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(subfolder.name);
                                    }}
                                    title="Xóa thư mục"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </div>

                              {/* Hiển thị form đổi tên nếu đang đổi tên thư mục con này */}
                              {renamingFolder === subfolder.name && (
                                <div className="folder-rename-input">
                                  <input
                                    type="text"
                                    value={newFolderNameForRename}
                                    onChange={handleRenameFolderChange}
                                    placeholder="Tên thư mục mới"
                                  />
                                  <button onClick={renameFolder}>Lưu</button>
                                  <button onClick={cancelRenameFolder}>Hủy</button>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="content-panel">
            <div className="upload-section">
              <h3>Tải lên tài liệu</h3>
              <div className="folder-select">
                <span>Thư mục:</span>
                <span className="selected-folder-name">{selectedFolder}</span>
              </div>
              <div className="file-input-container">
                <input
                  id="file-upload"
                  type="file"
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
                <h3>Danh sách tài liệu trong thư mục: {selectedFolder}</h3>
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
                  {files.filter(file => file.folder === selectedFolder).length === 0 ? (
                    <div className="no-files">Không có tài liệu nào trong thư mục {selectedFolder}</div>
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
                        {files
                          .filter(file => file.folder === selectedFolder)
                          .map((file) => (
                            <tr key={`${file.folder}-${file.filename}`}>
                              <td className="file-name">
                                {getFileIcon(file.filename)}
                                {file.filename}
                              </td>
                              <td>{formatFileSize(file.size)}</td>
                              <td>{new Date(file.last_modified).toLocaleString()}</td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    className="edit-button"
                                    onClick={() => handleEditClick(file.filename, file.folder)}
                                    title="Chỉnh sửa file"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    className="download-button"
                                    onClick={() => handleDownload(file.filename, file.folder)}
                                    title="Tải xuống file"
                                  >
                                    <FiDownload />
                                  </button>
                                  <button
                                    className="delete-button"
                                    onClick={() => handleDelete(file.filename, file.folder)}
                                    title="Xóa file"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
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
        </div>
      </div>
      
      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Chỉnh sửa file: {editingFile?.filename}</h3>
            <textarea 
              className="file-content-editor"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              rows={20}
            />
            <div className="modal-buttons">
              <button className="save-button" onClick={handleSaveEdit}>
                <FiEdit /> Lưu thay đổi
              </button>
              <button className="cancel-button" onClick={cancelEdit}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default RagManagement;
