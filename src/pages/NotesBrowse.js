import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  Eye, 
  Calendar,
  User,
  BookOpen,
  Tag,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';
import apiService from '../services/apiService';
import Toast from '../components/Toast';
import '../assets/css/notes-browse.css';

const NotesBrowse = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
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
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchNotes();
    }, 500);
    return () => clearTimeout(delayedSearch);
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
          fileType: note.fileType?.toUpperCase() || 'PDF',
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
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

    const NoteCard = ({ note }) => (
    <div className="note-card" onClick={() => handleNoteClick(note.id)}>
      <div className="note-card-content">
        <div className="note-card-header">
          <div className="flex-1">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-description">{note.description}</p>
          </div>
        </div>

        <div className="note-meta">
          <div className="author-info">
            <div className="author-avatar">{note.author.avatar}</div>
            <div className="author-details">
              <p className="author-name">{note.author.name}</p>
              <p className="author-subject">{note.subject}</p>
            </div>
          </div>
          <span className="file-type-badge">{note.fileType}</span>
        </div>

        <div className="note-tags">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="note-tag">{tag}</span>
          ))}
          {note.tags.length > 3 && (
            <span className="note-tag">+{note.tags.length - 3} more</span>
          )}
        </div>

        <div className="note-stats">
          <div className="stat-item">
            <Star size={14} className="star-icon" />
            {note.rating} ({note.ratingCount})
          </div>
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

        <div className="note-actions">
          <span className="file-size">{note.fileSize}</span>
          <div className="action-buttons">
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
