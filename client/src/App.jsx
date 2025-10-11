import { Box, CssBaseline } from "@mui/material";
import { useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import EmailVerification from "./auth/EmailVerification";
import ForgotPassword from "./auth/ForgotPassword";
import Login from "./auth/Login";
import PrivateRoute from "./auth/PrivateRoute";
import Register from "./auth/Register";
import RegistrationSuccess from "./auth/RegistrationSuccess";
import ResetPassword from "./auth/ResetPassword";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import AboutUs from "./home/AboutUs";
import ContactUs from "./home/ContactUs";
import FAQs from "./home/FAQs";
import NotFound from "./home/NotFound";
import OpaigeLandingPage from "./home/OpaigeLandingPage";

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
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Box sx={{ width: "99.5vw" }}>
            <CssBaseline />
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/register-success"
                element={<RegistrationSuccess />}
              />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
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
  );
}

export default App;
