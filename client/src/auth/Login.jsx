import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Fade,
  Slide,
  Snackbar,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
} from "@mui/icons-material";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Form validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid =
      emailRegex.test(formData.email) && formData.password.length >= 6;

    setIsFormValid(isValid);
  }, [formData]);

  // Check for stored email if user previously checked "remember me"
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = name === "rememberMe" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (error) setError("");
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
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
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Orbs */}
      <Box
        sx={{
          position: "fixed",
          top: "15%",
          left: "10%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "orbitTopLeft 20s ease-in-out infinite, glow 6s ease-in-out infinite",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "20%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 105, 180, 0.35) 0%, transparent 70%)",
          filter: "blur(45px)",
          animation:
            "orbitBottomRight 24s ease-in-out infinite, glow 8s ease-in-out infinite",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: "60%",
          left: "15%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 191, 255, 0.3) 0%, transparent 70%)",
          filter: "blur(35px)",
          animation:
            "orbitMiddleLeft 22s ease-in-out infinite, glow 7s ease-in-out infinite",
          zIndex: -1,
        }}
      />
      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.9,
          background: `radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 35%),
                      radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.3) 0%, transparent 35%),
                      radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.2) 0%, transparent 40%),
                      radial-gradient(circle at 80% 80%, rgba(186, 104, 200, 0.25) 0%, transparent 30%)`,
        }}
      />

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="span"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      O
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                      background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Opaige
                  </Typography>
                </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{
            borderRadius: "50px",
            boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
            px: 2,
            py: 0.7,
            borderColor: "rgba(139, 92, 246, 0.5)",
            color: "#8b5cf6",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#8b5cf6",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Back to Home
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
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: "100%",
              background: "rgba(255, 255, 255, 0.7)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0 12px 48px rgba(139, 92, 246, 0.2)",
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
              }}
            >
              <Typography
                component="h1"
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg, #8b5cf6, #d946ef, #ff69b4, #8b5cf6)",
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradientFlow 8s linear infinite",
                  letterSpacing: "-0.5px",
                }}
              >
                Welcome Back
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  textAlign: "center",
                  maxWidth: "80%",
                  color: "#555555",
                  lineHeight: 1.7,
                }}
              >
                Sign in to continue to your account
              </Typography>

              <Fade in={!!error} timeout={300}>
                <Box sx={{ width: "100%", mb: error ? 3 : 0 }}>
                  {error && (
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{
                        borderRadius: 2,
                        bgcolor: "#e57373",
                        animation: "pulse 1.5s ease-in-out",
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </Box>
              </Fade>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                  "& .MuiTextField-root": { mb: 3 },
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus={!formData.email}
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#8b5cf6" }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!error && !formData.email}
                  placeholder="your.email@example.com"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8b5cf6",
                        },
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#555555",
                      "&.Mui-focused": {
                        color: "#8b5cf6",
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#8b5cf6" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ color: "#8b5cf6" }} />
                          ) : (
                            <Visibility sx={{ color: "#8b5cf6" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!error && !formData.password}
                  helperText={
                    formData.password && formData.password.length < 6
                      ? "Password must be at least 6 characters"
                      : ""
                  }
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8b5cf6",
                        },
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#555555",
                      "&.Mui-focused": {
                        color: "#8b5cf6",
                      },
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        name="rememberMe"
                        sx={{
                          color: "#d946ef",
                          "&.Mui-checked": {
                            color: "#8b5cf6",
                          },
                        }}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "#555555" }}>
                        Remember me
                      </Typography>
                    }
                  />
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: "none",
                      color: "#d946ef",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    sx={{
                      "&:hover": {
                        color: "#8b5cf6",
                        textDecoration: "underline",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <Lock
                      fontSize="small"
                      sx={{ fontSize: "1rem", color: "#d946ef" }}
                    />
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || !isFormValid}
                  sx={{
                    mt: 1,
                    mb: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    boxShadow: "0 5px 15px rgba(139, 92, 246, 0.5)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    background: "linear-gradient(to right, #8b5cf6, #d946ef)",
                    color: "#ffffff",
                    animation: "pulse 2s infinite",
                    "&:not(:disabled):hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.7)",
                      background: "linear-gradient(to right, #7c3aed, #c026d3)",
                    },
                    "&:active": {
                      transform: "translateY(1px)",
                      boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
                    },
                    "&:disabled": {
                      opacity: 0.7,
                      background: "linear-gradient(to right, #a78bfa, #e879f9)",
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                      transform: "translateX(-100%)",
                      transition: "transform 0.8s ease",
                    },
                    "&:hover::before": {
                      transform: "translateX(100%)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Box
                  sx={{
                    textAlign: "center",
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#555555" }}>
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        textDecoration: "none",
                        color: "#d946ef",
                        fontWeight: 600,
                        transition: "color 0.2s",
                      }}
                      sx={{
                        "&:hover": {
                          color: "#8b5cf6",
                        },
                      }}
                    >
                      Sign up now
                    </Link>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 3,
                  }}
                >
                  <Chip
                    label="Secure Login"
                    size="small"
                    sx={{
                      background: "rgba(255, 255, 255, 0.7)",
                      color: "#555555",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  />
                  <Chip
                    label="256-bit encryption"
                    size="small"
                    sx={{
                      background: "rgba(255, 255, 255, 0.7)",
                      color: "#555555",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Slide>

        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={5000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
              bgcolor: "#8b5cf6",
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Global styles for animations */}
        <style jsx global>{`
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes orbitTopLeft {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(10vw, -5vh);
            }
            50% {
              transform: translate(15vw, 5vh);
            }
            75% {
              transform: translate(5vw, 10vh);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          @keyframes orbitBottomRight {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(-8vw, 8vh);
            }
            50% {
              transform: translate(-12vw, -5vh);
            }
            75% {
              transform: translate(-5vw, -10vh);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          @keyframes orbitMiddleLeft {
            0% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(5vw, 12vh);
            }
            50% {
              transform: translate(10vw, -8vh);
            }
            75% {
              transform: translate(3vw, -12vh);
            }
            100% {
              transform: translate(0, 0);
            }
          }

          @keyframes glow {
            0% {
              opacity: 0.8;
              filter: blur(30px);
            }
            50% {
              opacity: 1;
              filter: blur(40px);
            }
            100% {
              opacity: 0.8;
              filter: blur(30px);
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </Container>
    </Box>
  );
}

export default Login;
