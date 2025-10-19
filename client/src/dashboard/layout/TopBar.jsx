import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  CreditCard,
  LogOut,
  Maximize,
  Settings,
  Signature,
  User
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeSwitcher from "../../context/ThemeSwitcher";
import { useAuth } from "../../auth/auth/AuthContext";

// Tab configuration
const TABS = [
  { label: "Home", value: "Home" },
  { label: "Public", value: "Public" },
  { label: "Documents", value: "Documents" },
  {label: "Contacts", value: "Contacts" },
  { label: "Upload", value: "Upload" },
];

function TopBar() {
  const {user, logout} = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const openMenu = Boolean(anchorEl);
  const openNotifications = Boolean(notificationAnchor);

  // Get current screen from URL
  const getCurrentScreen = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") return "Home";
    if (path === "/dashboard/documents") return "Documents";
    if (path.startsWith("/dashboard/documents/")) return "Documents";
    if (path === "/dashboard/upload") return "Upload";
    if (path === "/dashboard/signature") return "Signature";
    if (path === "/dashboard/profile") return "Profile";
    if (path === "/dashboard/contacts") return "Contacts";
    if( path === "/dashboard/plans") return "Plans";
    return "Home";
  };


  const currentScreen = getCurrentScreen();

  // Handle tab change with URL navigation
  const handleTabChange = (event, newValue) => {
    switch (newValue) {
      case "Home":
        navigate("/dashboard");
        break;
      case "Documents":
        navigate("/dashboard/documents");
        break;
      case "Contacts":
        navigate("/dashboard/contacts");
        break;
      case "Upload":
        navigate("/dashboard/upload");
        break;
      default:
        navigate("/dashboard");
    }
  };

  // User menu handlers
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };


  // Notification handlers
  const handleOpenNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Navigation handler
  const changeScreen = (screen) => {
    switch (screen) {
      case "Home":
        navigate("/dashboard");
        break;
      case "Profile":
        navigate("/dashboard/profile");
        break;
      case "Contacts":
        navigate("/dashboard/contacts");
        break;
      case "Signature":
        navigate("/dashboard/signature");
        break;
      case "Plans":
        navigate("/dashboard/plans");
        break;
      default:
        navigate("/dashboard");
    }
  };


  return (
    <AppBar
      position="fixed"
      component={motion.div}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      sx={{
        width: { sm: `calc(100% )` },
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(25, 25, 35, 0.85)"
            : "rgba(250, 250, 255, 0.85)",
        color: "text.primary",
        boxShadow: "none",
        borderRadius: 0,
        borderBottom:
          theme.palette.mode === "dark"
            ? "1px solid rgba(70, 70, 90, 0.12)"
            : "1px solid rgba(180, 200, 255, 0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        height: theme.spacing(8),
        borderLeft: "none",
        zIndex: 1100,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ minHeight: theme.spacing(8) }}>
        <Typography
          variant="h5"
          color="secondary"
          component={Link}
          sx={{ textDecoration: "none", cursor: "pointer" }}
          onClick={() => changeScreen("Home")}
        >
          Signer
        </Typography>

        {/* Main Navigation Tabs */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={currentScreen}
            onChange={handleTabChange}
            aria-label="main navigation tabs"
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              minHeight: 48,
              "& .MuiTabs-flexContainer": {
                gap: 2,
              },
              "& .MuiTab-root": {
                minHeight: 48,
                textTransform: "none",
                fontWeight: 500,
                px: 2,
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={{
                  opacity: currentScreen === tab.value ? 1 : 0.7,
                  "&:hover": {
                    opacity: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Stack spacing={1} direction="row" alignItems="center">
          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ scale: 1 }}
          >
            <IconButton
              onClick={handleOpenNotifications}
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(80, 110, 190, 0.05)"
                    : "rgba(190, 210, 255, 0.05)",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(80, 110, 190, 0.15)"
                      : "rgba(190, 210, 255, 0.15)",
                },
                borderRadius: 1,
                p: 1,
              }}
            >
              <Badge badgeContent={3} color="error">
                <Bell size={18} />
              </Badge>
            </IconButton>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ scale: 1 }}
          >
            <IconButton
              onClick={toggleFullscreen}
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(80, 110, 190, 0.05)"
                    : "rgba(190, 210, 255, 0.05)",
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(80, 110, 190, 0.15)"
                      : "rgba(190, 210, 255, 0.15)",
                },
                borderRadius: 1,
                p: 1,
              }}
            >
              <Maximize size={18} />
            </IconButton>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ scale: 1 }}
          >
            <ThemeSwitcher />
          </motion.div>

          <Tooltip title="Account settings">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IconButton
                onClick={handleOpenUserMenu}
                size="small"
                edge="end"
                aria-controls={openMenu ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                sx={{
                  p: 0.2,
                  border: "2px solid transparent",
                  "&:hover": {
                    borderColor: theme.palette.primary.light,
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {user?.profile_pic ? (
                  <Avatar
                    src={user.profile_pic}
                    alt={`${user?.first_name} ${user?.last_name}`}
                    sx={{ width: 36, height: 36 }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                      fontSize: 14,
                      boxShadow: "0 4px 8px rgba(80, 72, 229, 0.3)",
                    }}
                  >
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </Avatar>
                )}
              </IconButton>
            </motion.div>
          </Tooltip>
        </Stack>

        {/* User menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openMenu}
          onClose={handleCloseUserMenu}
          onClick={handleCloseUserMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1.5,
              width: 220,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.palette.background.paper,
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ p: 1.5, pb: 0 }}>
            <Typography
              component="div"
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              Signed in as
            </Typography>
            <Typography component="div" variant="body2" fontWeight={600} noWrap>
              {user?.email || "Loading..."}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          <Box sx={{ px: 1 }}>
            <motion.div whileHover={{ x: 5 }}>
              <MenuItem
                onClick={() => changeScreen("Profile")}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                <Typography variant="body2">My Profile</Typography>
              </MenuItem>
            </motion.div>  <motion.div whileHover={{ x: 5 }}>
              <MenuItem
                onClick={() => changeScreen("Signature")}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon>
                  <Signature size={18} />
                </ListItemIcon>
                <Typography variant="body2">Signature</Typography>
              </MenuItem>
            </motion.div>

            <motion.div whileHover={{ x: 5 }}>
              <MenuItem
                onClick={() => changeScreen("Plans")}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon>
                  <CreditCard size={18} />
                </ListItemIcon>
                <Typography variant="body2">My Plan</Typography>
              </MenuItem>
            </motion.div>

          
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ px: 1, pb: 1 }}>
            <motion.div
              whileHover={{ x: 5, backgroundColor: "rgba(244, 67, 54, 0.08)" }}
            >
              <MenuItem
                onClick={logout}
                sx={{
                  borderRadius: 1,
                  color: "error.main",
                }}
              >
                <ListItemIcon sx={{ color: "error.main" }}>
                  <LogOut size={18} />
                </ListItemIcon>
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </motion.div>
          </Box>
        </Menu>

        {/* Notifications Menu (same as before) */}
        <Menu
          anchorEl={notificationAnchor}
          open={openNotifications}
          onClose={handleCloseNotifications}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1.5,
              width: 320,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: theme.palette.background.paper,
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.3,
                staggerChildren: 0.1,
              }}
            >
              <MenuItem component={motion.div} whileHover={{ x: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      mt: 0.8,
                      mr: 1.5,
                      boxShadow: "0 0 0 3px rgba(80, 72, 229, 0.2)",
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      New client registration completed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5 minutes ago
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem component={motion.div} whileHover={{ x: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                      mt: 0.8,
                      mr: 1.5,
                      boxShadow: "0 0 0 3px rgba(255, 170, 0, 0.2)",
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Task deadline approaching: Client Review
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem component={motion.div} whileHover={{ x: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                      mt: 0.8,
                      mr: 1.5,
                      boxShadow: "0 0 0 3px rgba(0, 200, 83, 0.2)",
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Payment received from John Doe
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Yesterday
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </motion.div>
          </AnimatePresence>
          <Divider />
          <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
            <Button
              size="small"
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{ borderRadius: 5, px: 2 }}
            >
              View All Notifications
            </Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
