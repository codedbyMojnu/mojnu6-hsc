import { useEffect, useState } from "react";
import api from "../api";

export default function SurveyModal({ isOpen, onClose, token }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [happyIfClosed, setHappyIfClosed] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [avgRating, setAvgRating] = useState(null);
  const [total, setTotal] = useState(0);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      api
        .get("/api/survey/summary", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAvgRating(res.data.avgRating);
          setTotal(res.data.total);
          // Check if user already submitted (by username in suggestions)
          if (
            res.data.suggestions &&
            res.data.suggestions.some((s) => s.user)
          ) {
            // This is a soft check; backend will enforce
          }
        });
      // Check if user already submitted (by trying to POST and catching 409)
      api
        .get("/api/survey/summary", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // If the user's username is in the survey list, they've taken it
          // This is a soft check; backend will enforce
        });
    }
  }, [isOpen, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rating || happyIfClosed === null) {
      setError("রেটিং এবং খুশি/না উত্তর দিন");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(
        "/api/survey",
        { rating, happyIfClosed, suggestion },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmitted(true);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAlreadySubmitted(true);
        setError("আপনি ইতিমধ্যে ফিডব্যাক দিয়োছো।");
      } else {
        setError("জমা দিতে সমস্যা হয়েছে");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;
  if (!token) return null;

  return (
    <div className="modal-overlay animate-fade-in z-50">
      <div className="modal-content p-6 max-w-md mx-4 animate-bounce-in relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close survey modal"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">
          📝 ফিডব্যাক / Survey
        </h2>
        {avgRating !== null && (
          <div className="text-center mb-2 text-sm text-gray-600">
            গড় রেটিং:{" "}
            <span className="font-bold text-yellow-600">{avgRating} / 5</span> (
            {total} জন)
          </div>
        )}
        {alreadySubmitted ? (
          <div className="text-center text-green-700 font-bold text-lg py-8">
            আপনি ইতিমধ্যে ফিডব্যাক দিয়েছেন।
          </div>
        ) : submitted ? (
          <div className="text-center text-green-700 font-bold text-lg py-8">
            ধন্যবাদ! তোমার মতামত গ্রহণ করা হয়েছে।
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold">
                ১। এই এপ্লিকেশনের ডিজাইনে তুমি কি সন্তষ্ট?
              </label>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <span
                      className={`text-3xl ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {rating ? `আপনার রেটিং: ${rating}/5` : ""}
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                ২। ভর্তি প্রস্তুতির এই App টি বন্ধ করে দিলে, তাহলে-
              </label>
              <div className="flex gap-4 justify-center">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="happyIfClosed"
                    value="true"
                    checked={happyIfClosed === true}
                    onChange={() => setHappyIfClosed(true)}
                  />
                  <span>খুশি হব</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="happyIfClosed"
                    value="false"
                    checked={happyIfClosed === false}
                    onChange={() => setHappyIfClosed(false)}
                  />
                  <span>খুশি হব না</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                ৩। তোমার পরামর্শ যদি থাকে, App নিয়ে কোনো সমস্যা পাইলে নিচে লিখো
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 min-h-[60px]"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="তোমার মতামত লিখ..."
                maxLength={300}
              />
              <div className="text-xs text-gray-400 text-right">
                {suggestion.length}/300
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-center text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "জমা হচ্ছে..." : "জমা দাও"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
