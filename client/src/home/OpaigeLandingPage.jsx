import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Rating,
  Typography,
} from "@mui/material";
import { ArrowUp } from "lucide-react";
import { Navbar } from "./Navbar";
import Features from "./Features";
import { DashboardPreview } from "./DashboardPreview";
import Plans from "./Plans";
import Testimonials from "./Testimonials";
import Resources from "./Resources";
import Footer from "./Footer";

// Import our custom CSS for animated backgrounds
import "./styles.css";
import { useNavigate } from "react-router-dom";

export default function OpaigeLandingPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  return (
    <Box className="opaige-app">
      {/* Global background base layer */}
      <div className="global-background"></div>

      {/* Animated gradient overlay */}
      <div className="gradient-overlay"></div>

      {/* Floating orbs */}
      <div className="orb-top-left"></div>
      <div className="orb-bottom-right"></div>
      <div className="orb-middle-left"></div>

      {/* Header */}
      <Navbar />

      {/* Hero Section with Stripe-like Animated Gradient */}
      <Box id="home" className="hero-section">
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pt: 10,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "#2b7ae0",
              fontWeight: "bold",
              mb: 2,
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontSize: "0.9rem",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "40%",
                height: "2px",
                background:
                  "linear-gradient(to right, transparent, #2b7ae0, transparent)",
              },
            }}
          >
            Next-Gen Agency Management
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            className="gradient-text"
            data-text="Transform Your Travel"
            sx={{
              mb: 2,
              fontSize: { xs: "2.5rem", md: "6rem" },
              lineHeight: 1.1,
              textShadow:
                "0 0 1px rgba(255,255,255,0.3), 0 0 2px rgba(255,255,255,0.2)",
            }}
          >
            Transform Your Travel
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            className="gradient-text"
            data-text="& Immigration Business"
            sx={{
              mb: 4,
              fontSize: { xs: "2.5rem", md: "4rem" },
              lineHeight: 1.1,
              textShadow:
                "0 0 1px rgba(255,255,255,0.3), 0 0 2px rgba(255,255,255,0.2)",
            }}
          >
            & Immigration Business
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              maxWidth: 700,
              mx: "auto",
              fontSize: "1.1rem",
              color: "#555555",
              lineHeight: 1.7,
            }}
          >
            Opaige CRM delivers the most advanced platform for travel and
            immigration agencies, combining powerful automation, AI-driven
            insights, and seamless workflow integration to elevate your business
            operations.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 2,
              mb: 4,
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              className="cta-button"
              onClick={() => navigate("/register")}
            >
              Discover Now
            </Button>
            <Button
              variant="outlined"
              className="secondary-button"
              onClick={() => navigate("/contact")}
            >
              Book a Demo
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column" },
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              mb: 4,
            }}
          >
            <Box className="rating-box">
              <Rating
                value={5}
                readOnly
                size="small"
                sx={{ color: "#ffc107" }}
              />
              <Typography variant="body2" sx={{ ml: 1, color: "#555555" }}>
                5.0 Rating Across Platforms
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Chip label="G2 Leader" size="small" className="custom-chip" />
              <Chip label="Trustpilot" size="small" className="custom-chip" />
              <Chip label="Capterra" size="small" className="custom-chip" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" className="features-section">
        <Features />
      </Box>

      {/* Dashboard Preview Section */}
      <Box id="dashboard" className="dashboard-section">
        <DashboardPreview />
      </Box>

      {/* Pricing Plans Section */}
      <Box id="pricing" className="pricing-section">
        <Plans />
      </Box>

      {/* Testimonials Section */}
      <Box id="testimonials" className="testimonials-section">
        <Testimonials />
      </Box>

      {/* Resources Section */}
      <Box className="resources-section">
        <Resources />
      </Box>

      {/* Footer */}
      <Box className="footer-section">
        <Footer />
      </Box>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Box onClick={scrollToTop} className="back-to-top">
          <ArrowUp size={24} />
        </Box>
      )}
    </Box>
  );
}
