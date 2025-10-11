import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

const NotFound = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ my: 6, flexGrow: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center", pt: "8rem" }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 6,
            color: "#555555",
            textAlign: "center",
            maxWidth: 800,
            mx: "auto",
          }}
        >
          Oops! The page you’re looking for doesn’t exist or has been moved.
          Don’t worry, we’ll help you get back on track with Opaige CRM’s
          resources and support.
        </Typography>

        <Box
          sx={{
            p: 4,
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            mb: 6,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AlertTriangle size={24} color="#FF9800" />
            <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1 }}>
              Let’s Get You Back
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Here are some quick links to help you find what you need:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={
                  <Button
                    component={RouterLink}
                    to="/"
                    startIcon={<ArrowRight size={18} />}
                    sx={{ color: "#2b7ae0" }}
                  >
                    Home Page
                  </Button>
                }
                secondary="Explore Opaige CRM’s features and benefits."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Button
                    component={RouterLink}
                    to="/resources"
                    startIcon={<ArrowRight size={18} />}
                    sx={{ color: "#2b7ae0" }}
                  >
                    Resources
                  </Button>
                }
                secondary="Access guides on client management, revenue optimization, and more."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Button
                    component={RouterLink}
                    to="/contact"
                    startIcon={<ArrowRight size={18} />}
                    sx={{ color: "#2b7ae0" }}
                  >
                    Contact Support
                  </Button>
                }
                secondary="Reach out to our 24/7 support team for assistance."
              />
            </ListItem>
          </List>
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/"
              sx={{ bgcolor: "#2b7ae0", "&:hover": { bgcolor: "#1a5fb7" } }}
            >
              Return to Home
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            p: 4,
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <ArrowRight size={24} color="#4CAF50" />
            <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1 }}>
              Explore More Resources
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            - <strong>Implementation Guide</strong>: Learn how to set up Opaige
            CRM for your agency.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            - <strong>Revenue Optimization</strong>: Discover strategies to
            boost your agency’s income.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            - <strong>Client Retention</strong>: Build lasting relationships
            with personalized services.
          </Typography>
          <Typography variant="body2">
            - <strong>API Documentation</strong>: Integrate Opaige with your
            existing systems.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default NotFound;
