import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  Eye, 
  Calendar,
  BookOpen,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';
import apiService from '../services/apiService';
import Toast from '../components/Toast';
import '../assets/css/notes-browse.css';

const NotesBrowse = () => {
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const showToast = (message, type) => {
    setToast({ message, type, id: Date.now() });
  };

  const removeToast = () => {
    setToast(null);
  };

  const ratings = ['All Ratings', '5 Stars', '4+ Stars', '3+ Stars', '2+ Stars'];
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-stats.averageRating', label: 'Highest Rated' },
    { value: '-stats.downloads', label: 'Most Downloaded' },
    { value: '-stats.views', label: 'Most Viewed' }
  ];

  useEffect(() => {
    fetchSubjects();
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchNotes();
    }, 500);
    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedSubject, selectedRating, sortBy, pagination.page]);

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

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (selectedSubject && selectedSubject !== 'All Subjects') {
        params.subject = selectedSubject;
      }

      if (selectedRating && selectedRating !== 'All Ratings') {
        const ratingValue = selectedRating.replace(' Stars', '').replace('+', '');
        if (selectedRating.includes('+')) {
          params['stats.averageRating[gte]'] = parseInt(ratingValue);
        } else {
          params['stats.averageRating'] = parseInt(ratingValue);
        }
      }

      const response = await apiService.getNotes(params);
      
      if (response.success) {
        const formattedNotes = response.data.map(note => ({
          id: note._id,
          title: note.title,
          subject: note.subject?.name || 'Unknown',
          description: note.description || 'No description available',
          author: { 
            name: note.uploadedBy?.fullName || 'Unknown', 
            avatar: note.uploadedBy?.avatar || note.uploadedBy?.fullName?.charAt(0) || 'U'
          },
          rating: note.stats.averageRating,
          ratingCount: note.stats.totalRatings,
          downloads: note.stats.downloads,
          views: note.stats.views,
          uploadDate: note.createdAt,
          tags: note.tags || [],
          fileSize: formatFileSize(note.fileSize),
          fileType: formatFileType(note.fileType),
          fileUrl: note.fileUrl
        }));

        setNotes(formattedNotes);
        setFilteredNotes(formattedNotes);
        setPagination(prev => ({
          ...prev,
          total: response.total,
          pages: response.pages
        }));
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      showToast('Failed to load notes. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatFileType = (fileType) => {
    if (!fileType) return 'PDF';
    
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
    
    return typeMap[fileType] || fileType.split('/').pop()?.toUpperCase()?.substring(0, 4) || 'FILE';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="text-yellow-400 fill-current" />
        ))}
        {halfStar === 1 && <Star size={14} className="text-yellow-400 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={14} className="text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const handleDownload = async (e, note) => {
    e.stopPropagation();
    try {
      await apiService.downloadNote(note.id);
      window.open(note.fileUrl, '_blank');
      showToast('Download started!', 'success');
    } catch (error) {
      showToast('Download failed. Please try again.', 'error');
    }
  };

  const NoteCard = ({ note }) => (
    <div 
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={() => handleNoteClick(note.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#111827', 
          marginBottom: '8px',
          lineHeight: '1.4'
        }}>
          {note.title}
        </h3>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          marginBottom: '16px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {note.description}
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {note.author.avatar}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {note.author.name}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                {note.subject}
              </p>
            </div>
          </div>
          <span style={{
            padding: '4px 10px',
            background: '#e0e7ff',
            color: '#4338ca',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {note.fileType}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <span key={index} style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              color: '#4b5563',
              borderRadius: '16px',
              fontSize: '12px'
            }}>
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              color: '#4b5563',
              borderRadius: '16px',
              fontSize: '12px'
            }}>
              +{note.tags.length - 3}
            </span>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
            <Star size={14} style={{ color: '#fbbf24' }} />
            {note.rating} ({note.ratingCount})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
            <Download size={14} />
            {note.downloads}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280' }}>
            <Eye size={14} />
            {note.views}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          {note.fileSize}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{
              padding: '8px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white',
              color: '#374151',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(note.fileUrl, '_blank');
            }}
          >
            <Eye size={16} />
            Preview
          </button>
          <button 
            style={{
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              background: '#667eea',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={(e) => handleDownload(e, note)}
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );

  const NoteListItem = ({ note }) => (
    <div className="note-list-item" onClick={() => handleNoteClick(note.id)}>
      <div className="note-list-content">
        <div className="note-list-main">
          <div className="note-list-header">
            <div className="note-list-icon">
              <BookOpen className="text-gray-600" size={24} />
            </div>
            <div className="note-list-details">
              <h3 className="note-list-title">{note.title}</h3>
              <p className="note-list-description">{note.description}</p>
              
              <div className="note-list-meta">
                <div className="author-info">
                  <div className="author-avatar">{note.author.avatar}</div>
                  <span>{note.author.name}</span>
                </div>
                <span className="file-type-badge">{note.subject}</span>
                <span>{note.fileSize}</span>
                <span>{note.fileType}</span>
              </div>

              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="note-tag">{tag}</span>
                ))}
              </div>

              <div className="note-list-footer">
                <div className="note-list-stats">
                  {renderStars(note.rating)}
                  <div className="stat-item">
                    <Download size={14} />
                    {note.downloads}
                  </div>
                  <div className="stat-item">
                    <Eye size={14} />
                    {note.views}
                  </div>
                  <div className="stat-item">
                    <Calendar size={14} />
                    {new Date(note.uploadDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="note-list-actions">
                  <button className="btn btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Preview functionality would be implemented here');
                          }}>
                    <Eye size={16} />
                    Preview
                  </button>
                  <button className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Download started! In a real app, this would download the actual file.');
                          }}>
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-browse-container">
      {/* Header */}
      <div className="notes-browse-header">
        <div className="header-title">
          <h1>Browse Notes</h1>
          <p className="header-subtitle">
            Discover and download study materials from fellow students
          </p>
        </div>
        <div className="view-mode-toggle">
          <div className="view-mode-buttons">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
            >
              <Grid size={20} style={{ color: '#6b7280' }} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
            >
              <List size={20} style={{ color: '#6b7280' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-card">
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search notes by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filters-button"
          >
            <Filter size={20} />
            Filters
            <ChevronDown 
              size={20} 
              style={{
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </button>
        </div>

        <div className={`filters-content ${showFilters ? 'show' : ''}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="filter-select"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Minimum Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="filter-select"
              >
                {ratings.map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filters-actions">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('');
                setSelectedRating('');
                setSortBy('newest');
              }}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No notes found</h3>
            <p className="empty-state-message">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}>
            {filteredNotes.map((note) => 
              viewMode === 'grid' ? (
                <NoteCard key={note.id} note={note} />
              ) : (
                <NoteListItem key={note.id} note={note} />
              )
            )}
          </div>
        )}
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

export default NotesBrowse;
