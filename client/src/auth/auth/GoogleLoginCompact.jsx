import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../ApiContext";

const GoogleLoginCompact = () => {
    const { setUser, setError } = useAuth();
    const navigate = useNavigate();
    const { api } = useApi();
    const handleSuccess = async (credentialResponse) => {
        try {
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
            });

            // Redirect to home page after successful login
            navigate("/");

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
        <div className="w-full">
         
            <div className="hidden">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    useOneTap
                    text="signin_with"
                    shape="pill"
                    size="medium"
                    logo_alignment="center"
                />
            </div>
        </div>
    );
};

export default GoogleLoginCompact; 