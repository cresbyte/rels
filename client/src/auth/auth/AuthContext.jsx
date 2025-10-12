import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken) {
          setLoading(false);
          return;
        }

        // Set authorization header with the token
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Check if token is expired
        const tokenData = jwtDecode(accessToken);
        const isExpired = tokenData.exp * 1000 < Date.now();

        if (isExpired && refreshToken) {
          // Token is expired, try to refresh
          await refreshAccessToken();
        } else if (isExpired) {
          // Token expired and no refresh token
          logout();
        } else {
          // Valid token, set user with all available fields
          setUser({
            id: tokenData.user_id,
            email: tokenData.email,
            first_name: tokenData.first_name,
            last_name: tokenData.last_name,
            profile_pic: tokenData.profile_picture_url,
          });
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    // Refresh token every hour (3600000 ms)
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 3600000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/accounts/login/`, {
        email,
        password,
      });

      const { user: userData, tokens } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      // Set auth headers for future requests
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.access}`;

      // Update user state with all fields from the backend
      setUser({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      return userData;
    } catch (err) {
      setError(err.response?.data || "Login failed");
      throw err;
    }
  };

  const requestEmailVerification = async (email) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/accounts/email-verification-request/`, {
        email,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || "Failed to send verification code");
      throw err;
    }
  };

  const confirmEmailVerification = async (email, verificationCode) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/accounts/email-verification-confirm/`, {
        email,
        verification_code: verificationCode,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data || "Email verification failed");
      throw err;
    }
  };

  const completeRegistration = async (formData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/accounts/complete-registration/`, {
        email: formData.email,
        verification_code: formData.verification_code,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      const { user: userData, tokens } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      // Set auth headers for future requests
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.access}`;

      // Update user state with all fields
      setUser({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      return userData;
    } catch (err) {
      setError(err.response?.data || "Registration completion failed");
      throw err;
    }
  };

  // Keep the old register method for backward compatibility (Google login, etc.)
  const register = async (
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
  ) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/accounts/register/`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      const { user: userData, tokens } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      // Set auth headers for future requests
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.access}`;

      // Update user state with all fields
      setUser({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
      });

      return userData;
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Clear auth headers
    delete axios.defaults.headers.common["Authorization"];

    // Reset user state
    setUser(null);
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        logout();
        return;
      }

      const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;

      // Update access token in localStorage
      localStorage.setItem("accessToken", access);

      // Update auth headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      // Update user state from new token with all fields
      const tokenData = jwtDecode(access);
      setUser({
        id: tokenData.user_id,
        email: tokenData.email,
        first_name: tokenData.first_name,
        last_name: tokenData.last_name,

      });

      return access;
    } catch (err) {
      console.error("Error refreshing token:", err);
      logout();
      throw err;
    }
  };


  const sendVerificationCode = async () => {
    try {
      // Get the current token
      const accessToken = localStorage.getItem("accessToken");

      // Ensure the token is available
      if (!accessToken) {
        throw new Error("Not authenticated. Please log in again.");
      }

      // Set authorization header explicitly for this request
      const response = await axios.post(
        `${API_URL}/accounts/send-verification-code/`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error("Verification code error:", err);
      setError(err.response?.data || "Failed to send verification code");
      throw err;
    }
  };


  const updateUser = async (formData) => {
    try {
      setError(null);

      // Call the API endpoint to update user profile
      const response = await axios.patch(
        `${API_URL}/accounts/me/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      const { user: userData, tokens } = response.data;

      // Update tokens in localStorage
      if (tokens) {
        localStorage.setItem("accessToken", tokens.access);
        localStorage.setItem("refreshToken", tokens.refresh);
        axios.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
      }

      // Update user state with all user data from response
      setUser(prevUser => ({
        ...prevUser,
        ...userData,
      }));

      return userData;
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
      throw err;
    }
  };

  // Setup axios interceptors for requests and responses
  useEffect(() => {
    // Flag to prevent multiple simultaneous refresh attempts
    let isRefreshing = false;
    let refreshSubscribers = [];

    // Function to add callbacks to subscribers
    const subscribeTokenRefresh = (callback) => {
      refreshSubscribers.push(callback);
    };

    // Function to notify subscribers with new token
    const onRefreshed = (token) => {
      refreshSubscribers.forEach(callback => callback(token));
      refreshSubscribers = [];
    };

    // Request interceptor to add Authorization header to all requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for 401 responses
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Check if error is due to token expiration
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes('/accounts/token/refresh/')
        ) {
          // Set flag so we don't retry this request again
          originalRequest._retry = true;

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              // Try to refresh the token
              const refreshToken = localStorage.getItem("refreshToken");

              // If no refresh token, logout immediately
              if (!refreshToken) {
                logout();
                return Promise.reject(error);
              }

              // Attempt token refresh
              const response = await axios.post(
                `${API_URL}/accounts/token/refresh/`,
                { refresh: refreshToken },
                { _retry: true } // Mark this request to avoid intercepting it
              );

              const { access } = response.data;

              // Update access token in localStorage
              localStorage.setItem("accessToken", access);

              // Update auth headers for future requests
              axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

              // Update original request header
              originalRequest.headers.Authorization = `Bearer ${access}`;

              // Notify all subscribers with new token
              onRefreshed(access);

              // Reset refreshing flag
              isRefreshing = false;

              // Retry original request with new token
              return axios(originalRequest);
            } catch (refreshError) {
              // Reset refreshing flag
              isRefreshing = false;

              // If refresh fails, logout and redirect to login
              console.error("Token refresh failed:", refreshError);
              logout();
              return Promise.reject(refreshError);
            }
          } else {
            // Wait for token refresh to complete
            return new Promise((resolve) => {
              subscribeTokenRefresh((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axios(originalRequest));
              });
            });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const verifyAccount = async (verificationCode) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/accounts/verify-account/`, {
        verification_code: verificationCode,
      });

      // Update user state if verification was successful
      if (response.data.user) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.data.user,
        }));
      }

      return response.data;
    } catch (err) {
      setError(err.response?.data || "Account verification failed");
      throw err;
    }
  };



  const value = {
    user,
    setUser,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    sendVerificationCode,
    verifyAccount,
    isAuthenticated: !!user,
    refreshAccessToken,
    updateUser,
    // New email verification methods
    requestEmailVerification,
    confirmEmailVerification,
    completeRegistration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;