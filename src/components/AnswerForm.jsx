import { useCallback, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useLevels } from "../context/LevelContext";
import { useProfile } from "../context/ProfileContext";
import checkUserType from "../utils/checkUserType";
import MarkdownRenderer from "./MarkdownRenderer";
import Marker from "./Marker";

export default function AnswerForm({
  onAnswer,
  mark,
  levelIndex,
  showLogin,
  onRestart,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [inputError, setInputError] = useState("");
  const { levels } = useLevels();
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const [transactionId, setTransactionId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [showHintModal, setShowHintModal] = useState(false);

  const handleTextAnswer = useCallback(async () => {
    const trimmedAnswer = userAnswer.trim();
    if (!trimmedAnswer) {
      setInputError("আপনার উত্তর লিখুন");
      return;
    }
    setInputError("");
    setIsSubmitting(true);
    try {
      await onAnswer(trimmedAnswer, levels[levelIndex]);
    } finally {
      setIsSubmitting(false);
    }
  }, [userAnswer, onAnswer, levels, levelIndex]);

  const handleOptionAnswer = useCallback(
    (option) => {
      setSelectedOption(option);
      onAnswer(option, levels[levelIndex]);
    },
    [onAnswer, levels, levelIndex]
  );

  const handleDecreaseHintPoints = useCallback(async () => {
    if (!profile?.username) return;

    try {
      const updatedProfileData = {
        ...profile,
        hintPoints: Math.max(0, profile.hintPoints - 25),
        takenHintLevels: [...(profile.takenHintLevels || []), levelIndex],
      };

      const response = await api.put(
        `/api/profile/${profile.username}`,
        updatedProfileData
      );

      if (response.status === 200) {
        setProfile(updatedProfileData);
      }
    } catch (error) {
      console.error("Failed to update hint points:", error);
    }
  }, [profile, levelIndex, setProfile]);

  const handleRequestPointsForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selectedPackage || !transactionId.trim()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const { username } = checkUserType(user?.token);
        const transactionData = {
          username,
          transactionId: transactionId.trim(),
          selectedPackage,
        };

        const response = await api.post("/api/transactions", transactionData, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        console.log("Transaction response:", response);

        if (response.statusText === "Created") {
          setShowRequestForm(false);
          setShowWaitModal(true);
          setTransactionId("");
          setSelectedPackage("");
          setTimeout(() => setShowSuccessNotification(false), 5000);
        }
      } catch (error) {
        console.error("Failed to submit transaction:", error);
        alert("Failed to submit transaction. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedPackage, transactionId, user?.token]
  );

  const handleHintClick = useCallback(() => {
    if (!user?.token) {
      showLogin();
      return;
    }

    const hasTakenHint = profile?.takenHintLevels?.includes(levelIndex);
    if (hasTakenHint) {
      setShowHintModal(true);
    } else {
      if (profile?.hintPoints > 24) {
        setShowHintModal(true);
        handleDecreaseHintPoints();
      } else {
        setShowHintModal(false);
        setShowRequestForm(true);
      }
    }
  }, [user?.token, showLogin, profile, levelIndex, handleDecreaseHintPoints]);

  const handleSkipClick = useCallback(() => {
    setShowSkipModal(true);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTextAnswer();
      }
    },
    [handleTextAnswer]
  );

  return (
    <div
      className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 font-sans"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="w-full bg-white rounded-lg p-3 sm:p-6 flex flex-col items-center justify-center text-gray-900 border border-gray-200">
        {levelIndex >= levels.length ? (
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">
              🎉 সব লেভেল সম্পূর্ণ!
            </h2>
            <p className="mb-3 text-base text-gray-700">
              আপনি সব প্রশ্ন শেষ করেছেন। আপনি কি লেভেল ১ থেকে আবার শুরু করতে
              চান?
            </p>
            <button
              onClick={onRestart}
              className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-md hover:bg-blue-700 transition-colors"
            >
              লেভেল ১ থেকে আবার শুরু করুন
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 w-full">
              <div className="bg-gray-50 w-full p-3 rounded-md border border-gray-200">
                <MarkdownRenderer
                  content={levels[levelIndex]?.question}
                  className="text-lg sm:text-xl font-bold text-gray-800"
                />
              </div>
            </div>

            {!levels[levelIndex]?.options?.length > 0 && (
              <div className="w-full mb-3">
                <input
                  type="text"
                  value={userAnswer}
                  placeholder="আপনার উত্তর..."
                  className={`w-full rounded-md px-4 py-3 text-base font-semibold bg-white border ${
                    inputError ? "border-red-500" : "border-gray-300"
                  } focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-800 placeholder-gray-500`}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {inputError && (
                  <p className="text-red-500 text-sm mt-1">{inputError}</p>
                )}
              </div>
            )}

            {levels[levelIndex]?.options?.length > 0 && (
              <div className="w-full mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                {levels[levelIndex]?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionAnswer(option)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white border border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800"
                  >
                    <span className="font-bold text-base text-blue-500">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <MarkdownRenderer content={option} className="text-base" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-row justify-center gap-2 w-full mb-4">
              <button
                type="button"
                onClick={handleSkipClick}
                className="flex-1 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 font-bold text-base text-gray-700 hover:bg-gray-200 transition-all duration-200"
              >
                <span>Skip</span>
              </button>
              <button
                type="button"
                onClick={handleHintClick}
                className="flex-1 px-3 py-2 rounded-md bg-yellow-100 border border-yellow-300 font-bold text-base text-yellow-800 hover:bg-yellow-200 transition-all duration-200"
              >
                <span>Hint</span>
              </button>
            </div>

            {!levels[levelIndex]?.options?.length > 0 && (
              <div className="w-full mt-auto">
                <button
                  type="button"
                  onClick={handleTextAnswer}
                  disabled={isSubmitting || !userAnswer.trim()}
                  className={`w-full py-3 rounded-md text-white font-bold text-lg transition-all duration-200 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-70
                ${
                  isSubmitting || !userAnswer.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Submit Answer <span className="ml-2">🚀</span>
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Mark Display */}
            {mark && (
              <div className="mt-3">
                <Marker mark={mark} />
              </div>
            )}

            {/* Hint Modal */}
            {showHintModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative border-2 border-yellow-200">
                  <button
                    onClick={() => setShowHintModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
                    aria-label="Close hint modal"
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold text-yellow-600 mb-4 flex items-center">
                    <span className="mr-2">💡</span>Hint
                  </h3>
                  {levels[levelIndex]?.hint ? (
                    <MarkdownRenderer
                      content={levels[levelIndex].hint}
                      className="text-yellow-800"
                    />
                  ) : (
                    <div className="text-yellow-800">
                      No hint available for this question.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Request Points Form */}
            {showRequestForm && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div
                  className="bg-white p-7 max-w-md mx-4 rounded-2xl shadow-2xl border-2 border-blue-200 w-full"
                  style={{ boxShadow: "0 8px 32px 0 rgba(80, 120, 255, 0.18)" }}
                >
                  <h3 className="text-2xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
                    <span className="text-3xl">💡</span> Request Hint Points
                  </h3>
                  <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <div className="text-base font-bold text-pink-700 mb-1">
                      Bkash Number:{" "}
                      <span className="font-mono">01788262433</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      Send Money to this and Submit your transaction.
                    </div>
                  </div>
                  <form
                    onSubmit={handleRequestPointsForm}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Select Package:
                      </label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-blue-900 font-semibold"
                        required
                      >
                        <option value="">Select a package</option>
                        <option value="basic">
                          Basic Package (100 points)
                        </option>
                        <option value="premium">
                          Premium Package (250 points)
                        </option>
                        <option value="ultimate">
                          Ultimate Package (500 points)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-blue-800 mb-2">
                        Transaction ID:
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter transaction ID"
                        className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-blue-900 font-semibold"
                        required
                      />
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Wait Modal */}
            {showWaitModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-xl p-6 max-w-sm mx-4 rounded-2xl shadow-xl border border-white/20 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Request Submitted!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your transaction is being reviewed. You'll receive your hint
                    points soon.
                  </p>
                  <button
                    onClick={() => setShowWaitModal(false)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {/* Skip Modal */}
            {showSkipModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white/95 backdrop-blur-xl p-6 max-w-sm mx-4 rounded-2xl shadow-xl border border-white/20 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Skip Level?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We are not allowd our user to skip a level!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSkipModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Notification */}
            {showSuccessNotification && (
              <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                Transaction submitted successfully!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
