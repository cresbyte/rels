import React, { createContext, useContext, useMemo } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// Create API context
const ApiContext = createContext(null);

// Custom hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

// Helper to get the current token
export const getAuthToken = () => {
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

// Helper to get auth header
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : null;
};

// API Provider component
export const ApiProvider = ({ children }) => {
  // Create API instance with interceptors
  const api = useMemo(() => {
    // Create axios instance
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    instance.interceptors.request.use(
      (config) => {
        // Get the token from localStorage
        const token = getAuthToken();
        
        if (token) {
          // Always set the Authorization header with Bearer scheme
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Get CSRF token from cookies if available
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];
        
        if (csrfToken) {
          config.headers["X-CSRFToken"] = csrfToken;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration and refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh token
            const refreshToken = localStorage.getItem("refreshToken");
            
            if (refreshToken) {
              const response = await axios.post(
                `${API_URL}/accounts/token/refresh/`,
                {
                  refresh: refreshToken,
                }
              );

              const { access } = response.data;
              localStorage.setItem("accessToken", access);

              // Update header and retry original request
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return instance(originalRequest);
            } else {
              // No refresh token available, redirect to login
              localStorage.removeItem("token");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  // Create custom api methods with auth headers for FormData
  const apiWithAuth = useMemo(() => {
    return {
      ...api,
      
      // Standard methods (will use interceptors automatically)
      get: (url, config = {}) => api.get(url, config),
      post: (url, data, config = {}) => api.post(url, data, config),
      put: (url, data, config = {}) => api.put(url, data, config),
      patch: (url, data, config = {}) => api.patch(url, data, config),
      delete: (url, config = {}) => api.delete(url, config),

      // Special method for FormData uploads
      postFormData: async (url, formData) => {
        const token = getAuthToken();
        const headers = {
          "Content-Type": "multipart/form-data",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        return api.post(url, formData, { headers });
      },

      // Special method for FormData patches
      patchFormData: async (url, formData) => {
        const token = getAuthToken();
        const headers = {
          "Content-Type": "multipart/form-data",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        return api.patch(url, formData, { headers });
      },
    };
  }, [api]);

  // Value provided by the context
  const value = useMemo(
    () => ({
      api: apiWithAuth,
      getAuthToken,
      getAuthHeader,
    }),
    [apiWithAuth]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Default export for backward compatibility
export default api => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};