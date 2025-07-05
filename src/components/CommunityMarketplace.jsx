import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import playSound from "../utils/playSound";
import PuzzlePlayModal from "./PuzzlePlayModal";

export default function CommunityMarketplace() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [showPlayModal, setShowPlayModal] = useState(false);

  // Filters and pagination
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    sortBy: "rating",
    search: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch puzzles from marketplace
  const fetchPuzzles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/api/puzzles/marketplace?${params}`);

      if (response.data.success) {
        setPuzzles(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching puzzles:", err);
      setError("Failed to load puzzles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load puzzles on mount and filter changes
  useEffect(() => {
    fetchPuzzles();
  }, [fetchPuzzles]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Handle puzzle selection for playing
  const handlePlayPuzzle = (puzzle) => {
    if (!user?.token) {
      setError("Please log in to play puzzles");
      return;
    }
    setSelectedPuzzle(puzzle);
    setShowPlayModal(true);
    playSound("/sounds/button-sound.mp3");
  };

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    setShowPlayModal(false);
    setSelectedPuzzle(null);
    // Refresh puzzles to update stats
    fetchPuzzles();
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-orange-100 text-orange-800";
      case "Expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "HTTP":
        return "🌐";
      case "REST":
        return "🔄";
      case "API":
        return "🔌";
      case "Web Development":
        return "💻";
      case "Programming":
        return "⚡";
      case "Advanced":
        return "🚀";
      default:
        return "🧩";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            🧩 Community Puzzle Marketplace
          </h1>
          <p className="text-lg text-indigo-700">
            Discover, play, and rate puzzles created by the community
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Search puzzles..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📂 Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="HTTP">HTTP</option>
                <option value="REST">REST</option>
                <option value="API">API</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming">Programming</option>
                <option value="General">General</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) =>
                  handleFilterChange("difficulty", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="rating">Highest Rated</option>
                <option value="plays">Most Played</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>

            {/* Create Puzzle Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  if (!user?.token) {
                    setError("Please log in to create puzzles");
                    return;
                  }
                  navigate("/create-puzzle");
                }}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                ✨ Create Puzzle
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-indigo-700">Loading puzzles...</p>
          </div>
        )}

        {/* Error State */}
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

        {/* Puzzles Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {puzzles.map((puzzle) => (
                <div
                  key={puzzle._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Puzzle Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getCategoryIcon(puzzle.category)}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {puzzle.category}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                          puzzle.difficulty
                        )}`}
                      >
                        {puzzle.difficulty}
                      </span>
                    </div>

                    {/* Puzzle Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {puzzle.title}
                    </h3>

                    {/* Puzzle Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {puzzle.description}
                    </p>

                    {/* Puzzle Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {puzzle.rating?.average?.toFixed(1) || "0.0"}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {puzzle.plays || 0}
                        </span>
                      </div>
                      <span className="text-xs">
                        by {puzzle.creatorUsername}
                      </span>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => handlePlayPuzzle(puzzle)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      🎮 Play Puzzle
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.current} of {pagination.total}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Empty State */}
            {puzzles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧩</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No puzzles found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or be the first to create a puzzle!
                </p>
                <button
                  onClick={() => navigate("/create-puzzle")}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  ✨ Create First Puzzle
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Puzzle Play Modal */}
      {showPlayModal && selectedPuzzle && (
        <PuzzlePlayModal
          puzzle={selectedPuzzle}
          isOpen={showPlayModal}
          onClose={() => setShowPlayModal(false)}
          onComplete={handlePuzzleComplete}
        />
      )}
    </div>
  );
}
