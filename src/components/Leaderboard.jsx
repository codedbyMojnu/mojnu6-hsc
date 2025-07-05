import { useCallback, useEffect, useState } from 'react';
import { leaderboardAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import checkUserType from '../utils/checkUserType';

// Trophy icons for different ranks
const TrophyIcon = ({ rank }) => {
  if (rank === 1) return <span className="text-yellow-500 text-xl">🥇</span>;
  if (rank === 2) return <span className="text-gray-400 text-xl">🥈</span>;
  if (rank === 3) return <span className="text-amber-600 text-xl">🥉</span>;
  return <span className="text-gray-500 text-lg">#{rank}</span>;
};

// Animated medal for top 3
const AnimatedMedal = ({ rank, children }) => {
  if (rank <= 3) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        {children}
      </div>
    );
  }
  return children;
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center p-8">
    <div className="text-red-500 text-4xl mb-4">⚠️</div>
    <p className="text-red-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default function Leaderboard({ isOpen, onClose }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [challenges, setChallenges] = useState({ incoming: [], outgoing: [], active: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('totalPoints');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [challengeUsername, setChallengeUsername] = useState('');
  const [challengeType, setChallengeType] = useState('points');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time refresh interval
  useEffect(() => {
    if (!isOpen || !autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      fetchLeaderboard();
      if (user?.token) {
        fetchNotifications();
        fetchChallenges();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen, autoRefresh, user?.token]);

  // Fetch leaderboard data with better error handling
  const fetchLeaderboard = useCallback(async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      const params = { sortBy, page, limit: 20 };
      
      console.log('Fetching leaderboard data:', { activeTab, params });
      
      switch (activeTab) {
        case 'weekly':
          response = await leaderboardAPI.getWeeklyLeaderboard(params);
          break;
        case 'monthly':
          response = await leaderboardAPI.getMonthlyLeaderboard(params);
          break;
        default:
          response = await leaderboardAPI.getGlobalLeaderboard(params);
      }
      
      console.log('Leaderboard response:', response.data);
      
      if (response.data.success) {
        setLeaderboardData(response.data.data);
        setHasNextPage(response.data.pagination?.hasNext || false);
      } else {
        throw new Error(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.response?.data?.message || 'Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  }, [isOpen, activeTab, sortBy, page]);

  // Fetch user ranking with error handling
  const fetchUserRanking = useCallback(async () => {
    if (!profile?.username) return;
    
    try {
      const response = await leaderboardAPI.getUserRanking(profile.username);
      if (response.data.success) {
        setUserRanking(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching user ranking:', err);
      // Don't set error for ranking as it's not critical
    }
  }, [profile?.username]);

  // Fetch notifications with error handling
  const fetchNotifications = useCallback(async () => {
    if (!user?.token || !profile?.username) return;
    
    try {
      const { username } = checkUserType(user.token);
      const response = await leaderboardAPI.getUserNotifications(username, { limit: 10 }, user.token);
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [user?.token, profile?.username]);

  // Fetch challenges with error handling
  const fetchChallenges = useCallback(async () => {
    if (!user?.token || !profile?.username) return;
    
    try {
      const { username } = checkUserType(user.token);
      const response = await leaderboardAPI.getUserChallenges(username, user.token);
      if (response.data.success) {
        setChallenges(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  }, [user?.token, profile?.username]);

  // Create challenge with better UX
  const createChallenge = async () => {
    if (!user?.token || !challengeUsername.trim()) {
      alert('Please enter a valid username');
      return;
    }
    
    if (challengeUsername.trim().toLowerCase() === profile?.username?.toLowerCase()) {
      alert('You cannot challenge yourself!');
      return;
    }
    
    try {
      const { username } = checkUserType(user.token);
      const response = await leaderboardAPI.createChallenge({
        challenger: username,
        challenged: challengeUsername.trim(),
        challengeType
      }, user.token);
      
      if (response.data.success) {
        setChallengeUsername('');
        fetchChallenges();
        fetchNotifications();
        alert('🎯 Challenge sent successfully!');
      }
    } catch (err) {
      console.error('Error creating challenge:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send challenge';
      alert(`❌ ${errorMessage}`);
    }
  };

  // Respond to challenge with better UX
  const respondToChallenge = async (challengeId, response) => {
    if (!user?.token) return;
    
    try {
      const { username } = checkUserType(user.token);
      const responseData = await leaderboardAPI.respondToChallenge(username, {
        challengeId,
        response
      }, user.token);
      
      if (responseData.data.success) {
        fetchChallenges();
        fetchNotifications();
        alert(`✅ Challenge ${response}!`);
      }
    } catch (err) {
      console.error('Error responding to challenge:', err);
      alert('❌ Failed to respond to challenge');
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    if (!user?.token || !profile?.username) return;
    
    try {
      const { username } = checkUserType(user.token);
      await leaderboardAPI.markNotificationRead(username, notificationId, user.token);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchLeaderboard();
    fetchUserRanking();
    if (user?.token) {
      fetchNotifications();
      fetchChallenges();
    }
  };

  // Load data when component opens
  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
      fetchUserRanking();
      if (user?.token) {
        fetchNotifications();
        fetchChallenges();
      }
    }
  }, [isOpen, fetchLeaderboard, fetchUserRanking, fetchNotifications, fetchChallenges, user?.token]);

  // Refresh data when tab changes
  useEffect(() => {
    setPage(1);
    fetchLeaderboard();
  }, [activeTab, sortBy, fetchLeaderboard]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-4 sm:p-6 max-w-4xl mx-4 animate-bounce-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-responsive-xl sm:text-2xl font-extrabold text-gray-800">
            🏆 লিডারবোর্ড ও প্রতিযোগিতা
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-md text-responsive-xs font-semibold transition-colors ${
                autoRefresh 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
            >
              {autoRefresh ? '🔄 ON' : '⏸️ OFF'}
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-responsive-xs font-semibold hover:bg-blue-600 transition-colors"
              title="Refresh data"
            >
              🔄
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close leaderboard"
            >
              ×
            </button>
          </div>
        </div>

        {/* Last Update Indicator */}
        <div className="text-center mb-4">
          <p className="text-responsive-xs text-gray-500">
            শেষ আপডেট: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        {/* User Ranking Summary */}
        {userRanking && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-3">👤 আপনার র‍্যাঙ্কিং</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">#{userRanking.globalRank}</div>
                <div className="text-xs text-gray-600">সর্বমোট</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">#{userRanking.weeklyRank}</div>
                <div className="text-xs text-gray-600">সাপ্তাহিক</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">#{userRanking.monthlyRank}</div>
                <div className="text-xs text-gray-600">মাসিক</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userRanking.totalPoints}</div>
                <div className="text-xs text-gray-600">মোট পয়েন্ট</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'global', label: '🌍 সর্বমোট', icon: '🏆' },
            { id: 'weekly', label: '📅 সাপ্তাহিক', icon: '🔥' },
            { id: 'monthly', label: '📆 মাসিক', icon: '⭐' },
            { id: 'challenges', label: '⚔️ চ্যালেঞ্জ', icon: '🎯' },
            { id: 'notifications', label: '🔔 বিজ্ঞপ্তি', icon: '📢' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-responsive-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'global' && (
          <div>
            {/* Sort Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { value: 'totalPoints', label: 'পয়েন্ট' },
                { value: 'streak', label: 'ধারাবাহিকতা' },
                { value: 'level', label: 'লেভেল' },
                { value: 'achievements', label: 'অর্জন' }
              ].map(sort => (
                <button
                  key={sort.value}
                  onClick={() => setSortBy(sort.value)}
                  className={`px-3 py-1 rounded-md text-responsive-xs font-semibold transition-colors ${
                    sortBy === sort.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchLeaderboard} />
              ) : leaderboardData.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-gray-600 mb-2">No leaderboard data available</p>
                  <p className="text-responsive-xs text-gray-500">Start playing to appear on the leaderboard!</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">র‍্যাঙ্ক</th>
                          <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">খেলোয়াড়</th>
                          <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">পয়েন্ট</th>
                          <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">ধারাবাহিকতা</th>
                          <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">লেভেল</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.map((player, index) => (
                          <tr key={player.username} className="border-t border-gray-100 hover:bg-gray-50 leaderboard-row">
                            <td className="px-4 py-3">
                              <AnimatedMedal rank={index + 1}>
                                <TrophyIcon rank={index + 1} />
                              </AnimatedMedal>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-responsive-xs rank-badge">
                                  {player.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-responsive-sm">{player.username}</span>
                                {player.username === profile?.username && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-responsive-xs font-bold user-highlight">
                                    আপনি
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-responsive-sm">{player.totalPoints}</td>
                            <td className="px-4 py-3 text-responsive-sm">{player.currentStreak} 🔥</td>
                            <td className="px-4 py-3 text-responsive-sm">{player.maxLevel + 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-responsive-xs"
                    >
                      আগের
                    </button>
                                          <span className="text-responsive-xs text-gray-600">পৃষ্ঠা {page}</span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!hasNextPage}
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-responsive-xs"
                    >
                      পরের
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Weekly/Monthly Competition */}
        {(activeTab === 'weekly' || activeTab === 'monthly') && (
          <div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4 border border-green-200">
              <h3 className="font-bold text-gray-800 mb-2">
                {activeTab === 'weekly' ? '🔥 Weekly Competition' : '⭐ Monthly Competition'}
              </h3>
              <p className="text-responsive-xs text-gray-600">
                {activeTab === 'weekly' 
                  ? 'Compete with players worldwide in weekly challenges!' 
                  : 'Monthly leaderboard with special rewards for top performers!'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage message={error} onRetry={fetchLeaderboard} />
              ) : leaderboardData.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-gray-600">No competition data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">Rank</th>
                        <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">Player</th>
                        <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">
                          {activeTab === 'weekly' ? 'Weekly Points' : 'Monthly Points'}
                        </th>
                        <th className="px-4 py-3 text-left text-responsive-xs font-semibold text-gray-700">
                          {activeTab === 'weekly' ? 'Weekly Streak' : 'Monthly Streak'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((player, index) => (
                        <tr key={player.username} className="border-t border-gray-100 hover:bg-gray-50 leaderboard-row">
                          <td className="px-4 py-3">
                            <AnimatedMedal rank={index + 1}>
                              <TrophyIcon rank={index + 1} />
                            </AnimatedMedal>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-responsive-xs rank-badge">
                                {player.username.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-responsive-sm">{player.username}</span>
                              {player.username === profile?.username && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-responsive-xs font-bold user-highlight">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-responsive-sm">
                            {activeTab === 'weekly' ? player.weeklyPoints : player.monthlyPoints}
                          </td>
                          <td className="px-4 py-3 text-responsive-sm">
                            {activeTab === 'weekly' ? player.weeklyStreak : player.monthlyStreak} 🔥
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 