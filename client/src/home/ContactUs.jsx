import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import Footer from "./Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ContactUs() {
  return (
    <Box
      className="opaige-app"
      sx={{
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, rgba(30, 30, 45, 0.9), rgba(139, 92, 246, 0.1))`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(139, 92, 246, 0.05))`,
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 20s ease infinite",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {/* Animated Orbs */}
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          left: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "orbitTopLeft 20s ease-in-out infinite, glow 6s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: "15%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 70, 239, 0.3) 0%, transparent 70%)",
          filter: "blur(45px)",
          animation:
            "orbitBottomRight 24s ease-in-out infinite, glow 8s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* Hero Section */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <Box
          sx={{
            py: { xs: 12, md: 16 },
            position: "relative",
            zIndex: 1,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, rgba(30, 30, 45, 0.9), rgba(139, 92, 246, 0.2))`
                : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(139, 92, 246, 0.1))`,
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#8b5cf6",
                    fontWeight: "bold",
                    letterSpacing: 1.5,
                    mb: 2,
                  }}
                >
                  GET IN TOUCH
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  We'd Love to Hear From You
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    maxWidth: 800,
                    mx: "auto",
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Have questions about Opaige? Our team is here to help. Reach
                  out to us through any of the channels below or fill out the
                  form.
                </Typography>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Contact Information Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(30, 30, 45, 0.9)"
                        : "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 4,
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "#8b5cf6",
                      color: "white",
                      mb: 2,
                      "&:hover": {
                        bgcolor: "#d946ef",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Mail size={24} />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Email Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@opaige.com
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    sales@opaige.com
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(30, 30, 45, 0.9)"
                        : "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 4,
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "#8b5cf6",
                      color: "white",
                      mb: 2,
                      "&:hover": {
                        bgcolor: "#d946ef",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Phone size={24} />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Call Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1 (302)-208-7494
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mon-Fri, 9am-6pm EST
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(30, 30, 45, 0.9)"
                        : "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 4,
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "#8b5cf6",
                      color: "white",
                      mb: 2,
                      "&:hover": {
                        bgcolor: "#d946ef",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <MapPin size={24} />
                  </IconButton>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Visit Us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Innovation Street
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tech City, TC 12345
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Box
          sx={{
            py: 8,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, rgba(30, 30, 45, 0.9), rgba(139, 92, 246, 0.15))`
                : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(139, 92, 246, 0.05))`,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                p: 6,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(30, 30, 45, 0.9)"
                    : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                border: "1px solid rgba(139, 92, 246, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
                },
              }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    textAlign: "center",
                    mb: 4,
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Send Us a Message
                </Typography>
              </motion.div>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#8b5cf6",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#8b5cf6",
                        },
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#8b5cf6",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#8b5cf6",
                        },
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#8b5cf6",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#8b5cf6",
                        },
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#8b5cf6",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#8b5cf6",
                        },
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Message"
                      variant="outlined"
                      multiline
                      rows={4}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(139, 92, 246, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "#8b5cf6",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#8b5cf6",
                        },
                      }}
                    />
                  </motion.div>
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                  <motion.div variants={itemVariants}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<Send />}
                      sx={{
                        bgcolor: "#8b5cf6",
                        "&:hover": {
                          bgcolor: "#d946ef",
                          transform: "scale(1.05)",
                        },
                        borderRadius: 8,
                        px: 4,
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Send Message
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </motion.div>

      <Footer />

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes gradientAnimation {
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

        @keyframes glow {
          0% {
            opacity: 0.7;
            filter: blur(30px);
          }
          50% {
            opacity: 1;
            filter: blur(40px);
          }
          100% {
            opacity: 0.7;
            filter: blur(30px);
          }
        }
      `}</style>
    </Box>
  );
}
