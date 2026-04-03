const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set token for authenticated requests
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updatePassword(currentPassword, newPassword) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async logout() {
    const data = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.setToken(null);
    return data;
  }

  // Notes endpoints
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notes?${queryString}`);
  }

  async getNote(id) {
    return this.request(`/notes/${id}`);
  }

  async createNote(noteData) {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    return this.request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return this.request(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async downloadNote(id) {
    return this.request(`/notes/${id}/download`);
  }

  async getMyNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notes/my?${queryString}`);
  }

  async toggleLike(id) {
    return this.request(`/notes/${id}/like`, {
      method: 'PUT',
    });
  }

  // Subjects endpoints
  async getSubjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/subjects?${queryString}`);
  }

  async getSubject(id) {
    return this.request(`/subjects/${id}`);
  }

  async getDepartments() {
    return this.request('/subjects/departments');
  }

  // Ratings endpoints
  async getNoteRatings(noteId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/ratings/note/${noteId}?${queryString}`);
  }

  async createRating(ratingData) {
    return this.request('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  }

  async deleteRating(id) {
    return this.request(`/ratings/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyRatings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/ratings/my?${queryString}`);
  }

  // Comments endpoints
  async getNoteComments(noteId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/comments/note/${noteId}?${queryString}`);
  }

  async createComment(commentData) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(id, content) {
    return this.request(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(id) {
    return this.request(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleCommentLike(id) {
    return this.request(`/comments/${id}/like`, {
      method: 'PUT',
    });
  }

  async reportComment(id, reason) {
    return this.request(`/comments/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Follow endpoints
  async followUser(followingId) {
    return this.request('/follow', {
      method: 'POST',
      body: JSON.stringify({ followingId }),
    });
  }

  async unfollowUser(followingId) {
    return this.request(`/follow/${followingId}`, {
      method: 'DELETE',
    });
  }

  async getFollowers(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/follow/followers/${userId}?${queryString}`);
  }

  async getFollowing(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/follow/following/${userId}?${queryString}`);
  }

  async checkFollowStatus(userId) {
    return this.request(`/follow/check/${userId}`);
  }

  async getMyFollowers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/follow/my/followers?${queryString}`);
  }

  async getMyFollowing(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/follow/my/following?${queryString}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
