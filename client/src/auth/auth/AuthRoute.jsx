import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Auth route component that redirects logged-in users based on their role:
 * - Admins go to admin panel
 * - All other users go to the home page
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if not authenticated
 */
const AuthRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            </div>
        );
    }

    // If user is authenticated, redirect based
    if (user) {
        return <Navigate to="/" replace />;

    }

    // User is not authenticated, show the auth component
    return children;
};

export default AuthRoute;