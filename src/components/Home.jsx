import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLevels } from "../context/LevelContext";
import { useProfile } from "../context/ProfileContext.jsx";
import playSound from "../utils/playSound.jsx";
import AnimatedBackground from "./AnimatedBackground";
import AnswerForm from "./AnswerForm";
import LoginModal from "./auth/LoginModal";
import SignupModal from "./auth/SignupModal";
import ChatRoom from "./ChatRoom";
import Confetti from "./Confetti";
import Explanation from "./Explanation";
import Header from "./Header";
import WelcomeToGame from "./WelcomeToGame.jsx";

export default function Home() {
  const [welcome, setWelcome] = useState(true);
  const [explanation, setExplanation] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [buttonSoundOn, setButtonSoundOn] = useState(false);
  const [bgMusicOn, setBgMusicOn] = useState(false);
  const [mark, setMark] = useState("");
  const [maxLevel, setMaxLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasInitializedLevel, setHasInitializedLevel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [completedLevelIndex, setCompletedLevelIndex] = useState(null);
  const [streakCount, setStreakCount] = useState(0);
  const [streaksAchieved, setStreaksAchieved] = useState(0);
  const [showStreakCongrats, setShowStreakCongrats] = useState(false);
  const [streakCongratsMsg, setStreakCongratsMsg] = useState("");
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [consistencyStreak, setConsistencyStreak] = useState(0);
  const [achievementNotification, setAchievementNotification] = useState(null);

  const bgMusicRef = useRef();
  const { levels, setLevels } = useLevels();
  const { profile, setProfile } = useProfile();
  const { user } = useAuth();

  const congratsMessages = [
    "🎉 Wow! 10 in a row! You're on fire! 🔥",
    "🚀 10 perfect answers! Keep soaring!",
    "🌟 10/10! Genius mode activated!",
    "👏 10 streak! You're unstoppable!",
    "🥳 10 flawless answers! Celebrate!",
    "🦸 10 correct! Superhero brain!",
    "💡 10 in a row! Brainpower overload!",
    "🏆 10 streak! Champion!",
    "🎊 10/10! Party time!",
    "😎 10 correct! Cool and clever!",
  ];

  // Consistency achievement thresholds and their corresponding achievement IDs and points
  const CONSISTENCY_ACHIEVEMENTS = [
    { threshold: 100, id: "CONSISTENT_100", points: 200 },
    { threshold: 500, id: "CONSISTENT_500", points: 1000 },
    { threshold: 1000, id: "CONSISTENT_1000", points: 3000 },
    { threshold: 1500, id: "CONSISTENT_1500", points: 4000 },
    { threshold: 2000, id: "CONSISTENT_2000", points: 5000 },
    { threshold: 5000, id: "CONSISTENT_5000", points: 12000 },
    { threshold: 10000, id: "CONSISTENT_10000", points: 25000 },
    { threshold: 20000, id: "CONSISTENT_20000", points: 50000 },
    { threshold: 50000, id: "CONSISTENT_50000", points: 150000 },
  ];

  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/levels");
      if (response.status === 200) {
        setLevels(response.data);
      } else {
        throw new Error("Failed to fetch levels");
      }
    } catch (err) {
      console.error("Error fetching levels:", err);
      setError("Failed to load game levels. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setLevels]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  useEffect(() => {
    if (bgMusicOn) {
      try {
        const bg = new Audio("/sounds/bg-music.mp3");
        bg.loop = true;
        bg.volume = 0.06;
        bg.play().catch(console.warn);
        bgMusicRef.current = bg;
      } catch (error) {
        console.error("Error setting up background music:", error);
        setBgMusicOn(false);
      }
    }
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, [bgMusicOn]);

  useEffect(() => {
    if (!hasInitializedLevel && profile?.maxLevel > 0) {
      setLevelIndex(profile.maxLevel);
      setMaxLevel(profile.maxLevel);
      setHasInitializedLevel(true);
    }
  }, [profile?.maxLevel, hasInitializedLevel]);

  const updateMaxLevel = useCallback(
    async (level) => {
      if (!user?.token || !profile?.username) return;
      try {
        const response = await api.patch(
          `/api/profile/${profile.username}`,
          { maxLevel: level },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (response?.status === 200) {
          setMaxLevel(response.data.profile.maxLevel);
        }
      } catch (error) {
        console.error("Failed to update max level:", error);
      }
    },
    [user?.token, profile?.username]
  );

  // Utility to normalize answers for intelligent comparison
  function normalizeAnswer(str) {
    if (!str) return "";
    return str
      .toLowerCase() // case-insensitive
      .replace(/\s+/g, "") // remove all whitespace
      .replace(/;/g, "") // ignore semicolons
      .replace(/\r?\n|\r/g, ""); // remove newlines (if any left)
  }

  const handleSubmitAnswer = useCallback(
    async (userAnswer, level) => {
      if (normalizeAnswer(level.answer) === normalizeAnswer(userAnswer)) {
        playSound("/sounds/right.mp3", 0.25);
        setMark("✔️");
        setStreakCount((prev) => {
          const newStreak = prev + 1;
          // Consistency streak logic
          setConsistencyStreak((prevConsistent) => {
            const newConsistent = prevConsistent + 1;
            // Check for new achievements
            for (const ach of CONSISTENCY_ACHIEVEMENTS) {
              if (
                newConsistent === ach.threshold &&
                (!profile?.achievements ||
                  !profile.achievements.includes(ach.id))
              ) {
                // Unlock achievement and add points
                const updatedAchievements = [
                  ...(profile?.achievements || []),
                  ach.id,
                ];
                const updatedPoints = (profile?.totalPoints || 0) + ach.points;
                setProfile((prevProfile) => ({
                  ...prevProfile,
                  achievements: updatedAchievements,
                  totalPoints: updatedPoints,
                }));
                setAchievementNotification({
                  icon: ach.id === "CONSISTENT_1000" ? "🌟" : ach.icon,
                  name: ach.name,
                  points: ach.points,
                });
                setTimeout(() => setAchievementNotification(null), 4000);
                if (profile?.username && user?.token) {
                  api.patch(
                    `/api/profile/${profile.username}`,
                    {
                      achievements: updatedAchievements,
                      totalPoints: updatedPoints,
                    },
                    { headers: { Authorization: `Bearer ${user.token}` } }
                  );
                }
              }
            }
            return newConsistent;
          });
          if (newStreak === 10) {
            setStreaksAchieved((prevStreaks) => {
              const newStreaks = prevStreaks + 1;
              if (newStreaks === 10) {
                setTimeout(() => {
                  setShowSecretMessage(true);
                  setConfettiTrigger(true);
                  playSound("/sounds/congratulations.mp3", 0.6);
                }, 500);
                return 0; // reset streaksAchieved after secret message
              } else {
                setTimeout(() => {
                  setStreakCongratsMsg(
                    congratsMessages[
                      Math.floor(Math.random() * congratsMessages.length)
                    ]
                  );
                  setShowStreakCongrats(true);
                  setConfettiTrigger(true);
                  playSound("/sounds/right.mp3", 0.7);
                }, 500);
                return newStreaks;
              }
            });
            return 0; // reset streak
          }
          return newStreak;
        });
        // Only update maxLevel in backend, do not update levelIndex here
        if (levelIndex >= maxLevel) {
          updateMaxLevel(levelIndex + 1);
        }
        setTimeout(() => {
          setCompletedLevelIndex(levelIndex);
          setExplanation(true);
          setMark("");
          // Scroll to top when showing explanation
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
      } else {
        playSound("/sounds/wrong.mp3");
        setMark("❌");
        setStreakCount(0); // reset streak on wrong answer
        setStreaksAchieved(0); // reset streaksAchieved on wrong answer
        setConsistencyStreak(0); // reset consistency streak on wrong answer

        // Add wrong answer to profile if logged in
        if (profile?.username && user?.token) {
          const wrongAnswer = {
            question: level.question,
            options: level.options,
            hint: level.hint,
            answer: level.answer,
            explanation: level.explanation,
            category: level.category,
            levelNumber: levelIndex + 1,
          };
          try {
            const response = await api.patch(
              `/api/profile/${profile.username}/wrong-answer`,
              { wrongAnswer },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            if (response.status === 200 && response.data?.profile) {
              setProfile(response.data.profile);
            } else {
              // fallback: update local wrongAnswers
              setProfile((prev) => ({
                ...prev,
                wrongAnswers: [...(prev.wrongAnswers || []), wrongAnswer],
              }));
            }
          } catch (err) {
            // fallback: update local wrongAnswers
            setProfile((prev) => ({
              ...prev,
              wrongAnswers: [...(prev.wrongAnswers || []), wrongAnswer],
            }));
          }
        }

        setTimeout(() => setMark(""), 1500);
      }
    },
    [levelIndex, maxLevel, updateMaxLevel, profile, setProfile, user?.token]
  );

  const handleExplationNextButtonClick = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setExplanation(false);
    setCompletedLevelIndex(null);
    const nextLevel = (completedLevelIndex ?? levelIndex) + 1;
    // If user just finished the last level, update maxLevel to levels.length
    if (nextLevel >= levels?.length) {
      if (maxLevel < levels.length) {
        updateMaxLevel(levels.length);
      }
      setShowCompletionModal(true);
    } else {
      setLevelIndex(nextLevel);
      // Scroll to top when moving to next level
      window.scrollTo({ top: 0, behavior: "smooth" });
      // If user just unlocked a new maxLevel, update maxLevel in backend as well
      if (nextLevel > maxLevel) {
        updateMaxLevel(nextLevel);
      }
    }
  }, [
    completedLevelIndex,
    levelIndex,
    levels?.length,
    maxLevel,
    updateMaxLevel,
  ]);

  const handleRestart = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setLevelIndex(0);
    setExplanation(false);
    setMark("");
    setShowCompletionModal(false);
    setCompletedLevelIndex(null);
  }, []);

  const handleShowLogin = useCallback(() => setShowLoginModal(true), []);
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

  // Close streak congrats modal
  const handleCloseStreakCongrats = () => {
    setShowStreakCongrats(false);
    setConfettiTrigger(false);
  };

  // Close secret message modal
  const handleCloseSecretMessage = () => {
    setShowSecretMessage(false);
    setConfettiTrigger(false);
    setStreaksAchieved(0); // reset after secret message
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <h2
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Loading mojnu6...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200 w-full max-w-xs mx-auto">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-700 mb-3">{error}</p>
          <button
            onClick={fetchLevels}
            className="w-full py-2 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-white relative overflow-hidden font-sans"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Achievement Notification */}
      {achievementNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow z-50 flex items-center gap-3 animate-fade-in">
          <span className="text-2xl">{achievementNotification.icon}</span>
          <span className="font-bold">{achievementNotification.name}</span>
          <span className="ml-2 text-yellow-200 font-semibold">
            +{achievementNotification.points} pts
          </span>
        </div>
      )}
      {/* Confetti for streak congrats */}
      <Confetti trigger={confettiTrigger} />
      {/* Animated Background for Game Mode (desktop only) */}
      {!welcome && (
        <div className="hidden sm:block">
          <AnimatedBackground />
        </div>
      )}

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - Only show when not in welcome mode */}
        {!welcome && (
          <Header
            buttonSoundOn={buttonSoundOn}
            setButtonSoundOn={setButtonSoundOn}
            bgMusicOn={bgMusicOn}
            setBgMusicOn={setBgMusicOn}
            levels={levels}
            levelIndex={levelIndex}
            setLevelIndex={setLevelIndex}
            setExplanation={setExplanation}
            explanation={explanation}
            completedLevelIndex={completedLevelIndex}
            showingExplanationForLevel={completedLevelIndex}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 w-full">
          {welcome ? (
            <WelcomeToGame
              setBgMusicOn={setBgMusicOn}
              setWelcome={setWelcome}
            />
          ) : (
            <div className="w-full max-w-2xl mx-auto">
              {levelIndex < levels?.length ? (
                !explanation ? (
                  <AnswerForm
                    onAnswer={handleSubmitAnswer}
                    mark={mark}
                    levelIndex={levelIndex}
                    showLogin={handleShowLogin}
                    onRestart={handleRestart}
                  />
                ) : (
                  <Explanation
                    onNext={handleExplationNextButtonClick}
                    levelIndex={completedLevelIndex}
                    onRestart={handleRestart}
                    isLastLevel={completedLevelIndex === levels.length - 1}
                  />
                )
              ) : (
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    🎉 Congratulations! 🎉
                  </h2>
                  <p className="text-base text-gray-700 mb-4">
                    You've completed all levels. Do you want to restart from
                    level 1? <br />
                    (This will not reset your maxLevel or achievements.)
                  </p>
                  <button
                    onClick={handleRestart}
                    className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Restart from Level 1
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Chat Room Button - Only show when not in welcome mode */}
        {!welcome && (
          <div className="fixed bottom-3 right-3 z-20 sm:bottom-4 sm:right-4">
            <button
              onClick={() => {
                if (!user?.token) {
                  setShowLoginModal(true);
                  return;
                }
                setShowChatRoom(true);
                playSound("/sounds/button-sound.mp3");
              }}
              className="bg-blue-500 text-white p-3 rounded-full sm:shadow-lg hover:bg-blue-700 transition-all duration-300 w-14 h-14 flex items-center justify-center"
              title="Chat Room"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 max-w-xs mx-4 rounded-lg text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-base text-gray-700 mb-4">
              You've completed all levels. Do you want to restart from level 1?{" "}
              <br />
              (This will not reset your maxLevel or achievements.)
            </p>
            <button
              onClick={handleRestart}
              className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-md hover:bg-blue-700 transition-colors"
            >
              Restart from Level 1
            </button>
          </div>
        </div>
      )}

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
      {showChatRoom && (
        <ChatRoom
          isOpen={showChatRoom}
          onClose={() => setShowChatRoom(false)}
        />
      )}

      {/* Streak Congratulations Modal */}
      {showStreakCongrats && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-2xl shadow-2xl p-8 max-w-xs mx-4 text-center border-4 border-yellow-300 animate-bounceIn">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">
              Congratulations!
            </h2>
            <p
              className="text-lg text-gray-800 mb-4 font-semibold"
              style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
            >
              {streakCongratsMsg}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Streaks achieved: {streaksAchieved}
            </p>
            <button
              onClick={handleCloseStreakCongrats}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {/* Secret Message Modal */}
      {showSecretMessage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center border-4 border-green-400 animate-bounceIn">
            <div className="text-6xl mb-2">🕵️‍♂️</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Secret Unlocked!
            </h2>
            <p
              className="text-lg text-gray-800 mb-4 font-semibold"
              style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
            >
              You are ready for a job interview!
              <br />
              Meet with mojnu6 <br />
              <span className="underline">thisismojnu@gmail.com</span>
            </p>
            <button
              onClick={handleCloseSecretMessage}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow hover:bg-green-800 transition-colors"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
