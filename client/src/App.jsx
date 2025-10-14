import { Box, CssBaseline } from "@mui/material";
import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import EmailVerification from "./auth/EmailVerification";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import Register from "./auth/Register";
import RegistrationSuccess from "./auth/RegistrationSuccess";
import ResetPassword from "./auth/ResetPassword";
import { AuthProvider } from "./auth/auth/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import AboutUs from "./home/AboutUs";
import ContactUs from "./home/ContactUs";
import FAQs from "./home/FAQs";
import NotFound from "./home/NotFound";
import OpaigeLandingPage from "./home/OpaigeLandingPage";
import OpenSignDocument from "./dashboard/documents/OpenSignDocument";

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
   const GOOGLE_CLIENT_ID =
     "898368192915-rdtfu51uk3gu20n5cpumvq88jn7vcmma.apps.googleusercontent.com";


  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <Box sx={{ width: "99.5vw" }}>
              <CssBaseline />
              <ScrollToTop />
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                <Route
                  path="/register-success"
                  element={
                    <PublicRoute>
                      <RegistrationSuccess />
                    </PublicRoute>
                  }
                />
                <Route 
                  path="/verify-email" 
                  element={
                    <PublicRoute>
                      <EmailVerification />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/forgot-password" 
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/reset-password" 
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  } 
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/documents"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                /> <Route
                  path="/dashboard/upload"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/documents/:id"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <PrivateRoute>
                      <DashboardLayout />
                    </PrivateRoute>
                  }
                />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faq" element={<FAQs />} />

                <Route path="/" element={<OpaigeLandingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
