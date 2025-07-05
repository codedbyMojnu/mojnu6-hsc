import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import checkUserType from "../../utils/checkUserType";
import playSound from "../../utils/playSound";
import api from "./../../api/index";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();

  // Enhanced form submission with better error handling
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Clear previous errors
      setError("");

      // Validation
      if (!userName.trim() || !password.trim()) {
        setError("সব ক্ষেত্র পূরণ করুন");
        return;
      }

      setIsLoading(true);

      try {
        const loginData = { username: userName.trim(), password };
        const response = await api.post("/api/auth/login", loginData);

        if (response.status === 200) {
          setUser({ token: response.data.token });
          setUserName("");
          setPassword("");
          onClose();

          const { role } = checkUserType(response?.data?.token);
          if (role === "admin") {
            navigate("/dashboard");
          }
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(
          err.response?.data?.message ||
            "ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড। আবার চেষ্টা করুন।"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userName, password, setUser, onClose]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (field, value) => {
      if (error) setError(""); // Clear error when user starts typing
      if (field === "username") {
        setUserName(value);
      } else if (field === "password") {
        setPassword(value);
      }
    },
    [error]
  );

  // Handle modal close
  const handleClose = useCallback(() => {
    setError("");
    setUserName("");
    setPassword("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 max-w-sm mx-4 animate-bounce-in relative">
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close login modal"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            🔐 স্বাগতম
          </h2>
          <p className="text-sm text-gray-600">
            আপনার প্রশ্ন সমাধানের যাত্রা চালিয়ে যেতে সাইন ইন করুন
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username or Email Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              ব্যবহারকারীর নাম
            </label>
            <input
              name="username"
              value={userName}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="input"
              placeholder="আপনার ব্যবহারকারীর নাম লিখুন"
              type="text"
              disabled={isLoading}
              aria-label="Username"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              পাসওয়ার্ড
            </label>
            <input
              name="password"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="input"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              type="password"
              disabled={isLoading}
              aria-label="Password"
              required
            />
            <div className="text-right mt-1">
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline focus:outline-none"
                onClick={() => setShowForgot(true)}
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => playSound("/sounds/button-sound.mp3")}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                সাইন ইন হচ্ছে...
              </div>
            ) : (
              "সাইন ইন"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-purple-600 font-semibold hover:text-purple-700 underline transition-colors"
            >
              অ্যাকাউন্ট তৈরি করুন
            </button>
          </p>
        </div>
        <ForgotPasswordModal
          isOpen={showForgot}
          onClose={() => setShowForgot(false)}
        />
      </div>
    </div>
  );
}
