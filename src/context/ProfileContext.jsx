import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import checkUserType from "../utils/checkUserType";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export default function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    _id: "",
    username: "",
    hintPoints: 0,
    maxLevel: 0,
    takenHintLevels: [],
    // Daily streak fields
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    totalPoints: 0
  });
  const [userTransactions, setUserTransactions] = useState(null);
  const { user } = useAuth();
  const [error, setError] = useState("");

  // Function to fetch profile data
  const fetchProfile = async (username) => {
    try {
      const response = await api.get(`/api/profile/${username}`);
      if (response?.status === 200) {
        setProfile(response?.data);
        setError("");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Profile not found. Please contact support or try again.");
      } else {
        setError("An error occurred while fetching the profile. Please try again later.");
      }
    }
  };

  // Function to fetch user transactions
  const fetchTransactions = async (username) => {
    try {
      const response = await api.get(`/api/transactions/user/${username}`);
      setUserTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setUserTransactions([]);
    }
  };

  useEffect(() => {
    if (user?.token) {
      const { username } = checkUserType(user?.token);
      fetchProfile(username);
      fetchTransactions(username);

      // Automatically trigger daily streak update on login
      const updateDailyStreak = async () => {
        try {
          const response = await api.post(`/api/profile/${username}/daily-streak`, {}, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (response.status === 200 && response.data?.profile) {
            // If streak was updated, update local profile state
            setProfile((prev) => ({
              ...prev,
              currentStreak: response.data.profile.currentStreak,
              longestStreak: response.data.profile.longestStreak,
              totalPoints: response.data.profile.totalPoints,
              hintPoints: response.data.profile.hintPoints,
              achievements: response.data.profile.achievements,
              rewards: response.data.profile.rewards,
              lastPlayedDate: new Date(),
            }));
          }
        } catch (err) {
          // Ignore errors silently
        }
      };
      updateDailyStreak();

      // Set up polling every 15 seconds to check for profile updates
      const pollInterval = setInterval(() => {
        fetchProfile(username);
        fetchTransactions(username);
      }, 15000); // 15 seconds

      // Cleanup interval on unmount or when user changes
      return () => clearInterval(pollInterval);
    }
  }, [user?.token]);

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      setProfile, 
      userTransactions, 
      setUserTransactions, 
      error, 
      fetchProfile,
      fetchTransactions 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
