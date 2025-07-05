import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import playSound from '../utils/playSound';

export default function PuzzlePlayModal({ puzzle, isOpen, onClose, onComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const { user } = useAuth();

  // Reset state when puzzle changes
  useEffect(() => {
    if (isOpen) {
      setSelectedAnswer('');
      setShowResult(false);
      setIsCorrect(false);
      setError(null);
      setShowReview(false);
      setReviewData({ rating: 5, comment: '' });
    }
  }, [isOpen, puzzle]);

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer.trim()) {
      setError('Please select an answer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/api/puzzles/${puzzle._id}/answer`, {
        answer: selectedAnswer
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (response.data.success) {
        setIsCorrect(response.data.isCorrect);
        setShowResult(true);
        playSound(response.data.isCorrect ? '/sounds/right.mp3' : '/sounds/wrong.mp3');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) {
      setError('Please provide a review comment');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/api/puzzles/${puzzle._id}/review`, {
        rating: reviewData.rating,
        comment: reviewData.comment
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (response.data.success) {
        setShowReview(false);
        onComplete();
        playSound('/sounds/button-sound.mp3');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle skip review
  const handleSkipReview = () => {
    setShowReview(false);
    onComplete();
  };

  if (!isOpen || !puzzle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🧩 {puzzle.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>by {puzzle.creatorUsername}</span>
                <span>•</span>
                <span>{puzzle.category}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  puzzle.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                  puzzle.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  puzzle.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {puzzle.difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showResult ? (
            /* Question Section */
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Question:
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {puzzle.question}
                </p>
              </div>

              {/* Options */}
              {puzzle.options && puzzle.options.length > 0 ? (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Select your answer:
                  </h4>
                  <div className="space-y-3">
                    {puzzle.options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAnswer === option
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedAnswer === option
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                /* Open-ended question */
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Your answer:
                  </h4>
                  <textarea
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitAnswer}
                disabled={loading || !selectedAnswer.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Checking Answer...
                  </div>
                ) : (
                  'Submit Answer'
                )}
              </button>
            </div>
          ) : (
            /* Result Section */
            <div>
              <div className={`text-center mb-6 p-6 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="text-4xl mb-2">
                  {isCorrect ? '🎉' : '😔'}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                <p className={`${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {isCorrect ? 'Great job! You got it right.' : 'Better luck next time!'}
                </p>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Explanation:
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {puzzle.explanation}
                  </p>
                </div>
              </div>

              {/* Hint */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  💭 Hint:
                </h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700 leading-relaxed">
                    {puzzle.hint}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReview(true)}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  ⭐ Rate & Review
                </button>
                <button
                  onClick={handleSkipReview}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Skip Review
                </button>
              </div>
            </div>
          )}

          {/* Review Section */}
          {showReview && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                ⭐ Rate this puzzle:
              </h4>
              
              {/* Rating Stars */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                    className={`text-2xl ${
                      star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({reviewData.rating}/5)
                </span>
              </div>

              {/* Review Comment */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your review (optional):
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about this puzzle..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="3"
                  maxLength="300"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {reviewData.comment.length}/300
                </div>
              </div>

              {/* Review Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => setShowReview(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 