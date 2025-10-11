import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/accounts/forgot-password/`, {
        email: formData.email,
      });

      setSuccess("Verification code sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/accounts/verify-reset-code/`, {
        email: formData.email,
        verification_code: formData.verificationCode,
      });

      setSuccess("Code verified successfully!");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/accounts/reset-password/`, {
        email: formData.email,
        verification_code: formData.verificationCode,
        new_password: formData.newPassword,
      });

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
      setSuccess("");
    } else {
      navigate("/login");
    }
  };

  const isFormValid = () => {
    switch (step) {
      case 1:
        return formData.email && formData.email.includes("@");
      case 2:
        return formData.verificationCode && formData.verificationCode.length >= 4;
      case 3:
        return (
          formData.newPassword &&
          formData.confirmPassword &&
          formData.newPassword === formData.confirmPassword &&
          formData.newPassword.length >= 8
        );
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Reset Password";
      case 2:
        return "Verify Account";
      case 3:
        return "Set New Password";
      default:
        return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Enter your email address and we'll send you a verification code";
      case 2:
        return "Enter the verification code sent to your email";
      case 3:
        return "Create a new password for your account";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            maxWidth:"30rem"

          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton
                onClick={handleBack}
                sx={{
                  color: "#4caf50",
                  mr: 1,
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  flex: 1,
                }}
              >
                {getStepTitle()}
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "#888",
                mb: 3,
              }}
            >
              {getStepDescription()}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: "rgba(244, 67, 54, 0.1)",
                border: "1px solid rgba(244, 67, 54, 0.3)",
                color: "#f44336",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                bgcolor: "rgba(76, 175, 80, 0.1)",
                border: "1px solid rgba(76, 175, 80, 0.3)",
                color: "#4caf50",
              }}
            >
              {success}
            </Alert>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <Box
              component="form"
              onSubmit={handleSendCode}
              sx={{
                width: "100%",
                "& .MuiTextField-root": { mb: 3 },
              }}
            >
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
                }}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isFormValid()}
                sx={{
                  mt: 2,
                  mb: 3,
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Send Code"}
              </Button>
            </Box>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <Box
              component="form"
              onSubmit={handleVerifyCode}
              sx={{
                width: "100%",
                "& .MuiTextField-root": { mb: 3 },
              }}
            >
              <TextField
                required
                fullWidth
                label="Verification Code"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter the 6-digit code"
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isFormValid()}
                sx={{
                  mt: 2,
                  mb: 3,
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#888", mb: 1 }}>
                  Didn't receive the code?
                </Typography>
                <Button
                  variant="text"
                  onClick={handleSendCode}
                  disabled={loading}
                  sx={{
                    color: "#4caf50",
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                    },
                  }}
                >
                  Resend Code
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <Box
              component="form"
              onSubmit={handleResetPassword}
              sx={{
                width: "100%",
                "& .MuiTextField-root": { mb: 3 },
              }}
            >
              <TextField
                required
                fullWidth
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
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

              <TextField
                required
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#888" }} />
                    </InputAdornment>
                  ),
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isFormValid()}
                sx={{
                  mt: 2,
                  mb: 3,
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
              </Button>
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#888" }}>
              Remember your password?{" "}
              <Link
                to="/login"
                style={{
                  color: "#4caf50",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPassword;