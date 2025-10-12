import {
  ArrowBack,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import GoogleLoginButton from "./auth/GoogleLogin";

function Register() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: Verification, 3: Complete Registration
  
  const [formData, setFormData] = useState({
    email: "",
    verification_code: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    verification_code: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  
  const { 
    requestEmailVerification, 
    confirmEmailVerification, 
    completeRegistration 
  } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for the field being changed
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    setLoading(true);
    try {
      await requestEmailVerification(formData.email);
      setCodeSent(true);
      setCurrentStep(2);
    } catch (err) {
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        if (backendErrors.error) {
          setErrors((prev) => ({ ...prev, email: backendErrors.error }));
        } else if (backendErrors.email) {
          setErrors((prev) => ({ ...prev, email: backendErrors.email[0] }));
        }
      } else {
        setErrors((prev) => ({ ...prev, email: "Failed to send verification code" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verification_code) {
      setErrors((prev) => ({ ...prev, verification_code: "Verification code is required" }));
      return;
    }

    setLoading(true);
    try {
      await confirmEmailVerification(formData.email, formData.verification_code);
      setEmailVerified(true);
      setCurrentStep(3);
    } catch (err) {
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        if (backendErrors.error) {
          setErrors((prev) => ({ ...prev, verification_code: backendErrors.error }));
        } else if (backendErrors.verification_code) {
          setErrors((prev) => ({ ...prev, verification_code: backendErrors.verification_code[0] }));
        }
      } else {
        setErrors((prev) => ({ ...prev, verification_code: "Verification failed" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear all errors
    setErrors({
      email: "",
      verification_code: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    });

    try {
      await completeRegistration(formData);
      // Navigate to registration success page
      navigate("/register-success", {
        state: {
          email: formData.email,
          message: "Registration successful! Welcome to RelaySign.",
        },
      });
    } catch (err) {
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        
        if (backendErrors.errors) {
          const newErrors = {};
          Object.keys(backendErrors.errors).forEach((key) => {
            const errorMessage = Array.isArray(backendErrors.errors[key])
              ? backendErrors.errors[key][0]
              : backendErrors.errors[key];
            newErrors[key] = errorMessage;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        } else if (backendErrors.error) {
          setErrors((prev) => ({ ...prev, first_name: backendErrors.error }));
        } else {
          const errorMessages = Object.keys(backendErrors)
            .map((key) => `${key}: ${backendErrors[key]}`)
            .join(", ");
          setErrors((prev) => ({ ...prev, first_name: errorMessages }));
        }
      } else {
        setErrors((prev) => ({ ...prev, first_name: "Registration failed. Please try again." }));
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setCodeSent(false);
      setFormData(prev => ({ ...prev, verification_code: "" }));
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setEmailVerified(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Fade in={currentStep === 1} timeout={300}>
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "white",
                  }}
                >
                  Sign up
                </Typography>
                <Typography variant="body2" sx={{ color: "#888" }}>
                  Enter your email to get started
                </Typography>
              </Box>

              {/* Social Sign In Buttons */}
              <Box
                sx={{
                  width: "100%",
                  mb: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <GoogleLoginButton />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1, height: "1px", bgcolor: "#444" }} />
                <Typography
                  variant="body2"
                  sx={{
                    mx: 2,
                    color: "#888",
                  }}
                >
                  or with Email
                </Typography>
                <Box sx={{ flex: 1, height: "1px", bgcolor: "#444" }} />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#333",
                      "& fieldset": {
                        borderColor: "#555",
                      },
                      "&:hover fieldset": {
                        borderColor: "#777",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4caf50",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#888",
                      "&.Mui-focused": {
                        color: "#4caf50",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  onClick={handleSendCode}
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.email}
                  fullWidth
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    bgcolor: "#4caf50",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#45a049",
                    },
                    "&:disabled": {
                      bgcolor: "#666",
                      color: "#999",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </Box>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={currentStep === 2} timeout={300}>
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <IconButton
                  onClick={goBack}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    color: "#888",
                    "&:hover": { color: "white" },
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "white",
                  }}
                >
                  Verify Email
                </Typography>
                <Typography variant="body2" sx={{ color: "#888" }}>
                  Enter the 6-digit code sent to {formData.email}
                </Typography>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Verification code"
                  name="verification_code"
                  value={formData.verification_code}
                  onChange={handleChange}
                  error={!!errors.verification_code}
                  helperText={errors.verification_code}
                  placeholder="123456"
                  inputProps={{ maxLength: 6 }}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#333",
                      "& fieldset": {
                        borderColor: "#555",
                      },
                      "&:hover fieldset": {
                        borderColor: "#777",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4caf50",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#888",
                      "&.Mui-focused": {
                        color: "#4caf50",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      textAlign: "center",
                      fontSize: "1.2rem",
                      letterSpacing: "0.2em",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  onClick={handleVerifyCode}
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.verification_code}
                  fullWidth
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    bgcolor: "#4caf50",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#45a049",
                    },
                    "&:disabled": {
                      bgcolor: "#666",
                      color: "#999",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <Button
                  onClick={handleSendCode}
                  variant="text"
                  size="small"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    color: "#4caf50",
                    "&:hover": {
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                    },
                  }}
                >
                  Resend Code
                </Button>
              </Box>
            </Box>
          </Fade>
        );

      case 3:
        return (
          <Fade in={currentStep === 3} timeout={300}>
            <Box>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <IconButton
                  onClick={goBack}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    color: "#888",
                    "&:hover": { color: "white" },
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: "white",
                  }}
                >
                  Complete Registration
                </Typography>
                <Typography variant="body2" sx={{ color: "#888" }}>
                  Fill in your details to finish signing up
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleCompleteRegistration}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4caf50",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#888",
                          "&.Mui-focused": {
                            color: "#4caf50",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!errors.last_name}
                      helperText={errors.last_name}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4caf50",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#888",
                          "&.Mui-focused": {
                            color: "#4caf50",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: "#888" }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4caf50",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#888",
                          "&.Mui-focused": {
                            color: "#4caf50",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirm_password}
                      onChange={handleChange}
                      error={!!errors.confirm_password}
                      helperText={errors.confirm_password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{ color: "#888" }}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#333",
                          "& fieldset": {
                            borderColor: "#555",
                          },
                          "&:hover fieldset": {
                            borderColor: "#777",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4caf50",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#888",
                          "&.Mui-focused": {
                            color: "#4caf50",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    fullWidth
                    sx={{
                      minWidth: 200,
                      py: 1.5,
                      bgcolor: "#4caf50",
                      color: "white",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#45a049",
                      },
                      "&:disabled": {
                        bgcolor: "#666",
                        color: "#999",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1a1a1a",
        color: "white",
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "white",
            }}
          >
            RelaySign
          </Typography>
        </Box>
      </Box>

      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: "100%",
            background: "#2a2a2a",
            border: "1px solid #333",
            maxWidth: "30rem",
            position: "relative",
          }}
        >
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            {renderStepContent()}

            {/* Common footer for all steps */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#888" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#4caf50",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Log in
                </Link>
              </Typography>
            </Box>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="caption" sx={{ color: "#666" }}>
                by continuing, you are agreeing to Trae's{" "}
                <Link href="#" style={{ color: "#4caf50" }}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" style={{ color: "#4caf50" }}>
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
