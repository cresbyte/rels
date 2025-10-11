import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
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
} from "@mui/icons-material";
import GoogleLoginButton from "./auth/GoogleLogin";

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
      await login(formData.email, formData.password);
      // If login is successful, navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
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
        maxWidth="sm"
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "white",
                textAlign: "center",
              }}
            >
              Log in
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  width: "100%",
                  bgcolor: "#d32f2f",
                  color: "white",
                }}
              >
                {error}
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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

              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isFormValid}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Log in"}
              </Button>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: "#4caf50",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Forgot your password?
                </Link>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#888" }}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#4caf50",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Sign up
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
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
