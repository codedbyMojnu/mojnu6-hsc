import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Update with your backend URL
});

// Leaderboard API functions
export const leaderboardAPI = {
  // Get global leaderboard
  getGlobalLeaderboard: (params = {}) => api.get('/api/leaderboard/global', { params }),

  // Get weekly leaderboard
  getWeeklyLeaderboard: (params = {}) => api.get('/api/leaderboard/weekly', { params }),

  // Get monthly leaderboard
  getMonthlyLeaderboard: (params = {}) => api.get('/api/leaderboard/monthly', { params }),

  // Get user ranking
  getUserRanking: (username) => api.get(`/api/leaderboard/ranking/${username}`),

  // Create friend challenge
  createChallenge: (data, token) => api.post('/api/leaderboard/challenge', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Respond to challenge
  respondToChallenge: (username, data, token) => api.put(`/api/leaderboard/challenge/${username}/respond`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Get user challenges
  getUserChallenges: (username, token) => api.get(`/api/leaderboard/challenges/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Get user notifications
  getUserNotifications: (username, params = {}, token) => api.get(`/api/leaderboard/notifications/${username}`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Mark notification as read
  markNotificationRead: (username, notificationId, token) => api.put(`/api/leaderboard/notifications/${username}/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Update competition points
  updateCompetitionPoints: (username, data, token) => api.put(`/api/leaderboard/competition/${username}/points`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Puzzle API functions
export const puzzleAPI = {
  // Get puzzle marketplace
  getMarketplace: (params = {}) => api.get('/api/puzzles/marketplace', { params }),

  // Get featured puzzles
  getFeaturedPuzzles: () => api.get('/api/puzzles/featured'),

  // Get puzzle filters
  getFilters: () => api.get('/api/puzzles/filters'),

  // Get puzzle by ID
  getPuzzleById: (id) => api.get(`/api/puzzles/${id}`),

  // Create puzzle
  createPuzzle: (data, token) => api.post('/api/puzzles', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Get user's puzzles
  getUserPuzzles: (params = {}, token) => api.get('/api/puzzles/user/puzzles', {
    params,
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Update puzzle
  updatePuzzle: (id, data, token) => api.put(`/api/puzzles/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Delete puzzle
  deletePuzzle: (id, token) => api.delete(`/api/puzzles/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Submit puzzle answer
  submitAnswer: (id, data, token) => api.post(`/api/puzzles/${id}/answer`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Add puzzle review
  addReview: (id, data, token) => api.post(`/api/puzzles/${id}/review`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Report puzzle
  reportPuzzle: (id, data, token) => api.post(`/api/puzzles/${id}/report`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Get creator statistics
  getCreatorStats: (token) => api.get('/api/puzzles/user/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Chat API functions
export const chatAPI = {
  // Get chat messages for a room
  getMessages: (roomId, params = {}) => api.get(`/api/chat/messages/${roomId}`, { params }),

  // Get user's chat history
  getUserHistory: (userId, params = {}, token) => api.get(`/api/chat/history/${userId}`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  }),

  // Delete a message
  deleteMessage: (messageId, token) => api.delete(`/api/chat/messages/${messageId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export default api;
