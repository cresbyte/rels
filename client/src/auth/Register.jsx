import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  ArrowBack,
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
      const response = await register(formData);
      if (response.success) {
        // Navigate to registration success page with email and message
        navigate("/register-success", {
          state: {
            email: formData.email,
            message:
              response.message ||
              "Registration successful! Please check your email to verify your account.",
          },
        });
      }
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

      {/* Header */}
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
            borderColor: "rgba(139, 92, 246, 0.5)",
            color: "#8b5cf6",
            "&:hover": {
              borderColor: "#8b5cf6",
              backgroundColor: "rgba(139, 92, 246, 0.04)",
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
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.7)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0 12px 48px rgba(139, 92, 246, 0.2)",
                transform: "translateY(-5px)",
              },
            }}
          >
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background:
                      "linear-gradient(90deg, #8b5cf6, #d946ef, #ff69b4, #8b5cf6)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradientFlow 8s linear infinite",
                  }}
                >
                  Create Your Account
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: "#555555",
                    lineHeight: 1.7,
                  }}
                >
                  Join Opaige CRM and transform your travel agency management
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Chip
                    icon={<CheckCircle sx={{ color: "#8b5cf6" }} />}
                    label="Free Forever"
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
                    icon={<CheckCircle sx={{ color: "#8b5cf6" }} />}
                    label="No Credit Card Required"
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

              {errors.organization_name && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: "#e57373",
                    "& .MuiAlert-icon": { color: "#ffffff" },
                  }}
                >
                  {errors.organization_name}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Organization Name"
                      name="organization_name"
                      value={formData.organization_name}
                      onChange={handleChange}
                      error={!!errors.organization_name}
                      helperText={errors.organization_name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business sx={{ color: "#8b5cf6" }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "16px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#8b5cf6" }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "16px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={!!errors.last_name}
                      helperText={errors.last_name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#8b5cf6" }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "16px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "#8b5cf6" }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "16px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "#8b5cf6" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
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
                        sx: { borderRadius: "16px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
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
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: "#8b5cf6" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff sx={{ color: "#8b5cf6" }} />
                              ) : (
                                <Visibility sx={{ color: "#8b5cf6" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "16px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                        background:
                          "linear-gradient(to right, #7c3aed, #c026d3)",
                      },
                      "&:active": {
                        transform: "translateY(1px)",
                        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
                      },
                      "&:disabled": {
                        opacity: 0.7,
                        background:
                          "linear-gradient(to right, #a78bfa, #e879f9)",
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
                      "Create Account"
                    )}
                  </Button>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: "#555555" }}>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          color: "#d946ef",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                        sx={{
                          "&:hover": {
                            color: "#8b5cf6",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Container>

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
    </Box>
  );
}

export default Register;
