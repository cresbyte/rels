import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  Slide,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Email, ArrowBack } from "@mui/icons-material";

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from state passed during navigation
  const email = location.state?.email || "";
  const message =
    location.state?.message ||
    "Registration successful! Please check your email to verify your account.";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f9f5f6",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: 45,
              height: 45,
              mr: 1,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top right, #3b82f6, #22d3ee)",
                borderRadius: 1,
                transform: "rotate(3deg)",
                opacity: 0.8,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "white",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                component="span"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(to right, #3b82f6, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                O
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" component="div">
            <Box component="span" sx={{ color: "#3b82f6" }}>
              Opaige
            </Box>
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            px: 2,
            py: 0.7,
            borderColor: "rgba(59, 130, 246, 0.5)",
            "&:hover": {
              borderColor: "#3b82f6",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          Back to Login
        </Button>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              transition: "all 0.3s ease-in-out",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: "100%",
              "&:hover": {
                boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
                transform: "translateY(-5px)",
              },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Success Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #22d3ee)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 40,
                    color: "white",
                  }}
                />
              </Box>

              <Typography
                component="h1"
                variant="h4"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #3b82f6, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                Registration Successful!
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Welcome to Opaige
              </Typography>

              <Alert
                severity="info"
                variant="filled"
                icon={<Email />}
                sx={{
                  width: "100%",
                  mb: 4,
                  borderRadius: 2,
                  backgroundColor: "#3b82f6",
                  "& .MuiAlert-icon": {
                    color: "white",
                  },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {message}
                </Typography>
                {email && (
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    We've sent a verification link to: <strong>{email}</strong>
                  </Typography>
                )}
              </Alert>

              <Box
                sx={{
                  width: "100%",
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  mb: 4,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontWeight: 500 }}
                >
                  What happens next?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  1. Check your email inbox (and spam folder)
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  2. Click the verification link in the email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3. Your account will be activated and you can start using
                  Opaige
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  py: 1.5,
                  borderRadius: 8,
                  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.25)",
                  transition: "all 0.3s ease",
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: "linear-gradient(to right, #3b82f6, #22d3ee)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(1px)",
                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
                  },
                }}
              >
                Continue to Login
              </Button>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Didn't receive the email? Check your spam folder or contact
                support.
              </Typography>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default RegistrationSuccess;
