import {
  Box,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
  Link,
} from "@mui/material";
import { Facebook, Instagram, Twitter, ArrowBigDown } from "lucide-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <Container maxWidth="" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", mb: 6 }}
        >
          Resources & Support
        </Typography>

        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Company
            </Typography>
            <List disablePadding>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/about"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">About Opaige</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Typography variant="body2">Agency Solutions</Typography>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Contact Us</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Typography variant="body2">Partner Program</Typography>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Typography variant="body2">Careers</Typography>
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Resources & Policies
            </Typography>
            <List disablePadding>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/implementation-guide"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Implementation Guide</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/faq"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">FAQs</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/service-guarantee"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Service Guarantee</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/api-documentation"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Opaige API Documentation
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/integration-partners"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Integration Partners</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/developer-resources"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Developer Resources</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/security-center"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Security Center</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/terms-of-service"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Terms of Service</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/privacy-policy"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Privacy Policy</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/data-processing-agreement"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Data Processing Agreement
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/system-status"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">System Status</Typography>
                </Link>
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Industry Resources
            </Typography>
            <List disablePadding>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/travel-agency-best-practices"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Travel Agency Best Practices
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/immigration-compliance-guide"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Immigration Compliance Guide
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/client-management-guide"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Client Management Guide
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/digital-transformation-roadmap"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Digital Transformation Roadmap
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/visa-processing-optimization"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Visa Processing Optimization
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/remote-team-management"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Remote Team Management
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/agency-growth-strategies"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Agency Growth Strategies
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/booking-optimization"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Booking Optimization</Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/client-retention-techniques"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Client Retention Techniques
                  </Typography>
                </Link>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/resources/revenue-optimization-guide"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">
                    Revenue Optimization Guide
                  </Typography>
                </Link>
              </ListItem>
            </List>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Get in Touch
            </Typography>
            <List disablePadding>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Typography variant="body2">+1 (302)-208-7494</Typography>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Typography variant="body2">support@opaige.io</Typography>
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <Link
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Typography variant="body2">Schedule a Demo</Typography>
                </Link>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Box sx={{ py: 4, borderTop: "1px solid #eaeaea" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2025 Opaige. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton size="small" sx={{ color: "#666" }}>
                <Facebook size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: "#666" }}>
                <Twitter size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: "#666" }}>
                <Instagram size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: "#666" }}>
                <ArrowBigDown size={18} />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
