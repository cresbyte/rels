import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import {
  BookOpen,
  Briefcase,
  Building,
  Building2,
  DollarSign,
  FileCheck,
  FileText,
  Globe,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import React from "react";

// Import logos

const Features = () => {
  return (
    <>
      {/* Platform Features */}
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "#666", mb: 3 }}
          >
            ONE PLATFORM FOR ALL YOUR AGENCY MANAGEMENT NEEDS
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: "#FFD6D6",
                  p: 2,
                  borderRadius: 8,
                  height: "100%",
                  display: "flex",
                }}
              >
                <Avatar sx={{ bgcolor: "#FF9494", mr: 2 }}>
                  <Users />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Client Management
                  </Typography>
                  <Typography variant="body2">
                    Efficiently manage client profiles, documentation, and
                    communication in one place.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: "#FFECD6",
                  p: 2,
                  borderRadius: 8,
                  height: "100%",
                  display: "flex",
                }}
              >
                <Avatar sx={{ bgcolor: "#FFBF66", mr: 2 }}>
                  <FileCheck />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Visa Tracking
                  </Typography>
                  <Typography variant="body2">
                    Comprehensive visa application monitoring with automated
                    status updates and deadlines.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: "#D6FFE2",
                  p: 2,
                  borderRadius: 8,
                  height: "100%",
                  display: "flex",
                }}
              >
                <Avatar sx={{ bgcolor: "#66FF8C", mr: 2 }}>
                  <Plane />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Travel Booking
                  </Typography>
                  <Typography variant="body2">
                    Streamlined travel booking with itinerary management and
                    client profiles.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: "#D6F0FF",
                  p: 2,
                  borderRadius: 8,
                  height: "100%",
                  display: "flex",
                }}
              >
                <Avatar sx={{ bgcolor: "#66C5FF", mr: 2 }}>
                  <FileText />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Document Management
                  </Typography>
                  <Typography variant="body2">
                    Secure storage and organization of passports, visas, and
                    application documents.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: "#E0D6FF",
                  p: 2,
                  borderRadius: 8,
                  height: "100%",
                  display: "flex",
                }}
              >
                <Avatar sx={{ bgcolor: "#B38CFF", mr: 2 }}>
                  <ShieldCheck />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Compliance Tools
                  </Typography>
                  <Typography variant="body2">
                    Stay updated with immigration regulations and ensure
                    application compliance.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: "#FFD6EF",
                  p: 2,
                  borderRadius: 8,
                  height: "100%",
                  display: "flex",
                }}
              >
                <Avatar sx={{ bgcolor: "#FF8CD9", mr: 2 }}>
                  <DollarSign />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Revenue Management
                  </Typography>
                  <Typography variant="body2">
                    Track fees, invoices, and commissions with integrated
                    payment processing solutions.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* New to Opaige */}
      <Container maxWidth="lg" sx={{ my: 8, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          New to Opaige CRM?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Here's how to get started with your agency management
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 4,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#FFC107",
                      mr: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "bold" }}
                  >
                    Quick Implementation
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Set up your agency in minutes with our guided onboarding
                  process and data migration tools.
                </Typography>
              </Box>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    right: -10,
                    zIndex: 1,
                    transform: "rotate(15deg)",
                  }}
                >
                  <Star fill="#FFD700" size={32} />
                </Box>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#FFF9C4",
                    borderRadius: "50%",
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 4,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#2196F3",
                      mr: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "bold" }}
                  >
                    Personalized Training
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Get your team up to speed with personalized training sessions
                  and comprehensive documentation.
                </Typography>
              </Box>
              <Box>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#E3F2FD",
                    borderRadius: "50%",
                  }}
                >
                  <BookOpen size={40} color="#2196F3" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Trusted by Agencies */}
      <Container maxWidth="lg" sx={{ my: 8, textAlign: "center" }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          TRUSTED BY 1000+ TRAVEL AND IMMIGRATION AGENCIES WORLDWIDE
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 5,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(33, 150, 243, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(33, 150, 243, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Globe size={24} color="#2196F3" />
            <Typography
              variant="subtitle1"
              sx={{ color: "#1976D2", fontWeight: 500 }}
            >
              Global Travel
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(76, 175, 80, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(76, 175, 80, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Building2 size={24} color="#4CAF50" />
            <Typography
              variant="subtitle1"
              sx={{ color: "#388E3C", fontWeight: 500 }}
            >
              Immigration Services
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(255, 152, 0, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255, 152, 0, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Briefcase size={24} color="#FF9800" />
            <Typography
              variant="subtitle1"
              sx={{ color: "#F57C00", fontWeight: 500 }}
            >
              Business Travel
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(156, 39, 176, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(156, 39, 176, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <FileCheck size={24} color="#9C27B0" />
            <Typography
              variant="subtitle1"
              sx={{ color: "#7B1FA2", fontWeight: 500 }}
            >
              Visa Experts
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(244, 67, 54, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(244, 67, 54, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <PlaneTakeoff size={24} color="#F44336" />
            <Typography
              variant="subtitle1"
              sx={{ color: "#D32F2F", fontWeight: 500 }}
            >
              Travel Agencies
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(0, 188, 212, 0.05)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(0, 188, 212, 0.1)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Building size={24} color="#00BCD4" />
            <Typography
              variant="subtitle1"
              sx={{ color: "#0097A7", fontWeight: 500 }}
            >
              Immigration Consultants
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Features;
