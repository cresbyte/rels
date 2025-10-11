import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Slide,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Person,
  Business,
  Email,
  Lock,
  CardMembership,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import GoogleLoginButton from "./auth/GoogleLogin";

function Register() {
  const [formData, setFormData] = useState({
    organization_name: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState({
    organization_name: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      organization_name: "",
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
    });

    try {
      await register(formData);
      // Navigate to registration success page with email and message
      navigate("/register-success", {
        state: {
          email: formData.email,
          message: "Registration successful! Please check your email to verify your account.",
        },
      });
    } catch (err) {
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;

        if (backendErrors.errors) {
          const newErrors = {};
          Object.keys(backendErrors.errors).forEach((key) => {
            const fieldName = key === "name" ? "organization_name" : key;
            const errorMessage = Array.isArray(backendErrors.errors[key])
              ? backendErrors.errors[key][0]
              : backendErrors.errors[key];
            newErrors[fieldName] = errorMessage;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        } else if (backendErrors.detail) {
          setErrors((prev) => ({
            ...prev,
            organization_name: backendErrors.detail,
          }));
        } else {
          const errorMessages = Object.keys(backendErrors)
            .map((key) => `${key}: ${backendErrors[key]}`)
            .join(", ");
          setErrors((prev) => ({
            ...prev,
            organization_name: errorMessages,
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          organization_name: "Registration failed. Please try again.",
        }));
      }
    } finally {
      setLoading(false);
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
            cursor: "pointer"
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
            TRAE
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
            maxWidth:"30rem"

          }}
        >
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
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
            </Box>

            {errors.organization_name && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  bgcolor: "#d32f2f",
                  color: "white",
                }}
              >
                {errors.organization_name}
              </Alert>
            )}

            {/* Social Sign In Buttons */}
            <Box sx={{ width: "100%", mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
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

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
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
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Verification code"
                    name="verification_code"
                    value={formData.verification_code || ""}
                    onChange={handleChange}
                    error={!!errors.verification_code}
                    helperText={errors.verification_code}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              color: "#4caf50",
                              borderColor: "#4caf50",
                              "&:hover": {
                                borderColor: "#45a049",
                                bgcolor: "rgba(76, 175, 80, 0.1)",
                              },
                            }}
                          >
                            Send Code
                          </Button>
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
                    "Sign Up"
                  )}
                </Button>

                <Box sx={{ mt: 3 }}>
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

                <Box sx={{ mt: 3, textAlign: "center" }}>
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
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
