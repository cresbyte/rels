import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { CircularProgress, Box } from "@mui/material";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to dashboard if already authenticated
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

export default PublicRoute;
