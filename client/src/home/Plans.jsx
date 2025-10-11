import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Chip
} from "@mui/material";
import { Gift } from "lucide-react";
import React from "react";

const Plans = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Free Plan Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card
          sx={{
            bgcolor: "#002244",
            color: "white",
            p: 4,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
            
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Opaige CRM is Now Completely Free
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Get access to all features at no cost. No credit card required.
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#F44336",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">Unlimited Clients</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#2196F3",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">All Features Included</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#4CAF50",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">No Hidden Fees</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: "#4CAF50",
                  "&:hover": { bgcolor: "#388E3C" },
                  borderRadius: 8,
                  px: 3,
                  mt: 3,
                }}
              >
                Get Started Now
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    width: 150,
                    height: 150,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "rgba(76, 175, 80, 0.1)",
                    borderRadius: "50%",
                  }}
                >
                  <Gift size={80} color="#4CAF50" />
                </Box>
                <Typography
                  variant="h2"
                  sx={{
                    position: "absolute",
                    color: "#4CAF50",
                    fontWeight: "bold",
                    zIndex: 2,
                    bottom: -20,
                  }}
                >
                  FREE
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>

      {/* Features Included */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
        >
          Everything You Need, All Free
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 5, maxWidth: 700, mx: "auto", textAlign: "center" }}
        >
          Get access to our complete suite of features designed specifically for travel and immigration agencies.
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60"
                alt="Centralized Client Management"
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Centralized Client Management
                </Typography>
                <Typography variant="body2">
                  Store all client information, documentation, and communication history in one secure location 
                  for easy access by your entire team.
                </Typography>
              </CardContent>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=60"
                alt="Visa Application Tracking"
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Visa Application Tracking
                </Typography>
                <Typography variant="body2">
                  Monitor every step of the visa application process with automated status updates, 
                  deadline reminders, and document checklists.
                </Typography>
              </CardContent>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop&q=60"
                alt="Travel Booking System"
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Travel Booking System
                </Typography>
                <Typography variant="body2">
                  Manage travel bookings, itineraries, and client preferences in one integrated system.
                </Typography>
              </CardContent>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/register')}
            size="large"
            sx={{
              bgcolor: "#4CAF50",
              "&:hover": { bgcolor: "#388E3C" },
              borderRadius: 8,
              px: 4,
              py: 1.5,
            }}
          >
            Start Using Opaige CRM Free
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Plans;
