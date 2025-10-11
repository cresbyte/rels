import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
// Create a context for authentication
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component for authentication
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Verify token by fetching user data
          const response = await api.get("users/me/");
          setCurrentUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("login/", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      // Fetch complete user data immediately after login
      const userResponse = await api.get("users/me/");
      const completeUserData = userResponse.data;

      setCurrentUser(completeUserData);
      setIsAuthenticated(true);
      return { success: true, user: completeUserData };
    } catch (error) {
      // Clear any existing token on login failure
      localStorage.removeItem("token");
      setCurrentUser(null);
      setIsAuthenticated(false);

      // Return error details for the UI to handle
      return {
        success: false,
        error:
          error.response?.data?.detail || "Login failed. Please try again.",
      };
    }
  };

  // Register function - Updated to handle email verification flow
  const register = async (formData) => {
    try {
      const response = await api.post("register/", formData);

      // Registration successful, but user needs to verify email
      // Don't set authentication state yet
      return {
        success: true,
        message: response.data.message,
        email: response.data.email,
      };
    } catch (error) {
      // Pass through the error response from the backend
      throw error;
    }
  };

  // Email verification function
  const verifyEmail = async (token) => {
    try {
      const response = await api.post("verify-email/", { token });

      // Verification successful, user gets logged in automatically
      const {
        token: authToken,
        user_id,
        email,
        first_name,
        last_name,
        organization,
        role,
      } = response.data;

      // Store token
      localStorage.setItem("token", authToken);

      // Set user data from verification response
      const userData = {
        id: user_id,
        email,
        first_name,
        last_name,
        organization_name: organization,
        role,
      };

      // Update state
      setCurrentUser(userData);
      setIsAuthenticated(true);

      return {
        success: true,
        message: response.data.detail,
        user: userData,
      };
    } catch (error) {
      // Clear any existing token on verification failure
      localStorage.removeItem("token");
      setCurrentUser(null);
      setIsAuthenticated(false);

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          "Email verification failed. Please try again.",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    verifyEmail,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
