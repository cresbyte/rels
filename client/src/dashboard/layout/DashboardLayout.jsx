import {
  Box,
  CircularProgress,
  CssBaseline,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";

// Import custom components
import api from "../../api/axios";
import { useAuth } from "../../auth/auth/AuthContext";
import AnalyticsDashboard from "../analytics/AnalyticsDashboard";
import DocumentDetailRoute from "../documents/DocumentDetailRoute";
import DocumentsTable from "../documents/DocumentsTable";
import UploadDocuments from "../documents/UploadFlow";
import OrganizationSettings from "../settings/OrganizationSettings";
import UserProfile from "../settings/UserProfile";
import TopBar from "./TopBar";

// Loading animation variants
const loadingVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

// Main dashboard layout component
function DashboardLayout() {
  const theme = useTheme();
  const { currentUser, logout, loading: authLoading } = useAuth();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(currentUser)

  // Determine active screen based on URL
  const getActiveScreen = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") return "Home";
    if (path === "/dashboard/documents") return "Documents";
    if (path.startsWith("/dashboard/documents/")) return "DocumentDetail";
    if (path === "/dashboard/upload") return "Upload";
    if (path === "/dashboard/settings") return "Settings";
    if (path === "/dashboard/profile") return "Profile";
    return "Home";
  };

  const activeScreen = getActiveScreen();

  // Fetch additional user details if needed
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          // Fetch fresh user data to ensure we have the latest
          const response = await api.get("me/");
          setUserData(response.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, authLoading]);

  const handleLogout = () => {
    logout();
    // Redirect to login page will be handled by the auth interceptor in axios.jsx
  };

  // Determine which content to display
  const renderContent = () => {
    switch (activeScreen) {
      case "Home":
        return <AnalyticsDashboard />;

      case "Documents":
        return <DocumentsTable />;

      case "DocumentDetail":
        return <DocumentDetailRoute />;

      case "Upload":
        return <UploadDocuments />;
      case "Settings":
        return (
          <OrganizationSettings
            organization={userData?.organization || {}}
            user={userData || currentUser}
          />
        );
      case "Profile":
        return <UserProfile user={userData || currentUser} />;

      default:
        return <Typography> wetfewf ewrgf</Typography>;
    }
  };

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={loadingVariants}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
            Loading your dashboard...
          </Typography>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, 
              rgba(25, 25, 35, 0.9) 0%, 
              rgba(30, 30, 45, 0.9) 35%, 
              rgba(25, 35, 50, 0.87) 75%, 
              rgba(30, 30, 40, 0.85) 100%)`
            : `linear-gradient(135deg, 
              rgba(250, 250, 255, 0.9) 0%, 
              rgba(248, 248, 255, 0.9) 35%, 
              rgba(245, 248, 255, 0.87) 75%, 
              rgba(248, 250, 255, 0.85) 100%)`,
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === "dark"
              ? `radial-gradient(circle at 20% 35%, rgba(80, 60, 120, 0.08) 0%, transparent 40%), 
               radial-gradient(circle at 80% 10%, rgba(40, 80, 120, 0.05) 0%, transparent 40%)`
              : `radial-gradient(circle at 20% 35%, rgba(90, 120, 240, 0.05) 0%, transparent 40%), 
               radial-gradient(circle at 80% 10%, rgba(146, 100, 240, 0.03) 0%, transparent 40%)`,
          zIndex: -1,
        },
      }}
    >
      <CssBaseline />
      <TopBar
        handleLogout={handleLogout}
        onLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          p: { xs: 2, sm: 3 },
          height: "100vh",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            height: "calc(100% - 64px)",
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
