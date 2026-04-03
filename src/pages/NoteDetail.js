import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Star, 
  Heart, 
  MessageCircle, 
  Calendar,
  User,
  BookOpen,
  Tag,
  ArrowLeft,
  ThumbsUp,
  Share2,
  FileText
} from 'lucide-react';
import apiService from '../services/apiService';
import Toast from '../components/Toast';
import '../assets/css/note-detail.css';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
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

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`cursor-pointer transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-200'
            }`}
            onClick={() => interactive && handleRating(star)}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}.0` : 'Rate this'}
        </span>
      </div>
    );
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
    <div className="note-detail-container">
      {/* Header */}
      <div className="note-detail-header">
        <button
          onClick={() => navigate('/browse')}
          className="back-button"
        >
          <ArrowLeft size={20} />
          Back to Browse
        </button>
        <button
          onClick={handleShare}
          className="share-button"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>

      <div className="note-detail-grid">
        {/* Main Content */}
        <div className="main-content">
          {/* Note Header */}
          <div className="note-card">
            <div className="note-header">
              <h1>{note.title}</h1>
              <p className="note-description">{note.description}</p>
              
              <div className="author-info">
                <div className="author-avatar">
                  <div className="author-avatar-circle">
                    {note.author.avatar}
                  </div>
                  <div className="author-details">
                    <p className="author-name">{note.author.name}</p>
                    <p className="author-email">{note.author.email}</p>
                  </div>
                </div>
                <div className="meta-info">
                  <Calendar size={16} />
                  {new Date(note.uploadDate).toLocaleDateString()}
                </div>
                <span className="subject-badge">{note.subject}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="tags-container">
              {note.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="stats-bar">
              <div className="stat-item">
                <Star size={16} className="star-icon" />
                {note.rating} ({note.ratingCount} reviews)
              </div>
              <div className="stat-item">
                <Download size={16} />
                {note.downloads} downloads
              </div>
              <div className="stat-item">
                <MessageCircle size={16} />
                {comments.length} comments
              </div>
              <div className="stat-item">
                <FileText size={16} />
                {note.fileSize} • {note.fileType}
              </div>
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <button
                onClick={handleDownload}
                className="download-button"
              >
                <Download size={20} />
                Download Note
              </button>
              <button
                onClick={handleLike}
                className={`like-button ${liked ? 'liked' : ''}`}
              >
                <Heart size={20} className="heart-icon" />
                {likeCount} Likes
              </button>
            </div>
          </div>

          {/* Rating Section */}
          <div className="note-card rating-section">
            <h3>Rate this Note</h3>
            <div className="rating-container">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`star ${star <= userRating ? 'filled' : ''}`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
              {userRating > 0 && (
                <span className="rating-text">Thank you for rating!</span>
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
          <div className="note-card comments-section">
            <div className="comments-header">
              <h3>Comments ({comments.length})</h3>
              <button
                onClick={() => setShowComments(!showComments)}
                className="toggle-comments"
              >
                {showComments ? 'Hide' : 'Show'} Comments
              </button>
            </div>

            <div className={`comments-content ${showComments ? '' : 'hidden'}`}>
              {/* Add Comment */}
              <div className="comment-form">
                <div className="comment-avatar">CU</div>
                <div className="comment-input-container">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this note..."
                    className="comment-textarea"
                    rows={3}
                  />
                  <div className="comment-submit-container">
                    <button
                      onClick={handleComment}
                      className="comment-submit"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-avatar">
                      {comment.author.avatar}
                    </div>
                    <div className="comment-content">
                      <div className="comment-meta">
                        <span className="comment-author">{comment.author.name}</span>
                        <span className="comment-date">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                      <button className="comment-like">
                        <ThumbsUp size={14} />
                        {comment.likes > 0 && comment.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Author Info */}
          <div className="note-card author-card">
            <h3>About the Author</h3>
            <div className="author-card-content">
              <div className="author-large-avatar">
                {note.author.avatar}
              </div>
              <h4 className="author-card-name">{note.author.name}</h4>
              <p className="author-card-email">{note.author.email}</p>
              <div className="author-stats">
                <div className="author-stat">
                  <span>Notes Uploaded:</span>
                  <span className="author-stat-value">12</span>
                </div>
                <div className="author-stat">
                  <span>Total Downloads:</span>
                  <span className="author-stat-value">2,847</span>
                </div>
                <div className="author-stat">
                  <span>Average Rating:</span>
                  <span className="author-stat-value">4.7</span>
                </div>
              </div>
              <button className="view-profile-button">
                View Profile
              </button>
            </div>
          </div>

          {/* Related Notes */}
          <div className="note-card related-notes">
            <h3>Related Notes</h3>
            <div className="related-notes-list">
              {[
                { title: 'Linear Algebra Basics', subject: 'Mathematics', rating: 4.6 },
                { title: 'Differential Equations', subject: 'Mathematics', rating: 4.7 },
                { title: 'Statistics Guide', subject: 'Mathematics', rating: 4.5 }
              ].map((relatedNote, index) => (
                <div key={index} className="related-note">
                  <h4 className="related-note-title">{relatedNote.title}</h4>
                  <div className="related-note-meta">
                    <span>{relatedNote.subject}</span>
                    <div className="related-note-rating">
                      <Star size={12} className="star-icon" />
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
