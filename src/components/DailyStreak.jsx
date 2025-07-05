import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import checkUserType from "../utils/checkUserType";

export default function DailyStreak({ isOpen, onClose }) {
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState("");
  const [pointsEarned, setPointsEarned] = useState(0);
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();

  // Use cached data from ProfileContext instead of making API calls
  const streakData = profile ? {
    currentStreak: profile.currentStreak || 0,
    longestStreak: profile.longestStreak || 0,
    totalPoints: profile.totalPoints || 0,
    hintPoints: profile.hintPoints || 0
  } : null;

  // Only make API call if we need to manually trigger daily streak check
  const checkDailyStreak = async () => {
    if (!user?.token || !profile?.username) return;

    try {
      const { username } = checkUserType(user.token);
      const response = await api.post(
        `/api/profile/${username}/daily-streak`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.status === 200) {
        const {
          message,
          pointsEarned,
          streakUpdated,
          profile: updatedProfile,
        } = response.data;

        if (streakUpdated) {
          setRewardMessage(message);
          setPointsEarned(pointsEarned);
          setShowReward(true);

          // Update local profile state
          setProfile({
            ...profile,
            currentStreak: updatedProfile.currentStreak,
            longestStreak: updatedProfile.longestStreak,
            totalPoints: updatedProfile.totalPoints,
            hintPoints: updatedProfile.hintPoints,
          });
        }
      }
    } catch (error) {
      console.error("Failed to check daily streak:", error);
    }
  };

  // Remove the useEffect that automatically calls API on modal open
  // The data is already cached in ProfileContext

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 max-w-sm mx-4 animate-bounce-in relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close daily streak modal"
        >
          ×
        </button>

        <div className="text-center">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-responsive-xl font-bold text-indigo-900 mb-2">
              🔥 Daily Streak
            </h2>
            <p className="text-responsive-sm text-gray-600">
              Come back daily to earn points and build your streak!
            </p>
          </div>

          {!streakData ? (
            <div className="py-8">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-responsive-sm text-gray-600">
                Loading your streak data...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Streak */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border-2 border-orange-200">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="text-responsive-lg font-bold text-orange-800 mb-1">
                  Current Streak
                </h3>
                <p className="text-responsive-2xl font-bold text-orange-600">
                  {streakData.currentStreak} days
                </p>
              </div>

              {/* Longest Streak */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-200">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-responsive-lg font-bold text-purple-800 mb-1">
                  Longest Streak
                </h3>
                <p className="text-responsive-2xl font-bold text-purple-600">
                  {streakData.longestStreak} days
                </p>
              </div>

              {/* Total Points */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 border-2 border-green-200">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="text-responsive-lg font-bold text-green-800 mb-1">
                  Total Points
                </h3>
                <p className="text-responsive-2xl font-bold text-green-600">
                  {streakData.totalPoints}
                </p>
              </div>

              {/* Hint Points */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4 border-2 border-blue-200">
                <div className="text-3xl mb-2">💎</div>
                <h3 className="text-responsive-lg font-bold text-blue-800 mb-1">
                  Hint Points
                </h3>
                <p className="text-responsive-2xl font-bold text-blue-600">
                  {streakData.hintPoints}
                </p>
              </div>

              {/* Daily Reward Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-responsive-sm font-semibold text-blue-800 mb-2">
                  💎 Daily Reward
                </h4>
                <p className="text-responsive-xs text-blue-700">
                  Earn <strong>10 points</strong> every day you play!
                </p>
              </div>

              {/* Manual Refresh Button */}
              <div className="mt-4">
                <button
                  onClick={checkDailyStreak}
                  className="btn btn-secondary btn-animated w-full text-responsive-sm"
                >
                  🔄 Refresh Streak
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="btn btn-primary btn-animated w-full text-responsive-base"
            >
              🎮 Continue Playing
            </button>
          </div>
        </div>
      </div>

      {/* Reward Animation Modal */}
      {showReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl animate-bounce-in max-w-sm mx-4 text-center">
            <div className="text-6xl mb-4 animate-pulse-pop">🎉</div>
            <h3 className="text-responsive-lg font-bold text-green-700 mb-2">
              Daily Reward Claimed!
            </h3>
            <p className="text-responsive-base text-gray-700 mb-4">
              {rewardMessage}
            </p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 mb-4">
              <p className="text-responsive-lg font-bold text-orange-700">
                +{pointsEarned} Points
              </p>
            </div>
            <button
              onClick={() => setShowReward(false)}
              className="btn btn-primary btn-animated w-full"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
