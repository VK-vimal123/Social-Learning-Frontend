import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Star, 
  Heart, 
  MessageCircle, 
  Calendar,
  BookOpen,
  Tag,
  ArrowLeft,
  ThumbsUp,
  Share2,
  FileText,
  Eye
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/apiService';
import Toast from '../components/Toast';
import '../assets/css/note-detail.css';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type, id: Date.now() });
  };

  const removeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    fetchNoteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchNoteData = async () => {
    try {
      setLoading(true);
      
      // Fetch note details
      const noteResponse = await apiService.getNote(id);
      if (noteResponse.success) {
        const noteData = noteResponse.data;
        setNote(noteData);
        setLikeCount(noteData.stats.likes || 0);
        
        // Fetch comments
        const commentsResponse = await apiService.getNoteComments(id);
        if (commentsResponse.success) {
          setComments(commentsResponse.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch note data:', error);
      showToast('Failed to load note. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await apiService.toggleLike(id);
      if (response.success) {
        setLiked(response.data.liked);
        setLikeCount(response.data.likes);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      showToast('Failed to update like. Please try again.', 'error');
    }
  };

  const handleRating = async (rating) => {
    try {
      const response = await apiService.createRating({
        noteId: id,
        rating: rating,
        review: ''
      });
      if (response.success) {
        setUserRating(rating);
        showToast('Rating submitted successfully!', 'success');
        // Refresh note data to update average rating
        fetchNoteData();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
      showToast('Failed to submit rating. Please try again.', 'error');
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await apiService.downloadNote(id);
      if (response.success) {
        // Open file in new tab
        window.open(response.data.downloadUrl, '_blank');
        showToast('Download started!', 'success');
        // Refresh note data to update download count
        fetchNoteData();
      }
    } catch (error) {
      console.error('Failed to download note:', error);
      showToast('Failed to download note. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handlePreview = () => {
    if (note?.fileUrl) {
      window.open(note.fileUrl, '_blank');
    } else {
      showToast('No preview available for this note.', 'error');
    }
  };

  const handleComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await apiService.createComment({
          noteId: id,
          content: newComment.trim()
        });
        if (response.success) {
          setComments(prev => [response.data, ...prev]);
          setNewComment('');
          showToast('Comment added successfully!', 'success');
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
        showToast('Failed to add comment. Please try again.', 'error');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  // Helper to format file type display
  const formatFileType = (fileType) => {
    if (!fileType) return 'Unknown';
    
    // Map MIME types to readable names
    const typeMap = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
      'text/plain': 'TXT',
      'text/csv': 'CSV'
    };
    
    return typeMap[fileType] || fileType.split('/').pop()?.toUpperCase() || 'Unknown';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="error-container">
        <div className="error-content">
          <BookOpen size={48} className="text-gray-400" style={{ margin: '0 auto 16px' }} />
          <h2 className="error-title">Note Not Found</h2>
          <p className="error-message">The note you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/browse')}
            className="error-button"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/browse')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}
        >
          <ArrowLeft size={18} />
          Back to Browse
        </button>
        <button
          onClick={handleShare}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}
        >
          <Share2 size={18} />
          Share
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        <style>{`
          @media (max-width: 968px) {
            .note-detail-grid {
              grid-template-columns: 1fr !important;
            }
            .note-detail-sidebar {
              width: 100% !important;
            }
          }
        `}</style>
        {/* Main Content */}
        <div>
          {/* Note Card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            {/* Title */}
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
              {note.title}
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
              {note.description}
            </p>

            {/* Author Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '600' }}>
                {(note.uploadedBy?.fullName || note.uploadedBy?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>
                  {note.uploadedBy?.fullName || note.uploadedBy?.username || 'Unknown User'}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  {note.uploadedBy?.school} • {note.uploadedBy?.branch}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(note.createdAt).toLocaleDateString()}</p>
                <span style={{ display: 'inline-block', marginTop: '4px', padding: '4px 12px', background: '#e0e7ff', color: '#4338ca', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {note.subject?.name || note.subject}
                </span>
              </div>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {note.tags.map((tag, index) => (
                  <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: '#f3f4f6', borderRadius: '16px', fontSize: '13px', color: '#4b5563' }}>
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: '24px', padding: '16px 0', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                <Star size={16} style={{ color: '#fbbf24' }} />
                <span style={{ fontWeight: '600', color: '#111827' }}>{(note.stats?.averageRating || 0).toFixed(1)}</span>
                <span>({note.stats?.totalRatings || 0} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                <Download size={16} />
                {note.stats?.downloads || 0} downloads
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                <Eye size={16} />
                {note.stats?.views || 0} views
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' }}>
                <FileText size={16} />
                {formatFileSize(note.fileSize)} • <span style={{ padding: '2px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{formatFileType(note.fileType)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePreview}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px', background: 'transparent', border: '2px solid #667eea', color: '#667eea', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                <Eye size={20} />
                Preview
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                <Download size={20} />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
              <button
                onClick={handleLike}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', background: liked ? '#fef2f2' : '#f3f4f6', border: 'none', color: liked ? '#ef4444' : '#6b7280', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                <Heart size={20} fill={liked ? '#ef4444' : 'none'} />
                {likeCount}
              </button>
            </div>
          </div>

          {/* Rating Section */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Rate this Note</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    fill={star <= userRating ? '#fbbf24' : 'none'}
                    color={star <= userRating ? '#fbbf24' : '#d1d5db'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
              {userRating > 0 && (
                <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '500' }}>Thank you for rating!</span>
              )}
            </div>
          </div>

          {/* Content Preview */}
          <div className="note-card content-preview">
            <h3>About this Note</h3>
            <div className="content-text">
              <p>{note.content}</p>
              <div className="preview-notice">
                <p>
                  <strong>Note:</strong> This is a preview. Download the complete note to access all content, examples, and practice problems.
                </p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Comments ({comments.length})</h3>
            </div>

            {/* Add Comment */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '600', flexShrink: 0 }}>
                {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this note..."
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', resize: 'vertical', minHeight: '80px', marginBottom: '12px' }}
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleComment}
                    style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.map((comment) => (
                <div key={comment._id || comment.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', flexShrink: 0 }}>
                    {(comment.user?.fullName || comment.user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{comment.user?.fullName || comment.user?.username || 'Unknown'}</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(comment.createdAt || comment.date).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', lineHeight: '1.5' }}>{comment.content}</p>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <ThumbsUp size={14} />
                      {comment.likes > 0 ? comment.likes : 'Like'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: '350px' }}>
          {/* Author Info */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>About the Author</h3>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: '600', margin: '0 auto 16px' }}>
                {(note.uploadedBy?.fullName || note.uploadedBy?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{note.uploadedBy?.fullName || note.uploadedBy?.username || 'Unknown User'}</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{note.uploadedBy?.email || ''}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{note.uploadedBy?.stats?.notesUploaded || 0}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Notes</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{note.uploadedBy?.stats?.totalDownloads?.toLocaleString() || 0}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Downloads</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>{(note.uploadedBy?.stats?.averageRating || 0).toFixed(1)}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Rating</div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/profile/${note.uploadedBy?._id}`)}
                style={{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Related Notes */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Related Notes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Linear Algebra Basics', subject: 'Mathematics', rating: 4.6 },
                { title: 'Differential Equations', subject: 'Mathematics', rating: 4.7 },
                { title: 'Statistics Guide', subject: 'Mathematics', rating: 4.5 }
              ].map((relatedNote, index) => (
                <div key={index} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{relatedNote.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{relatedNote.subject}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24' }}>
                      <Star size={12} fill="#fbbf24" />
                      {relatedNote.rating}
                    </div>
                  </div>
                </div>
              ))}
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

export default NoteDetail;
