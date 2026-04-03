import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Tag,
  BookOpen,
  Hash
} from 'lucide-react';
import apiService from '../services/apiService';
import Toast from '../components/Toast';

const NotesUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    tags: '',
    file: null
  });
  const [subjects, setSubjects] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiService.getSubjects();
      if (response.success) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type, id: Date.now() });
  };

  const removeToast = () => {
    setToast(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleFileSelect = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, DOC, DOCX, TXT, or image files.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum size is 10MB.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file
    }));
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.subject || !formData.file) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      
      // First upload the file to get file URL
      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/upload/note`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadFormData
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'File upload failed');
      }

      // Create note with file URL
      const noteData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        fileUrl: uploadResult.data.secure_url,
        fileName: uploadResult.data.original_filename,
        fileSize: uploadResult.data.bytes,
        fileType: uploadResult.data.resource_type
      };

      const noteResponse = await apiService.createNote(noteData);
      
      if (noteResponse.success) {
        setUploadSuccess(true);
        showToast('Note uploaded successfully!', 'success');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            title: '',
            subject: '',
            description: '',
            tags: '',
            file: null
          });
          setUploadSuccess(false);
        }, 3000);
      } else {
        throw new Error(noteResponse.message || 'Failed to create note');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
      showToast(error.message || 'Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const popularSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 
    'Biology', 'Engineering', 'Medicine', 'Business'
  ];

  const popularTags = [
    'exam', 'notes', 'study-guide', 'formula', 'tutorial', 
    'assignment', 'lab', 'reference', 'summary', 'cheatsheet'
  ];

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '24px'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Upload Study Notes
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280'
        }}>
          Share your knowledge with the community
        </p>
      </div>

      {uploadSuccess && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <CheckCircle style={{ color: '#16a34a', marginRight: '12px' }} size={24} />
          <div>
            <p style={{
              color: '#15803d',
              fontWeight: '500',
              marginBottom: '4px'
            }}>
              Upload Successful!
            </p>
            <p style={{
              color: '#16a34a',
              fontSize: '14px'
            }}>
              Your notes have been uploaded and are now available to others.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <AlertCircle style={{ color: '#dc2626', marginRight: '12px' }} size={24} />
          <p style={{ color: '#991b1b' }}>{error}</p>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        padding: '32px',
        border: '1px solid #f3f4f6'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Basic Information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                <BookOpen style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder="Enter note title"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                <Hash style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: 'white'
                }}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              <FileText style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical',
                transition: 'border-color 0.2s ease'
              }}
              placeholder="Provide a brief description of your notes..."
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              <Tag style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s ease'
              }}
              placeholder="e.g., calculus, algebra, exam-prep (comma separated)"
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
              }}
            />
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Separate multiple tags with commas
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              <Upload style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
              File *
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: dragOver ? '2px dashed #667eea' : '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'center',
                background: dragOver ? '#f0f9ff' : '#f9fafb',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <Upload size={48} style={{ 
                color: dragOver ? '#667eea' : '#9ca3af', 
                marginBottom: '16px',
                margin: '0 auto 16px'
              }} />
              <p style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                {formData.file ? formData.file.name : 'Drop your file here or click to browse'}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Supports PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
              </p>
              <input
                id="file-input"
                type="file"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                style={{ display: 'none' }}
                required
              />
              {formData.file ? (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, file: null})}
                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800"
                  >
                    <X size={16} className="mr-1" />
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Upload className="text-gray-400" size={48} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drag and drop your file here
                    </p>
                    <p className="text-gray-600">or</p>
                    <label className="btn btn-secondary mt-2 cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      />
                    </label>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF</p>
                    <p>Maximum file size: 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  subject: '',
                  description: '',
                  tags: '',
                  file: null
                });
                setError('');
              }}
              className="btn btn-secondary"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? (
                <>
                  <div className="loading mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} className="mr-2" />
                  Upload Notes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Upload Guidelines */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">Ensure your notes are clear and well-organized</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">Use descriptive titles and accurate subject tags</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">Add relevant tags to help others find your content</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">Check for copyright and plagiarism issues</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">Keep file sizes reasonable for faster downloads</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">Provide helpful descriptions for better discoverability</p>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      )}
    </div>
  );
};

export default NotesUpload;
