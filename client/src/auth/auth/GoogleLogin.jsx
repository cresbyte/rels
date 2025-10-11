import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";


const GoogleLoginButton = () => {
  const { setUser, setError } = useAuth();
  const navigate = useNavigate();
  const { api } = useApi();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential response:", credentialResponse);

      // Send ID token to backend
      const response = await api.post(`/accounts/google-login/`, {
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
        full_name: userData.full_name,
        role: userData.role,
        is_verified: userData.is_verified,
        profile_picture_url: userData.profile_picture_url,
        phone: userData.phone || "",
        county: userData.county || "",
        subcounty: userData.subcounty || "",
        area: userData.area || "",
        bio: userData.bio || "",
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
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        shape="pill"
        width="300"
        text="continue_with"
        logo_alignment="center"
      />
    </div>
  );
};

export default GoogleLoginButton;