import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";

export default function Resources() {
  return (
    <>
      {/* Resources Section */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Elevate your agency operations!
        </Typography>
        <Typography variant="body1" sx={{ mb: 5, maxWidth: 700, mx: "auto" }}>
          Access valuable resources to streamline travel bookings, visa
          applications, and client communication
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#E3F2FD",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ color: "#2196F3" }}>
                  FAQ
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, textAlign: "left" }}
              >
                FAQ
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                Common questions about implementing Opaige CRM
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#FFEBEE",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ color: "#F44336" }}>
                  CS
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, textAlign: "left" }}
              >
                Case Studies
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                Success stories from travel and immigration agencies using
                Opaige
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                height: "100%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#E8F5E9",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ color: "#4CAF50" }}>
                  RG
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, textAlign: "left" }}
              >
                Resource Guide
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "left" }}>
                Best practices for managing clients and visa applications
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            mt: 4,
            p: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderRadius: 3,
            bgcolor: "#F0ECFF",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid md={7} size={{ xs: 12, md: 7 }} sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "#5F3DC4", fontWeight: "bold" }}
              >
                Industry Insights
              </Typography>
              <Typography
                variant="h5"
                component="h3"
                sx={{ fontWeight: "bold", mb: 2, color: "#5F3DC4" }}
              >
                Digital Transformation for Travel & Immigration Agencies
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Learn how to implement digital solutions that streamline client
                management, visa processing, and travel bookings.
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#5F3DC4",
                    "&:hover": { bgcolor: "#4527A0" },
                    borderRadius: 8,
                    px: 3,
                  }}
                >
                  Download Guide
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: "#5F3DC4",
                    "&:hover": { bgcolor: "rgba(95, 61, 196, 0.1)" },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60"
                alt="Digital Agency Management"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Container>

      {/* Contact & Login Section */}
      <Box id="contact" sx={{ py: 8, bgcolor: "rgba(59, 130, 246, 0.05)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Get in Touch
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Have questions about Opaige CRM? Our team is ready to help you
                streamline your agency operations.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Existing Users
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Already have an account? Log in to access your dashboard.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href="/login"
                  sx={{
                    borderRadius: 28,
                    px: 3,
                  }}
                >
                  Login to Dashboard
                </Button>
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Contact Information
              </Typography>
              <Typography variant="body2">Email: contact@opaige.com</Typography>
              <Typography variant="body2">Phone: (555) 123-4567</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Send us a message
                </Typography>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { mb: 2 } }}
                >
                  <TextField fullWidth label="Name" variant="outlined" />
                  <TextField fullWidth label="Email" variant="outlined" />
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 2,
                      borderRadius: 28,
                      py: 1.5,
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
