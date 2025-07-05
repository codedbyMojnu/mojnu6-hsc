import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

// Achievement data (same as server config)
const ACHIEVEMENTS = {
  FIRST_LOGIN: {
    id: "FIRST_LOGIN",
    name: "Welcome!",
    description: "Complete your first login",
    icon: "👋",
    points: 5,
    category: "First Steps",
  },
  FIRST_LEVEL: {
    id: "FIRST_LEVEL",
    name: "Getting Started",
    description: "Complete your first level",
    icon: "🎯",
    points: 10,
    category: "First Steps",
  },
  STREAK_3: {
    id: "STREAK_3",
    name: "On Fire!",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    points: 15,
    category: "Streaks",
  },
  STREAK_7: {
    id: "STREAK_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    points: 25,
    category: "Streaks",
  },
  STREAK_30: {
    id: "STREAK_30",
    name: "Dedication Master",
    description: "Maintain a 30-day streak",
    icon: "👑",
    points: 100,
    category: "Streaks",
  },
  LEVEL_5: {
    id: "LEVEL_5",
    name: "Puzzle Explorer",
    description: "Complete 5 levels",
    icon: "🧩",
    points: 20,
    category: "Levels",
  },
  LEVEL_10: {
    id: "LEVEL_10",
    name: "Puzzle Master",
    description: "Complete 10 levels",
    icon: "🏆",
    points: 50,
    category: "Levels",
  },
  POINTS_100: {
    id: "POINTS_100",
    name: "Point Collector",
    description: "Earn 100 total points",
    icon: "⭐",
    points: 30,
    category: "Points",
  },
  POINTS_500: {
    id: "POINTS_500",
    name: "Point Hunter",
    description: "Earn 500 total points",
    icon: "💎",
    points: 75,
    category: "Points",
  },
  HINT_MASTER: {
    id: "HINT_MASTER",
    name: "Hint Master",
    description: "Use hints on 5 different levels",
    icon: "💡",
    points: 25,
    category: "Skills",
  },
  PERFECT_STREAK: {
    id: "PERFECT_STREAK",
    name: "Perfect Streak",
    description: "Complete 5 levels without using hints",
    icon: "🌟",
    points: 50,
    category: "Special",
  },
  CONSISTENT_100: {
    id: "CONSISTENT_100",
    name: "Job Interview Ready!",
    description: "Consistently answer 100 levels correctly without a wrong answer.",
    icon: "💼",
    points: 200,
    category: "Consistency",
  },
  CONSISTENT_500: {
    id: "CONSISTENT_500",
    name: "Genius!",
    description: "Consistently answer 500 levels correctly without a wrong answer.",
    icon: "🧠",
    points: 1000,
    category: "Consistency",
  },
  CONSISTENT_1000: {
    id: "CONSISTENT_1000",
    name: "Awesome! Mojnu6 wants to meet you!",
    description: "Consistently answer 1000 levels correctly without a wrong answer. mojnu6: thisismojnu@gmail.com",
    icon: "🌟",
    points: 3000,
    category: "Consistency",
  },
  CONSISTENT_1500: {
    id: "CONSISTENT_1500",
    name: "Consistency Pro!",
    description: "Consistently answer 1500 levels correctly without a wrong answer.",
    icon: "🏅",
    points: 4000,
    category: "Consistency",
  },
  CONSISTENT_2000: {
    id: "CONSISTENT_2000",
    name: "Consistency Master!",
    description: "Consistently answer 2000 levels correctly without a wrong answer.",
    icon: "🥇",
    points: 5000,
    category: "Consistency",
  },
  CONSISTENT_5000: {
    id: "CONSISTENT_5000",
    name: "Legendary Consistency!",
    description: "Consistently answer 5000 levels correctly without a wrong answer.",
    icon: "🏆",
    points: 12000,
    category: "Consistency",
  },
  CONSISTENT_10000: {
    id: "CONSISTENT_10000",
    name: "Unstoppable!",
    description: "Consistently answer 10,000 levels correctly without a wrong answer.",
    icon: "🚀",
    points: 25000,
    category: "Consistency",
  },
  CONSISTENT_20000: {
    id: "CONSISTENT_20000",
    name: "Superhuman!",
    description: "Consistently answer 20,000 levels correctly without a wrong answer.",
    icon: "🤖",
    points: 50000,
    category: "Consistency",
  },
  CONSISTENT_50000: {
    id: "CONSISTENT_50000",
    name: "God Mode!",
    description: "Consistently answer 50,000 levels correctly without a wrong answer.",
    icon: "👑",
    points: 150000,
    category: "Consistency",
  },
};

export default function Achievements({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const { user } = useAuth();
  const { profile } = useProfile();

  // Group achievements by category
  const categories = [
    "All",
    "First Steps",
    "Streaks",
    "Levels",
    "Points",
    "Skills",
    "Special",
    "Consistency",
  ];

  const filteredAchievements =
    selectedCategory === "All"
      ? Object.values(ACHIEVEMENTS)
      : Object.values(ACHIEVEMENTS).filter(
          (a) => a.category === selectedCategory
        );

  const unlockedCount = profile?.achievements?.length || 0;
  const totalCount = Object.keys(ACHIEVEMENTS).length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  const isUnlocked = (achievementId) => {
    return profile?.achievements?.includes(achievementId) || false;
  };

  const handleAchievementClick = (achievement) => {
    if (isUnlocked(achievement.id)) {
      setUnlockedAchievement(achievement);
      setShowUnlockAnimation(true);
      setTimeout(() => setShowUnlockAnimation(false), 3000);
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
            🏆 Achievements
          </h2>
          <p className="text-responsive-sm text-gray-600 mb-4">
            Unlock badges and earn points for your accomplishments!
          </p>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-responsive-sm text-gray-600">
            {unlockedCount} of {totalCount} achievements unlocked (
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

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            return (
              <div
                key={achievement.id}
                onClick={() => handleAchievementClick(achievement)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:shadow-lg hover:scale-105"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-4xl mb-2 ${
                      unlocked ? "animate-pulse-pop" : "grayscale"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <h3
                    className={`text-responsive-sm font-bold mb-1 ${
                      unlocked ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {achievement.name}
                  </h3>
                  <p
                    className={`text-responsive-xs mb-2 ${
                      unlocked ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-responsive-xs font-semibold ${
                      unlocked
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span>⭐</span>
                    <span>{achievement.points} pts</span>
                  </div>
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

      {/* Achievement Unlock Animation */}
      {showUnlockAnimation && unlockedAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl animate-bounce-in max-w-sm mx-4 text-center">
            <div className="text-6xl mb-4 animate-pulse-pop">🎉</div>
            <h3 className="text-responsive-lg font-bold text-green-700 mb-2">
              Achievement Unlocked!
            </h3>
            <div className="text-4xl mb-4">{unlockedAchievement.icon}</div>
            <h4 className="text-responsive-base font-bold text-gray-800 mb-2">
              {unlockedAchievement.name}
            </h4>
            <p className="text-responsive-sm text-gray-600 mb-4">
              {unlockedAchievement.description}
            </p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 mb-4">
              <p className="text-responsive-base font-bold text-orange-700">
                +{unlockedAchievement.points} Points
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
