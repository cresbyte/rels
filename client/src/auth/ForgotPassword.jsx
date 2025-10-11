import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Slide,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Email, ArrowBack } from '@mui/icons-material';
import axios from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post('/password-reset/request/', { email });
      setSuccess('Password reset instructions have been sent to your email.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
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
          color="primary" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/login')}
          sx={{ 
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            px: 2, 
            py: 0.7,
            borderColor: 'rgba(59, 130, 246, 0.5)',
            '&:hover': {
              borderColor: '#3b82f6',
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }
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
          zIndex: 1 
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
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  mb: 1.5,
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #3b82f6, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                Forgot Password
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  textAlign: "center",
                  maxWidth: "80%",
                }}
              >
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    width: "100%",
                    mb: 3,
                    borderRadius: 2,
                    animation: "pulse 1.5s ease-in-out",
                  }}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert
                  severity="success"
                  variant="filled"
                  sx={{
                    width: "100%",
                    mb: 3,
                    borderRadius: 2,
                    animation: "pulse 1.5s ease-in-out",
                  }}
                >
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    mb: 4,
                    py: 1.5,
                    borderRadius: 8,
                    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.25)",
                    transition: "all 0.3s ease",
                    fontWeight: 600,
                    fontSize: "1rem",
                    background: "linear-gradient(to right, #3b82f6, #22d3ee)",
                    "&:not(:disabled):hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(1px)",
                      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
                    },
                    "&:disabled": {
                      opacity: 0.7,
                      background: "linear-gradient(to right, #9cb3f0, #92dbe6)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Slide>

        {/* Global styles for animations */}
        <style jsx global>{`
          @keyframes pulse {
            0% {
              opacity: 0.8;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.8;
            }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 