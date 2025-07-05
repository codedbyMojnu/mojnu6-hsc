import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { puzzleAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import playSound from "../utils/playSound";

export default function PuzzleCreator() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    difficulty: "Beginner",
    question: "",
    options: ["", "", "", ""],
    answer: "",
    explanation: "",
    hint: "",
    tags: "",
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (error) setError("");
    },
    [error]
  );

  // Handle options change
  const handleOptionChange = useCallback((index, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Check if user is logged in
      if (!user?.token) {
        setError("You must be logged in to create puzzles");
        return;
      }

      // Validation
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.question.trim() ||
        !formData.answer.trim() ||
        !formData.explanation.trim() ||
        !formData.hint.trim()
      ) {
        setError("Please fill in all required fields");
        return;
      }

      // Check if at least one option is provided for multiple choice
      const hasOptions = formData.options.some(
        (option) => option.trim() !== ""
      );
      if (!hasOptions) {
        setError(
          "Please provide at least one option for multiple choice questions"
        );
        return;
      }

      setLoading(true);
      setError("");

      try {
        const puzzleData = {
          ...formData,
          options: formData.options.filter((option) => option.trim() !== ""),
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
        };

        const response = await puzzleAPI.createPuzzle(puzzleData, user.token);

        if (response.data.success) {
          setSuccess(true);
          playSound("/sounds/button-sound.mp3");

          // Redirect to community marketplace after 2 seconds
          setTimeout(() => {
            navigate("/community");
          }, 2000);
        }
      } catch (err) {
        console.error("Error creating puzzle:", err);
        setError(
          err.response?.data?.message ||
            "Failed to create puzzle. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [formData, user, navigate]
  );

  if (!user?.token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to create puzzles.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            ✨ Create Community Puzzle
          </h1>
          <p className="text-lg text-indigo-700">
            Share your knowledge and challenge the community
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-700 font-semibold">
                Puzzle created successfully! Redirecting to community...
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Puzzle Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter puzzle title"
                  maxLength="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="HTTP">HTTP</option>
                  <option value="REST">REST</option>
                  <option value="API">API</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Programming">Programming</option>
                  <option value="General">General</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Describe your puzzle"
                rows="3"
                maxLength="500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleChange("difficulty", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., http, api, rest"
                />
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => handleChange("question", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Enter your puzzle question"
                rows="4"
                required
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Multiple Choice Options (at least one required)
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={option}
                      checked={formData.answer === option}
                      onChange={(e) => handleChange("answer", e.target.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Select the radio button next to the correct answer
              </p>
            </div>

            {/* Answer for open-ended questions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correct Answer (for open-ended questions)
              </label>
              <input
                type="text"
                value={formData.answer}
                onChange={(e) => handleChange("answer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter the correct answer"
                required
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Explanation *
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => handleChange("explanation", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Explain why this is the correct answer"
                rows="4"
                required
              />
            </div>

            {/* Hint */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hint *
              </label>
              <textarea
                value={formData.hint}
                onChange={(e) => handleChange("hint", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Provide a helpful hint"
                rows="3"
                required
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleChange("isPublic", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Make puzzle public (visible in marketplace)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Puzzle...
                  </div>
                ) : (
                  "Create Puzzle"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/community")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
