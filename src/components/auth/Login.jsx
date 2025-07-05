import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import checkUserType from "../../utils/checkUserType";
import playSound from "../../utils/playSound";
import api from "./../../api/index";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();

  const navigate = useNavigate();

  // Enhanced form submission with better error handling
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Clear previous errors
      setError("");

      // Validation
      if (!userName.trim() || !password.trim()) {
        setError("Please fill in all fields");
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

          const { role } = checkUserType(response?.data?.token);
          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "user") {
            navigate("/");
          }
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(
          err.response?.data?.message ||
            "Invalid username or password. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userName, password, setUser, navigate]
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

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-images/notepad.png')" }}
    >
      <div className="w-full max-w-sm mx-4">
        <div className="card sm:p-6 relative animate-fade-in h-[calc(100vh-2rem)] max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="text-center mt-2">
            <h2 className="text-responsive-xl sm:text-2xl font-bold text-purple-700">
              🔐 Login Now
            </h2>
            {/* Additional Info */}
            {!error && (
              <div className="mt-4 mb-2 p-4 rounded-lg border border-blue-200">
                <p className="text-responsive-xs text-blue-700 text-center">
                  💡 Create an account to save your progress and use hints!
                </p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-responsive-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col  p-4 space-y-4"
          >
            {/* Username Field */}
            <div>
              <label className="block text-responsive-sm font-semibold mb-2 text-gray-700">
                Username
              </label>
              <input
                name="username"
                value={userName}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="input"
                placeholder="Enter your username"
                type="text"
                disabled={isLoading}
                aria-label="Username"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-responsive-sm font-semibold mb-2 text-gray-700">
                Password
              </label>
              <input
                name="password"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="input"
                placeholder="Enter your password"
                type="password"
                disabled={isLoading}
                aria-label="Password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-responsive-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
              onClick={() => playSound("/sounds/button-sound.mp3")}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-responsive-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-purple-600 font-semibold hover:text-purple-700 underline transition-colors"
                onClick={() => playSound("/sounds/button-sound.mp3")}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
