import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useWebSocket } from "../hooks/useWebSocket";
import checkUserType from "../utils/checkUserType";
import playSound from "../utils/playSound";

export default function ChatRoom({ isOpen, onClose, roomId = "general" }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [helpQuestion, setHelpQuestion] = useState("");
  const [showHelpForm, setShowHelpForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { socket, isConnected } = useWebSocket();

  // Get user ID from token
  const getUserId = useCallback(() => {
    if (!user?.token) {
      console.log("No user token found");
      return null;
    }
    try {
      const { userId } = checkUserType(user.token);
      console.log("Extracted userId from token:", userId);
      return userId;
    } catch (error) {
      console.error("Error extracting user ID from token:", error);
      return null;
    }
  }, [user?.token]);

  // Debug function to log user info
  const logUserInfo = useCallback(() => {
    console.log("=== User Info Debug ===");
    console.log("User object:", user);
    console.log("Profile object:", profile);
    console.log("User token:", user?.token);
    if (user?.token) {
      try {
        const tokenInfo = checkUserType(user.token);
        console.log("Token info:", tokenInfo);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
    console.log("======================");
  }, [user, profile]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update connection status
  useEffect(() => {
    setConnectionStatus(isConnected ? "connected" : "connecting");
  }, [isConnected]);

  // Load existing messages when component mounts
  useEffect(() => {
    if (isOpen && roomId) {
      loadMessages();
    }
  }, [isOpen, roomId]);

  // Join/leave chat room when connection changes
  useEffect(() => {
    if (isConnected && socket && isOpen && user?.token && profile?.username) {
      // Debug user info
      logUserInfo();

      // Get the actual user ID from the token or profile
      const userId = getUserId();

      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      console.log("Joining chat room with:", {
        roomId,
        username: profile.username,
        userId,
      });

      // Join the chat room with user info
      socket.emit("join-chat-room", {
        roomId,
        username: profile.username,
        userId: userId,
      });

      // Listen for new messages
      socket.on("new-message", (message) => {
        setMessages((prev) => [...prev, message]);
        playSound("/sounds/button-sound.mp3");
      });

      // Listen for help requests
      socket.on("help-request", (message) => {
        setMessages((prev) => [...prev, message]);
        playSound("/sounds/button-sound.mp3");
      });

      // Listen for user join/leave notifications (IN_FUTURE)
      // socket.on("user-joined", (data) => {
      //   addSystemMessage(`${data.username} joined the chat 👋`);
      // });

      // socket.on("user-left", (data) => {
      //   addSystemMessage(`${data.username} left the chat 👋`);
      // });

      // Listen for online users updates
      socket.on("online-users", (users) => {
        setOnlineUsers(users);
      });

      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
      });

      // Listen for typing indicators
      socket.on("user-typing", (data) => {
        if (data.isTyping) {
          setTypingUsers((prev) => new Set(prev).add(data.username));
        } else {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(data.username);
            return newSet;
          });
        }
      });

      // Listen for errors
      socket.on("message-error", (error) => {
        setError(error.message);
      });

      socket.on("help-error", (error) => {
        setError(error.message);
      });

      return () => {
        // Leave the chat room
        socket.emit("leave-chat-room", roomId);

        // Clean up event listeners
        socket.off("new-message");
        socket.off("help-request");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("online-users");
        socket.off("online-users-updated");
        socket.off("user-typing");
        socket.off("message-error");
        socket.off("help-error");
      };
    }
  }, [
    isConnected,
    socket,
    isOpen,
    roomId,
    user?.token,
    profile?.username,
    getUserId,
    logUserInfo,
  ]);

  // Load messages from API
  const loadMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/chat/messages/${roomId}`);

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load chat messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  // Send message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !socket || !user?.token) {
      console.log("Send message validation failed:", {
        hasMessage: !!newMessage.trim(),
        hasSocket: !!socket,
        hasToken: !!user?.token,
      });
      return;
    }

    // Get the actual user ID from the token
    const userId = getUserId();

    if (!userId) {
      setError("User ID not found. Please try logging in again.");
      return;
    }

    const messageData = {
      roomId,
      userId: userId,
      username: profile?.username || "Anonymous",
      message: newMessage.trim(),
      messageType: "text",
    };

    console.log("Sending message with data:", messageData);

    socket.emit("send-message", messageData);
    setNewMessage("");
    setIsTyping(false);

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [newMessage, socket, user?.token, getUserId, profile?.username, roomId]);

  // Send help request
  const sendHelpRequest = useCallback(async () => {
    if (!helpQuestion.trim() || !socket || !user?.token) return;

    // Get the actual user ID from the token
    const userId = getUserId();

    if (!userId) {
      setError("User ID not found. Please try logging in again.");
      return;
    }

    const helpData = {
      roomId,
      userId: userId,
      username: profile?.username || "Anonymous",
      question: helpQuestion.trim(),
    };

    socket.emit("request-help", helpData);
    setHelpQuestion("");
    setShowHelpForm(false);
  }, [helpQuestion, socket, user?.token, getUserId, profile?.username, roomId]);

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      const userId = getUserId();
      socket?.emit("typing-start", {
        roomId,
        username: profile?.username || "Anonymous",
        userId: userId,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const userId = getUserId();
      socket?.emit("typing-stop", {
        roomId,
        username: profile?.username || "Anonymous",
        userId: userId,
      });
    }, 1000);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full h-full max-w-4xl max-h-full flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-5 border-b">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">💬</span>
              <h2 className="font-bold text-lg sm:text-xl">Chat Room</h2>
              <span className="ml-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ background: connectionStatus === 'connected' ? '#22c55e' : '#f59e42' }} />
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile: Show online users toggle */}
              <button 
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                className="sm:hidden text-gray-600 hover:text-gray-800 p-1"
              >
                <span className="text-lg">👥</span>
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl sm:text-2xl rounded-full p-1 transition">
                ×
              </button>
            </div>
          </div>
          
          {/* Mobile: Online Users Toggle */}
          {showOnlineUsers && (
            <div className="sm:hidden border-b bg-gray-50 p-3">
              <div className="font-semibold text-sm mb-2">Online Users</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {onlineUsers.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center">No users online</p>
                ) : (
                  onlineUsers.map((user) => (
                    <div
                      key={user.username}
                      className={`flex items-center gap-2 p-1 rounded text-xs ${user.username === profile?.username ? 'bg-blue-50' : 'bg-green-50'}`}
                    >
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{user.username}{user.username === profile?.username && ' (You)'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 bg-gray-50">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm sm:text-base">Loading messages...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                <button
                  onClick={loadMessages}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm sm:text-base">No messages yet. Start the conversation! 👋</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.username === profile?.username ? 'justify-end' : message.messageType === 'system' ? 'justify-center' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-2xl shadow transition-all duration-200
                        ${message.username === profile?.username ? 'bg-blue-100 text-blue-900' : message.messageType === 'system' ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-800'}
                        ${message.messageType === 'system' ? 'mx-auto' : ''}
                      `}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold">{message.username}</span>
                          <span className="text-[10px] text-gray-400">{message.formattedTime}</span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                      </div>
                    </div>
                  ))
                )}
                {/* Typing indicators */}
                {typingUsers.size > 0 && (
                  <div className="p-1 bg-gray-50">
                    <p className="text-xs sm:text-sm text-gray-600 italic">
                      {Array.from(typingUsers).join(", ")} {typingUsers.size === 1 ? "is" : "are"} typing...
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input */}
          <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row gap-2 bg-white">
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={handleTyping}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-full px-3 sm:px-4 py-2 border border-gray-200 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                maxLength="500"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="bg-blue-600 text-white rounded-full px-3 sm:px-5 py-2 font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                Send
              </button>
            </div>
            <button
              onClick={() => setShowHelpForm(!showHelpForm)}
              className="border border-orange-400 text-orange-600 rounded-full px-3 sm:px-4 py-2 font-bold hover:bg-orange-100 transition text-sm"
            >
              🤔 Help
            </button>
          </div>
          
          {/* Help Request Form */}
          {showHelpForm && (
            <div className="p-3 sm:p-4 border-t border-orange-200 bg-orange-50 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={helpQuestion}
                  onChange={(e) => setHelpQuestion(e.target.value)}
                  placeholder="What do you need help with?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  onKeyPress={(e) => e.key === "Enter" && sendHelpRequest()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={sendHelpRequest}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-sm"
                  >
                    Ask for Help
                  </button>
                  <button
                    onClick={() => setShowHelpForm(false)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
            </div>
          )}
        </div>
        
        {/* Desktop: Online Users Sidebar */}
        <div className="hidden sm:flex w-64 bg-gray-50 border-l flex-col">
          <div className="p-4 border-b font-semibold">Online Users</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {onlineUsers.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                No users online
              </p>
            ) : (
              onlineUsers.map((user) => (
                  <div
                  key={user.username}
                  className={`flex items-center gap-2 p-2 rounded-lg ${user.username === profile?.username ? 'bg-blue-50' : 'bg-green-50'}`}
                  >
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{user.username}{user.username === profile?.username && ' (You)'}</span>
                  </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
