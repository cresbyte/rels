import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Switch,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import ComputerIcon from '@mui/icons-material/Computer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import { useTheme } from "./ThemeContext";

const ThemeSwitcher = () => {
  const { currentTheme, setTheme, toggleHighContrast, isHighContrast, toggleTextSpacing, textSpacing } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isDarkMode = currentTheme === "dark";
  const isSystemMode = currentTheme === "system";

  const handleToggle = () => {
    setTheme(isDarkMode ? "light" : "dark");
    handleClose();
  };

  const handleSystemToggle = () => {
    setTheme("system");
    handleClose();
  };

  const handleHighContrastToggle = () => {
    toggleHighContrast();
  };
  
  const handleTextSpacingToggle = () => {
    toggleTextSpacing();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Visibility & Theme Settings">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "theme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
          sx={{ ml: 1 }}
        >
          {isDarkMode ? (
            <DarkModeOutlinedIcon fontSize="small" />
          ) : isSystemMode ? (
            <ComputerIcon fontSize="small" />
          ) : (
            <LightModeOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "theme-button",
          dense: true,
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 3,
            minWidth: 220,
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.5)"
                : "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.7, pt: 1.5, px: 2 }}>
          Theme
        </Typography>
        <MenuItem onClick={handleToggle} dense sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {isDarkMode ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}
            primaryTypographyProps={{ variant: "body2" }}
          />
          <Box component="span" sx={{ ml: 1 }}>
            <Switch
              size="small"
              checked={isDarkMode && !isSystemMode}
              onChange={handleToggle}
              color="primary"
              inputProps={{ "aria-label": "theme toggle" }}
            />
          </Box>
        </MenuItem>
        <MenuItem dense sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ComputerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="System Default"
            primaryTypographyProps={{ variant: "body2" }}
          />
          <Box component="span" sx={{ ml: 1 }}>
            <Switch
              size="small"
              checked={isSystemMode}
              onChange={handleSystemToggle}
              color="primary"
              inputProps={{ "aria-label": "system theme toggle" }}
            />
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ opacity: 0.7, px: 2, pb: 0.5 }}>
          Accessibility
        </Typography>
        <MenuItem dense sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="High Contrast Mode"
            secondary="Improves readability"
            primaryTypographyProps={{ variant: "body2" }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
          <Box component="span" sx={{ ml: 1 }}>
            <Switch
              size="small"
              checked={isHighContrast}
              onChange={handleHighContrastToggle}
              color="primary"
              inputProps={{ "aria-label": "high contrast toggle" }}
            />
          </Box>
        </MenuItem>
        <MenuItem dense sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <FormatLineSpacingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Increased Text Spacing"
            secondary="Easier to read text"
            primaryTypographyProps={{ variant: "body2" }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
          <Box component="span" sx={{ ml: 1 }}>
            <Switch
              size="small"
              checked={textSpacing}
              onChange={handleTextSpacingToggle}
              color="primary"
              inputProps={{ "aria-label": "text spacing toggle" }}
            />
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSwitcher;
