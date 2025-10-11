import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Protected route component that controls access based on authentication and user roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if authorized
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access this route
 * @param {string} [props.redirectTo] - Path to redirect to if unauthorized (defaults to "/login")
 */
const ProtectedRoute = ({
    children,
    allowedRoles = [],
    redirectTo = "/login",
}) => {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            </div>
        );
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    // If this route requires specific roles and user doesn't have one of them
    if (allowedRoles.length > 0) {
        // Since we don't have roles in our simplified model, redirect to home
        return <Navigate to="/" replace />;
    }

    // User is authenticated and authorized
    return children;
};

export default ProtectedRoute;