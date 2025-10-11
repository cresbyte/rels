import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";


const GoogleLoginButton = () => {
  const { setUser, setError } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential response:", credentialResponse);

      // Send ID token to backend
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      const response = await axios.post(`${API_URL}/accounts/google-login/`, {
        id_token: credentialResponse.credential,
      });

      const { user: userData, tokens } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      // Set auth headers for future requests
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${tokens.access}`;

      // Update user state with consistent field names
      setUser({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
     
        is_verified: userData.is_verified,
        profile_picture_url: userData.profile_picture_url,

      });
      
      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      
    } catch (err) {
      console.error("Google authentication error:", err);
      setError(err.response?.data?.error || "Google authentication failed");
    }
  };

  const handleError = (error) => {
    console.error("Google login error:", error);
    setError("Google login failed. Please try again.");
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", border:"1px solid red" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        shape="rectangular"
        width="100%"
        text="continue_with"
        logo_alignment="left"
        theme="dark"
      />
    </Box>
  );
};

export default GoogleLoginButton;