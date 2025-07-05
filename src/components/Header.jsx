import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import Achievements from "./Achievements";
import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";
import DailyStreak from "./DailyStreak";
import Leaderboard from "./Leaderboard";
import MarkdownRenderer from "./MarkdownRenderer";
import RequestHintPointsModal from "./RequestHintPointsModal";
import Rewards from "./Rewards";
import SettingsModal from "./SettingsModal";
import SurveyModal from "./SurveyModal";

// Zenith Icons
const ZenithMenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
  </svg>
);

export default function Header({
  buttonSoundOn,
  setButtonSoundOn,
  bgMusicOn,
  setBgMusicOn,
  levels,
  levelIndex,
  setLevelIndex,
  setExplanation,
  explanation,
  completedLevelIndex,
  showingExplanationForLevel,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showZenithMenu, setShowZenithMenu] = useState(false);
  const { user } = useAuth();
  const { profile, setProfile, userTransactions } = useProfile();
  const navigate = useNavigate();

  const [showDailyStreak, setShowDailyStreak] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const [showRequestHintForm, setShowRequestHintForm] = useState(false);

  // Helper to check if user has ultimate package
  const hasUltimatePackage = userTransactions?.some(
    (tx) => tx.selectedPackage === "ultimate"
  );

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfilePopover) {
        setShowProfilePopover(false);
      }
      if (showZenithMenu) {
        setShowZenithMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfilePopover, showZenithMenu]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("level");
    setProfile(null);
    setLevelIndex(0);
    setExplanation(false);
    setShowProfilePopover(false);
  }, [setProfile, setLevelIndex, setExplanation]);

  const handleLoginClick = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const switchToSignup = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }, []);

  const closeAuthModals = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(false);
  }, []);

  const handleWrongAnswersClick = () => {
    if (!user?.token || !profile?.username) return;

    if (hasUltimatePackage) {
      setShowWrongAnswers(true);
    } else {
      setShowRequestHintForm(true);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-white text-gray-900 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-2 sm:py-4 border-b border-gray-200 font-sans"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between w-full">
          {/* Row 1: Title and Level Selector */}
          <div className="flex items-center justify-between w-full sm:w-auto order-1 sm:order-none">
            <h1 className="text-lg sm:text-2xl font-bold text-blue-700 tracking-tight md:mr-3 lg:mr-3">
              Mojnu6 HSC
            </h1>
            <div className="sm:hidden">
              {/* Mobile Profile/Login and Zenith Menu */}
              <div className="flex items-center gap-2">
                {user?.token ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfilePopover(!showProfilePopover);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 font-bold hover:bg-gray-200 transition-all duration-200 text-sm"
                    >
                      <span>👤</span>
                    </button>
                    {showProfilePopover && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 z-50">
                        <div className="p-4">
                          <p className="font-bold text-gray-800">
                            {profile?.username}
                          </p>
                          <p className="text-sm text-gray-600">
                            হিন্ট পয়েন্ট: {profile?.hintPoints || 0}
                          </p>
                        </div>
                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            লগআউট
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all duration-200 text-sm"
                  >
                    <span>🔐</span>
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowZenithMenu(!showZenithMenu);
                    }}
                    className="p-2 rounded-md hover:bg-gray-200 transition-all duration-200"
                  >
                    <ZenithMenuIcon />
                  </button>
                  {showZenithMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 z-50">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowLeaderboard(true);
                            setShowZenithMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          🏆 লিডারবোর্ড
                        </button>
                        <button
                          onClick={() => {
                            setShowAchievements(true);
                            setShowZenithMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          🎖️ অর্জনসমূহ
                        </button>
                        <button
                          onClick={() => {
                            setShowRewards(true);
                            setShowZenithMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          🎁 পুরস্কার
                        </button>
                        <button
                          onClick={() => {
                            setShowDailyStreak(true);
                            setShowZenithMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          🔥 দৈনিক ধারাবাহিকতা
                        </button>
                        <button
                          onClick={() => {
                            setShowSettings(true);
                            setShowZenithMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          ⚙️ সেটিংস
                        </button>
                        <button
                          onClick={() => {
                            setShowSurvey(true);
                            setShowZenithMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          📊 Survey
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Level Selector and Wrong Answers */}
          <div className="flex items-center justify-between w-full mt-2 sm:mt-0 order-2 sm:order-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLevelsModal(true);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-100 border border-blue-200 font-semibold text-blue-700 text-base hover:bg-blue-200 focus:bg-blue-200 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-60"
              style={{ minWidth: "110px", letterSpacing: "0.01em" }}
            >
              <span className="text-lg">🎯</span>
              <span className="font-semibold">
                Level{" "}
                {(showingExplanationForLevel != null
                  ? showingExplanationForLevel
                  : levelIndex) + 1}
              </span>
              <svg
                className="w-5 h-5 text-blue-300 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {user?.token && (
              <button
                onClick={handleWrongAnswersClick}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 font-bold transition-all duration-200 text-sm md:mr-3 lg:mr-3"
                title="Your Wrong Answers"
              >
                <span>❌</span>
                <span className="hidden sm:inline">Your Wrong Answers</span>
                <span className="ml-1 bg-white text-red-600 rounded-full px-2 py-0.5 text-xs font-bold">
                  {profile?.wrongAnswers?.length || 0}
                </span>
              </button>
            )}
          </div>

          {/* Desktop Profile/Login and Zenith Menu */}
          <div className="hidden sm:flex items-center gap-4 order-3 sm:order-none">
            {/* User Stats Display - Medium and Large Devices */}
            {user?.token && (
              <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                {/* Hint Points */}
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">💎</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {profile?.hintPoints || 0}
                  </span>
                </div>

                {/* Total Points */}
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">⭐</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {profile?.totalPoints || 0}
                  </span>
                </div>

                {/* Max Level */}
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {profile?.maxLevel || 0}
                  </span>
                </div>
              </div>
            )}

            {user?.token ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfilePopover(!showProfilePopover);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 font-bold hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
                >
                  <span>👤</span>
                  <span className="hidden sm:inline">
                    {profile?.username || "User"}
                  </span>
                </button>
                {showProfilePopover && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <p className="font-bold text-gray-800">
                        {profile?.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        Hint Points: {profile?.hintPoints || 0}
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all duration-200 text-sm sm:text-base"
              >
                <span>🔐</span>
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowZenithMenu(!showZenithMenu);
                }}
                className="p-2 rounded-md hover:bg-gray-200 transition-all duration-200"
              >
                <ZenithMenuIcon />
              </button>
              {showZenithMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowLeaderboard(true);
                        setShowZenithMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      🏆 Leaderboard
                    </button>
                    <button
                      onClick={() => {
                        setShowAchievements(true);
                        setShowZenithMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      🎖️ Achievements
                    </button>
                    <button
                      onClick={() => {
                        setShowRewards(true);
                        setShowZenithMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      🎁 Rewards
                    </button>
                    <button
                      onClick={() => {
                        setShowDailyStreak(true);
                        setShowZenithMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      🔥 Daily Streak
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setShowZenithMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      ⚙️ Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowSurvey(true);
                        setShowZenithMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      📊 Survey
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={closeAuthModals}
          onSwitchToSignup={switchToSignup}
        />
      )}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={closeAuthModals}
          onSwitchToLogin={switchToLogin}
        />
      )}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          buttonSoundOn={buttonSoundOn}
          setButtonSoundOn={setButtonSoundOn}
          bgMusicOn={bgMusicOn}
          setBgMusicOn={setBgMusicOn}
          onLogout={handleLogout}
        />
      )}
      {showLevelsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-xl p-6 max-w-sm mx-4 rounded-2xl shadow-xl border border-white/20 max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowLevelsModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close levels modal"
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-center mb-4 text-gray-800">
              Select Level
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {levels?.map((level, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLevelIndex(index);
                    setExplanation(false);
                    setShowLevelsModal(false);
                  }}
                  disabled={index > profile?.maxLevel}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-bold ${
                    index === levelIndex
                      ? "bg-blue-500 text-white border-blue-500"
                      : index <= profile?.maxLevel
                      ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                  aria-label={`Select level ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showDailyStreak && (
        <DailyStreak
          isOpen={showDailyStreak}
          onClose={() => setShowDailyStreak(false)}
        />
      )}
      {showAchievements && (
        <Achievements
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
      {showRewards && (
        <Rewards isOpen={showRewards} onClose={() => setShowRewards(false)} />
      )}
      {showLeaderboard && (
        <Leaderboard
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      {showSurvey && (
        <SurveyModal
          isOpen={showSurvey}
          onClose={() => setShowSurvey(false)}
          token={user?.token}
        />
      )}

      {/* Wrong Answers Modal */}
      {showWrongAnswers && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 border-4 border-red-300 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowWrongAnswers(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
              aria-label="Close wrong answers modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
              Your Wrong Answers ({profile?.wrongAnswers?.length || 0})
            </h2>
            {profile?.wrongAnswers?.length > 0 ? (
              <>
                <ul className="space-y-4 mb-6">
                  {profile.wrongAnswers.map((wa, idx) => (
                    <li
                      key={idx}
                      className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 shadow"
                    >
                      <div className="font-semibold text-gray-800 mb-1">
                        Level {wa.levelNumber}
                      </div>
                      <div className="text-gray-700 mb-1">
                        <span className="font-bold">Q:</span>{" "}
                        <MarkdownRenderer
                          content={wa.question}
                          className="inline"
                          proseClassName="prose prose-sm max-w-none inline"
                        />
                      </div>
                      <div className="text-gray-600">
                        <span className="font-bold">A:</span>{" "}
                        <MarkdownRenderer
                          content={wa.answer}
                          className="inline"
                          proseClassName="prose prose-sm max-w-none inline"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={async () => {
                    if (!profile?.username) return;
                    try {
                      await api.patch(`/api/profile/${profile.username}`, {
                        wrongAnswers: [],
                      });
                      setProfile((prev) => ({ ...prev, wrongAnswers: [] }));
                      setShowWrongAnswers(false);
                    } catch (err) {
                      alert("Failed to empty wrong answers. Please try again.");
                    }
                  }}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition-colors mb-2"
                >
                  Empty Now all wrong Answer
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500">
                No wrong answers yet! 🎉
              </div>
            )}
          </div>
        </div>
      )}
      {/* Request Hint Points Modal */}
      <RequestHintPointsModal
        isOpen={showRequestHintForm}
        onClose={() => setShowRequestHintForm(false)}
        user={user}
        profile={profile}
        setProfile={setProfile}
      />
    </>
  );
}
