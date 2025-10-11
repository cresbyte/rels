import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export function Navbar({ toggleTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
  ];

  const handleSmoothScroll = (event, targetId) => {
    event.preventDefault();
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={trigger ? 1 : 0}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: trigger
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(255, 255, 255, 0.6)",
          transition: "all 0.3s",
          py: trigger ? 0.5 : 1,
          borderBottom: trigger
            ? `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)"
              }`
            : "none",
          zIndex: 1100,
        }}
      >
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo */}

            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1 }}
              onClick={() => navigate("/")}
            >
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

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    href={link.href}
                    color="inherit"
                    sx={{ mx: 1 }}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/login")}
                  sx={{
                    ml: 2,
                    borderRadius: 28,
                    px: 2,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/register")}
                  sx={{
                    ml: 2,
                    borderRadius: 28,
                    px: 2,
                  }}
                  endIcon={<ChevronRightIcon />}
                >
                  Get Started
                </Button>
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={toggleTheme}
                  color="inherit"
                >
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={toggleTheme}
                  color="inherit"
                >
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="top"
        open={isMobile && isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            top: "64px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.href}
              component="a"
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: 28,
                mt: 1,
              }}
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate("/register")}
              sx={{
                borderRadius: 28,
                mt: 1,
                mb: 2,
              }}
              endIcon={<ChevronRightIcon />}
            >
              Get Started
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
