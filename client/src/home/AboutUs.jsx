import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

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

export default function AboutUs() {
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
                  OUR STORY
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
                  Revolutionizing Travel & Immigration Management
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
                  At Opaige, we're on a mission to transform how travel and
                  immigration agencies operate. Born from the real challenges
                  faced by agencies worldwide, we've built a comprehensive
                  solution that streamlines operations and enhances client
                  experiences.
                </Typography>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Our Mission
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    To empower travel and immigration agencies with innovative
                    technology that simplifies complex processes, enhances
                    client relationships, and drives business growth.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Our Vision
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: (theme) => theme.palette.text.secondary }}
                  >
                    To become the global standard in travel and immigration
                    management software, setting new benchmarks for efficiency,
                    compliance, and client satisfaction.
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </motion.div>

      {/* Team Section */}
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
          <Container maxWidth="lg">
            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  textAlign: "center",
                  mb: 6,
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Meet Our Leadership Team
              </Typography>
            </motion.div>
            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  name: "Alex Thompson",
                  role: "Chief Executive Officer",
                  image:
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60",
                },
                {
                  name: "Priya Sharma",
                  role: "Chief Technology Officer",
                  image:
                    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60",
                },
                {
                  name: "David Martinez",
                  role: "Chief Operations Officer",
                  image:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
                },
              ].map((member, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        textAlign: "center",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Avatar
                        src={member.image}
                        sx={{
                          width: 150,
                          height: 150,
                          mx: "auto",
                          mb: 2,
                          border: "4px solid #8b5cf6",
                          boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)",
                          },
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          background:
                            "linear-gradient(90deg, #8b5cf6, #d946ef)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: (theme) => theme.palette.text.secondary }}
                      >
                        {member.role}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* Values Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Core Values
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {[
              {
                title: "Innovation",
                description:
                  "Constantly pushing boundaries to deliver cutting-edge solutions.",
              },
              {
                title: "Excellence",
                description:
                  "Committed to delivering the highest quality in everything we do.",
              },
              {
                title: "Integrity",
                description:
                  "Building trust through transparency and ethical practices.",
              },
              {
                title: "Customer Success",
                description: "Dedicated to our clients' growth and success.",
              },
            ].map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: (theme) => theme.palette.text.secondary }}
                    >
                      {value.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
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
