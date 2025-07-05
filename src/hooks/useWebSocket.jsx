import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import checkUserType from '../utils/checkUserType';

export function useWebSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: maxReconnectAttempts
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      
      // Manual reconnection logic
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          newSocket.connect();
        }, delay);
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed after', maxReconnectAttempts, 'attempts');
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
}

export const useWebSocketForProfileUpdate = (onProfileUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io('http://localhost:5000');

    // Get user token and username
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { username } = checkUserType(token);
        
        // Join user's personal room
        socketRef.current.emit('join-user-room', username);
        
        // Listen for profile updates
        socketRef.current.on('profile-updated', (updatedProfile) => {
          console.log('Profile updated via WebSocket:', updatedProfile);
          if (onProfileUpdate) {
            onProfileUpdate(updatedProfile);
          }
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onProfileUpdate]);

  return socketRef.current;
}; 