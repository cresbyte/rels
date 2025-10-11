import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Slide,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Error, Email, ArrowForward } from "@mui/icons-material";
import { useAuth } from "./auth/AuthContext";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationState, setVerificationState] = useState({
    loading: true,
    success: null,
    error: "",
    message: "",
  });
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  // Use refs to track verification status and prevent re-execution
  const hasVerifiedRef = useRef(false);
  const isRedirectingRef = useRef(false);

  const token = searchParams.get("token");

  useEffect(() => {
    // Prevent multiple executions
    if (hasVerifiedRef.current || isRedirectingRef.current) {
      return;
    }

    const performVerification = async () => {
      if (!token) {
        setVerificationState({
          loading: false,
          success: false,
          error:
            "Invalid verification link. Please check your email for the correct link.",
          message: "",
        });
        hasVerifiedRef.current = true;
        return;
      }

      try {
        await verifyEmail(token);
        hasVerifiedRef.current = true;

        setVerificationState({
          loading: false,
          success: true,
          error: "",
          message: "Email verified successfully! You can now access your account.",
        });

        // Set redirecting flag to prevent any further state changes
        isRedirectingRef.current = true;

        // Redirect to dashboard after showing success message
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      } catch (error) {
        hasVerifiedRef.current = true;
        setVerificationState({
          loading: false,
          success: false,
          error:
            "An unexpected error occurred. Please try again or contact support.",
          message: "",
        });
      }
    };

    performVerification();
  }, [token, verifyEmail, navigate]);

  const handleReturnToLogin = () => {
    isRedirectingRef.current = true;
    navigate("/login", { replace: true });
  };

  const handleGoToDashboard = () => {
    isRedirectingRef.current = true;
    navigate("/dashboard", { replace: true });
  };

  // Don't render anything if we're redirecting
  if (isRedirectingRef.current) {
    return null;
  }

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
          justifyContent: "center",
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
              {verificationState.loading && (
                <>
                  <CircularProgress
                    size={60}
                    sx={{
                      mb: 3,
                      color: "#3b82f6",
                    }}
                  />
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
                    Verifying Email
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Please wait while we verify your email address...
                  </Typography>
                </>
              )}

              {!verificationState.loading &&
                verificationState.success === true && (
                  <>
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
                        background: "linear-gradient(45deg, #10b981, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Email Verified!
                    </Typography>

                    <Alert
                      severity="success"
                      variant="filled"
                      sx={{
                        width: "100%",
                        mb: 4,
                        borderRadius: 2,
                        backgroundColor: "#10b981",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {verificationState.message}
                      </Typography>
                    </Alert>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4 }}
                    >
                      Your account has been activated successfully. You will be
                      redirected to your dashboard shortly, or click the button
                      below.
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={handleGoToDashboard}
                      sx={{
                        py: 1.5,
                        borderRadius: 8,
                        boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                        transition: "all 0.3s ease",
                        fontWeight: 600,
                        fontSize: "1rem",
                        background:
                          "linear-gradient(to right, #10b981, #22d3ee)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                        },
                        "&:active": {
                          transform: "translateY(1px)",
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
                        },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </>
                )}

              {!verificationState.loading &&
                verificationState.success === false && (
                  <>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ef4444, #f87171)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        boxShadow: "0 8px 32px rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      <Error
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
                        background: "linear-gradient(45deg, #ef4444, #f87171)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Verification Failed
                    </Typography>

                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{
                        width: "100%",
                        mb: 4,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {verificationState.error}
                      </Typography>
                    </Alert>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4 }}
                    >
                      The verification link may have expired or been used
                      already. Please try registering again or contact support
                      for assistance.
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleReturnToLogin}
                        sx={{
                          py: 1.5,
                          borderRadius: 8,
                          fontWeight: 600,
                          borderColor: "#3b82f6",
                          color: "#3b82f6",
                          "&:hover": {
                            borderColor: "#2563eb",
                            backgroundColor: "rgba(59, 130, 246, 0.04)",
                          },
                        }}
                      >
                        Back to Login
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          isRedirectingRef.current = true;
                          navigate("/register");
                        }}
                        sx={{
                          py: 1.5,
                          borderRadius: 8,
                          fontWeight: 600,
                          background:
                            "linear-gradient(to right, #3b82f6, #22d3ee)",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                          },
                        }}
                      >
                        Register Again
                      </Button>
                    </Box>
                  </>
                )}
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default EmailVerification;
