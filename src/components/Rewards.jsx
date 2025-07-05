import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLevels } from "../context/LevelContext";
import { useProfile } from "../context/ProfileContext";

// Rewards data (same as server config)
const REWARDS = {
  LEVEL_COMPLETION: {
    FINISH_GAME: {
      id: "FINISH_GAME",
      name: "Win a T-Shirt",
      description: "Complete all levels in the game",
      icon: "👕",
      type: "level_completion",
      levelRequired: "all",
    },
    LEVEL_500: {
      id: "LEVEL_500",
      name: "Get a Notepad",
      description: "Complete 500 levels",
      icon: "📓",
      type: "level_completion",
      levelRequired: 500,
    },
    LEVEL_100: {
      id: "LEVEL_100",
      name: "Get a Pen",
      description: "Complete 100 levels",
      icon: "✒️",
      type: "level_completion",
      levelRequired: 100,
    },
    LEVEL_50: {
      id: "LEVEL_50",
      name: "Get a Sticker",
      description: "Complete 50 levels",
      icon: "🏷️",
      type: "level_completion",
      levelRequired: 50,
    },
    LEVEL_25: {
      id: "LEVEL_25",
      name: "Get a Keychain",
      description: "Complete 25 levels",
      icon: "🔑",
      type: "level_completion",
      levelRequired: 25,
    },
  },
  POINTS_EARNING: {
    POINTS_10000: {
      id: "POINTS_10000",
      name: "Win a T-Shirt",
      description: "Earn 10,000 total points",
      icon: "👕",
      type: "points_earning",
      pointsRequired: 10000,
    },
    POINTS_5000: {
      id: "POINTS_5000",
      name: "Get a Hoodie",
      description: "Earn 5,000 total points",
      icon: "🧥",
      type: "points_earning",
      pointsRequired: 5000,
    },
    POINTS_2000: {
      id: "POINTS_2000",
      name: "Get a Cap",
      description: "Earn 2,000 total points",
      icon: "🧢",
      type: "points_earning",
      pointsRequired: 2000,
    },
    POINTS_1000: {
      id: "POINTS_1000",
      name: "Get a Mug",
      description: "Earn 1,000 total points",
      icon: "☕",
      type: "points_earning",
      pointsRequired: 1000,
    },
    POINTS_500: {
      id: "POINTS_500",
      name: "Get a Notepad",
      description: "Earn 500 total points",
      icon: "📓",
      type: "points_earning",
      pointsRequired: 500,
    },
    POINTS_250: {
      id: "POINTS_250",
      name: "Get a Pencil",
      description: "Earn 250 total points",
      icon: "✏️",
      type: "points_earning",
      pointsRequired: 250,
    },
    POINTS_100: {
      id: "POINTS_100",
      name: "Get a Sticker",
      description: "Earn 100 total points",
      icon: "🏷️",
      type: "points_earning",
      pointsRequired: 100,
    },
  },
};

export default function Rewards({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedReward, setUnlockedReward] = useState(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { levels } = useLevels();

  // Group rewards by category
  const categories = ["All", "Level Completion", "Points Earning"];

  const getFilteredRewards = () => {
    if (selectedCategory === "All") {
      return {
        levelCompletion: Object.values(REWARDS.LEVEL_COMPLETION),
        pointsEarning: Object.values(REWARDS.POINTS_EARNING),
      };
    } else if (selectedCategory === "Level Completion") {
      return {
        levelCompletion: Object.values(REWARDS.LEVEL_COMPLETION),
        pointsEarning: [],
      };
    } else {
      return {
        levelCompletion: [],
        pointsEarning: Object.values(REWARDS.POINTS_EARNING),
      };
    }
  };

  const { levelCompletion, pointsEarning } = getFilteredRewards();

  const unlockedCount = profile?.rewards?.length || 0;
  const totalCount =
    Object.keys(REWARDS.LEVEL_COMPLETION).length +
    Object.keys(REWARDS.POINTS_EARNING).length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const isUnlocked = (rewardId) => {
    return profile?.rewards?.includes(rewardId) || false;
  };

  const handleRewardClick = (reward) => {
    if (isUnlocked(reward.id)) {
      setUnlockedReward(reward);
      setShowUnlockAnimation(true);
      setTimeout(() => setShowUnlockAnimation(false), 3000);
    }
  };

  const getProgressText = (reward) => {
    if (reward.type === "level_completion") {
      const current = profile?.maxLevel || 0;
      const required =
        reward.levelRequired === "all"
          ? levels?.length || 0
          : reward.levelRequired;
      return `${current}/${required} levels`;
    } else {
      const current = profile?.totalPoints || 0;
      const required = reward.pointsRequired;
      return `${current}/${required} points`;
    }
  };

  const getProgressPercentage = (reward) => {
    if (reward.type === "level_completion") {
      const current = profile?.maxLevel || 0;
      const required =
        reward.levelRequired === "all"
          ? levels?.length || 0
          : reward.levelRequired;
      return Math.min((current / required) * 100, 100);
    } else {
      const current = profile?.totalPoints || 0;
      const required = reward.pointsRequired;
      return Math.min((current / required) * 100, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 animate-bounce-in relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close login modal"
        >
          ×
        </button>

        <div className="text-center mb-6">
                  <h2 className="text-responsive-xl font-bold text-indigo-900 mb-2">
          🎁 বাস্তব পুরস্কার
        </h2>
        <p className="text-responsive-sm text-gray-600 mb-4">
          লেভেল সম্পূর্ণ করে এবং পয়েন্ট অর্জন করে বাস্তব পুরস্কার আনলক করুন!
        </p>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-responsive-sm text-gray-600">
            {unlockedCount} of {totalCount} rewards unlocked (
            {Math.round(progressPercentage)}%)
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-responsive-xs font-semibold transition-colors ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Level Completion Rewards */}
        {levelCompletion.length > 0 && (
          <div className="mb-8">
                    <h3 className="text-responsive-lg font-bold text-blue-800 mb-4 text-center">
          🎯 লেভেল সম্পূর্ণতার পুরস্কার
        </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelCompletion.map((reward) => {
                const unlocked = isUnlocked(reward.id);
                const progress = getProgressPercentage(reward);
                return (
                  <div
                    key={reward.id}
                    onClick={() => handleRewardClick(reward)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      unlocked
                        ? "bg-gradient-to-br from-blue-50 to-green-50 border-green-300 hover:shadow-lg hover:scale-105"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-4xl mb-2 ${
                          unlocked ? "animate-pulse-pop" : "grayscale"
                        }`}
                      >
                        {reward.icon}
                      </div>
                      <h3
                        className={`text-responsive-sm font-bold mb-1 ${
                          unlocked ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {reward.name}
                      </h3>
                      <p
                        className={`text-responsive-xs mb-3 ${
                          unlocked ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {reward.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            unlocked ? "bg-green-500" : "bg-blue-400"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p
                        className={`text-responsive-xs ${
                          unlocked ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {getProgressText(reward)}
                      </p>

                      {unlocked && (
                        <div className="mt-2 text-green-600 text-responsive-xs font-semibold">
                          ✓ Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Points Earning Rewards */}
        {pointsEarning.length > 0 && (
          <div className="mb-8">
                    <h3 className="text-responsive-lg font-bold text-purple-800 mb-4 text-center">
          ⭐ পয়েন্ট অর্জনের পুরস্কার
        </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pointsEarning.map((reward) => {
                const unlocked = isUnlocked(reward.id);
                const progress = getProgressPercentage(reward);
                return (
                  <div
                    key={reward.id}
                    onClick={() => handleRewardClick(reward)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      unlocked
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-pink-300 hover:shadow-lg hover:scale-105"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-4xl mb-2 ${
                          unlocked ? "animate-pulse-pop" : "grayscale"
                        }`}
                      >
                        {reward.icon}
                      </div>
                      <h3
                        className={`text-responsive-sm font-bold mb-1 ${
                          unlocked ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {reward.name}
                      </h3>
                      <p
                        className={`text-responsive-xs mb-3 ${
                          unlocked ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {reward.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            unlocked ? "bg-pink-500" : "bg-purple-400"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p
                        className={`text-responsive-xs ${
                          unlocked ? "text-pink-600" : "text-gray-500"
                        }`}
                      >
                        {getProgressText(reward)}
                      </p>

                      {unlocked && (
                        <div className="mt-2 text-pink-600 text-responsive-xs font-semibold">
                          ✓ Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="btn btn-primary btn-animated text-responsive-base"
          >
            🎮 Continue Playing
          </button>
        </div>
      </div>

      {/* Reward Unlock Animation */}
      {showUnlockAnimation && unlockedReward && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl animate-bounce-in max-w-sm mx-4 text-center">
            <div className="text-6xl mb-4 animate-pulse-pop">🎉</div>
            <h3 className="text-responsive-lg font-bold text-green-700 mb-2">
              Reward Unlocked!
            </h3>
            <div className="text-4xl mb-4">{unlockedReward.icon}</div>
            <h4 className="text-responsive-base font-bold text-gray-800 mb-2">
              {unlockedReward.name}
            </h4>
            <p className="text-responsive-sm text-gray-600 mb-4">
              {unlockedReward.description}
            </p>
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3 mb-4">
              <p className="text-responsive-base font-bold text-green-700">
                🎁 Physical Reward Available!
              </p>
            </div>
            <button
              onClick={() => setShowUnlockAnimation(false)}
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
