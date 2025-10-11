import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

// Base theme configuration that applies to all themes
const baseThemeConfig = {
  shape: {
    borderRadius: 2,
  },
  shadows: [
    'none',
    'none',  // elevation1 - removed shadow
    'none',  // elevation2 - removed shadow 
    'none',  // elevation3 - removed shadow
    'none',  // elevation4 - removed shadow
    'none',  // elevation5 - removed shadow
    ...Array(19).fill('none')           // Remaining shadow levels
  ],
  customShadows: {
    none: 'none',
    card: 'none', // Removed shadow
    dropdown: 'none', // Removed shadow
    dialog: 'none', // Removed shadow
    popup: 'none', // Removed shadow
  },
  borderRadius: {
    small: 0,
    default: 0,
    medium: 0,
    large: 0,
    xl: 0,
    circle: '50%',
  },
  typography: {
    fontFamily: 'nunito, sans-serif',
    fontSize: 15, // Increased from 14 for better readability
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600, // Reduced from 700 for softer appearance
      letterSpacing: "-0.01em", // Reduced letter spacing
      lineHeight: 1.3, // Increased line height
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500, // Reduced from 600
      letterSpacing: "0em", // Removed negative letter spacing
      lineHeight: 1.4, // Increased line height
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500, // Reduced from 600
      letterSpacing: "0em", // Removed negative letter spacing
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500, // Reduced from 600
      letterSpacing: "0em", // Removed negative letter spacing
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500, // Reduced from 600
      letterSpacing: "0em", // Removed negative letter spacing
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500, // Reduced from 600
      letterSpacing: "0em",
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem", // Increased from 0.95rem
      letterSpacing: "0em",
      lineHeight: 1.7, // Increased line height
    },
    body2: {
      fontSize: "0.9375rem", // Increased from 0.875rem
      letterSpacing: "0em",
      lineHeight: 1.7, // Increased line height
    },
    caption: {
      fontSize: "0.8125rem", // Increased from 0.75rem
      letterSpacing: "0em",
      lineHeight: 1.6, // Increased line height
    },
    button: {
      fontSize: "0.9375rem", // Increased from 0.875rem
      fontWeight: 500, // Reduced from 600
      letterSpacing: "0em",
      textTransform: "none",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "0em",
      lineHeight: 1.6, // Increased line height
    },
    subtitle2: {
      fontSize: "0.9375rem", // Increased from 0.875rem
      fontWeight: 500,
      letterSpacing: "0em",
      lineHeight: 1.6, // Increased line height
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "0",
          },
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          borderRadius: 0,
          padding: "10px 24px",
          fontSize: "0.875rem",
          boxShadow: "none",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "none",
            transform: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
          "&:focus": {
            boxShadow: "none",
          },
        }),
        sizeMedium: {
          height: "42px",
        },
        sizeSmall: ({ theme }) => ({
          height: "34px",
          padding: "6px 16px",
          borderRadius: 0,
        }),
        sizeLarge: ({ theme }) => ({
          height: "50px",
          padding: "12px 28px",
          fontSize: "1rem",
          borderRadius: 0,
        }),
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
          "&:focus": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderWidth: "1px",
          "&:hover": {
            borderWidth: "1px",
            boxShadow: "none",
          },
        },
        text: {
          padding: "10px 16px",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backdropFilter: "none",
          elevation: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRight: "none",
          boxShadow: "none",
          borderRadius: "0",
          elevation: 0,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          borderRadius: 0,
          border: '1px solid rgba(0, 0, 0, 0.04)',
          elevation: 0,
          backgroundImage: "none",
        }),
        elevation1: {
          boxShadow: "none",
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
        elevation2: {
          boxShadow: "none",
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
        elevation4: {
          boxShadow: "none",
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
        elevation8: {
          boxShadow: "none",
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
        elevation12: {
          boxShadow: "none",
        },
        elevation16: {
          boxShadow: "none",
        },
        elevation24: {
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 0,
          boxShadow: "none",
          border: '1px solid rgba(0, 0, 0, 0.04)',
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 20px",
        },
        title: {
          fontSize: "1.15rem",
          fontWeight: 600,
        },
        subheader: {
          fontSize: "0.75rem",
          opacity: 0.7,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px 20px",
          "&:last-child": {
            paddingBottom: "20px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontSize: "0.9375rem",
          transition: "border-color 0.2s ease-in-out",
          "& fieldset": {
            borderWidth: "1px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.18)",
          },
          "&.Mui-focused": {
            boxShadow: "none",
          },
          "&.Mui-error": {
            boxShadow: "none",
          },
          boxShadow: "none",
        },
        input: {
          padding: "14px 16px",
        },
        multiline: {
          padding: "14px 16px",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          "&::before, &::after": {
            display: "none",
          },
          "&.Mui-focused": {
            boxShadow: "none",
          },
          boxShadow: "none",
        },
        input: {
          padding: "14px 16px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.9375rem",
          fontWeight: 500,
        },
        outlined: {
          transform: "translate(16px, 14px) scale(1)",
          "&.MuiInputLabel-shrink": {
            transform: "translate(16px, -8px) scale(0.75)",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 2,
          marginRight: 2,
          fontSize: "0.8125rem",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "14px 16px",
          fontSize: "0.9375rem",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.9375rem",
          padding: "10px 16px",
          borderRadius: 0,
          margin: "2px 6px",
          width: "calc(100% - 12px)",
          transition: "background-color 0.1s ease-in-out",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: "10px 16px",
          transition: "background-color 0.15s ease-in-out",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "40px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "0.9375rem",
          fontWeight: 500,
        },
        secondary: {
          fontSize: "0.8125rem",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: "background-color 0.15s ease-in-out",
          padding: "10px 16px",
          "&.Mui-selected": {
            fontWeight: 500,
            backgroundColor: "rgba(108, 92, 231, 0.06)",
          },
          "&:hover": {
            transform: "none",
            boxShadow: "none",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "0.9375rem",
          fontWeight: 500,
          minHeight: "48px",
          padding: "12px 16px",
          transition: "all 0.2s ease-in-out",
          borderRadius: "0 0 0 0",
          "&.Mui-selected": {
            fontWeight: 500,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: "0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.9375rem",
          padding: "16px 18px",
          lineHeight: 1.5,
        },
        head: {
          fontWeight: 500,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          elevation: 0,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.1s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.01)", // Reduced intensity
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: "none",
          borderColor: "transparent",
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: "30px",
          borderRadius: 0,
          fontSize: "0.8125rem",
          fontWeight: 500,
          transition: "none",
          boxShadow: "none",
          "&:hover": {
            transform: "none",
            boxShadow: "none",
          },
        },
        sizeSmall: {
          height: "24px",
          fontSize: "0.75rem",
          borderRadius: 0,
        },
        colorPrimary: {
          boxShadow: "none",
        },
        colorSecondary: {
          boxShadow: "none",
        },
        outlined: {
          boxShadow: "none",
        },
        filled: {
          boxShadow: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: "none",
          elevation: 0,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 500, // Reduced from 600
          padding: "20px 24px 12px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "12px 24px 20px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 24px 20px",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.8125rem",
          fontWeight: 400,
          backgroundColor: "rgba(0, 0, 0, 0.68)",
          borderRadius: 0,
          padding: "6px 10px",
          boxShadow: "none",
        },
        arrow: {
          color: "rgba(0, 0, 0, 0.68)",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 500,
          fontSize: "0.75rem",
          minWidth: "20px",
          height: "20px",
          borderRadius: 0,
          boxShadow: "none",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: "14px 16px",
          boxShadow: "none",
        },
        message: {
          padding: "6px 0",
          fontSize: "0.9375rem", // Increased from 0.875rem
        },
        icon: {
          padding: "6px 0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.05)", // Lighter color
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: 6,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        circle: {
          strokeLinecap: "round",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          gap: "4px",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 500,
          boxShadow: "none",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          elevation: 0,
          border: "1px solid rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          elevation: 0,
          border: "1px solid rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
};

// Light Theme - Matches the image with cleaner styling
export const lightTheme = createTheme({
  ...baseThemeConfig,
  palette: {
    mode: "light",
    primary: {
      light: "#8E9EF3",
      main: "#5E65F5",
      dark: "#3A43D1",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FA7696",
      main: "#FF6E70",
      dark: "#E03257",
      contrastText: "#fff",
    },
    error: {
      light: "#FFA9A9",
      main: "#FF4D4F",
      dark: "#CC3333",
      contrastText: "#fff",
    },
    warning: {
      light: "#FFDA77",
      main: "#FFBE2E",
      dark: "#E69B00",
      contrastText: "#fff",
    },
    info: {
      light: "#96E0FF",
      main: "#21BDFD",
      dark: "#0097E6",
      contrastText: "#fff",
    },
    success: {
      light: "#A5E9D3",
      main: "#52C41A",
      dark: "#2EA37F",
      contrastText: "#fff",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#f5f5f5",
      A200: "#eeeeee",
      A400: "#bdbdbd",
      A700: "#616161",
    },
    text: {
      primary: "#262626",
      secondary: "#616161",
      disabled: "#9e9e9e",
    },
    divider: "rgba(0, 0, 0, 0.08)",
    background: {
      default: "#f8f9fa",
      paper: "#ffffff"
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      selected: "rgba(94, 101, 245, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      focus: "rgba(94, 101, 245, 0.12)",
    },
  },
  components: {
    ...baseThemeConfig.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiCssBaseline?.styleOverrides,
        body: {
          ...baseThemeConfig.components.MuiCssBaseline?.styleOverrides?.body,
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: theme => theme.palette.mode === "light" 
              ? "linear-gradient(135deg, #F6F8FF 0%, #FFFFFF 100%)"
              : "linear-gradient(135deg, #111827 0%, #1E293B 100%)",
            zIndex: -1
          },
          minHeight: "100vh",
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(124, 93, 250, 0.3)",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiDrawer?.styleOverrides,
        paper: {
          ...baseThemeConfig.components.MuiDrawer?.styleOverrides?.paper,
          background: "#FFFFFF",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiCard?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiCard?.styleOverrides?.root,
          boxShadow: "none",
          backgroundColor: "#ffffff",
          border: '1px solid rgba(0, 0, 0, 0.07)',
          borderRadius: 1,
          overflow: "hidden",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "none",
            transform: "none",
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiListItemButton?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiListItemButton?.styleOverrides?.root,
          "&.Mui-selected": {
            color: "#7C5DFA",
            fontWeight: 600,
            backgroundColor: alpha("#7C5DFA", 0.08),
            borderLeft: "3px solid #7C5DFA",
            "&:hover": {
              backgroundColor: alpha("#7C5DFA", 0.12),
            },
          },
          "&:hover": {
            backgroundColor: alpha("#7C5DFA", 0.04),
            transform: "none",
            borderLeft: "3px solid transparent",
          },
          paddingLeft: "13px",
          borderLeft: "3px solid transparent",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiBadge?.styleOverrides,
        badge: {
          ...baseThemeConfig.components.MuiBadge?.styleOverrides?.badge,
          "&.MuiBadge-standard": {
            background: "#FF4CAB",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiAvatar?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiAvatar?.styleOverrides?.root,
          borderColor: "#FFFFFF",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiButton?.styleOverrides,
        containedPrimary: {
          background: "#7C5DFA",
        },
        containedSecondary: {
          background: "#FF4CAB",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiAppBar?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiAppBar?.styleOverrides?.root,
          boxShadow: "none",
          background: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.07)",
          color: "#2d3436",
          elevation: 0,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.15)",
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiOutlinedInput?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiOutlinedInput?.styleOverrides?.root,
          boxShadow: "none",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiTableContainer?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiTableContainer?.styleOverrides?.root,
          borderRadius: 1,
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "none",
          elevation: 0,
        },
      },
    },
  },
});

// Dark Theme - With cleaner styling to match the image aesthetic
export const darkTheme = createTheme({
  ...baseThemeConfig,
  palette: {
    mode: "dark",
    primary: {
      light: "#8E9EF3",
      main: "#7981EA",
      dark: "#3A43D1",
      contrastText: "#fff",
    },
    secondary: {
      light: "#FA7696",
      main: "#FF6E70",
      dark: "#E03257",
      contrastText: "#fff",
    },
    error: {
      light: "#FFA9A9",
      main: "#FF4D4F",
      dark: "#CC3333",
      contrastText: "#fff",
    },
    warning: {
      light: "#FFDA77",
      main: "#FFBE2E",
      dark: "#E69B00",
      contrastText: "#fff",
    },
    info: {
      light: "#96E0FF",
      main: "#21BDFD",
      dark: "#0097E6",
      contrastText: "#fff",
    },
    success: {
      light: "#A5E9D3",
      main: "#52C41A",
      dark: "#2EA37F",
      contrastText: "#fff",
    },
    grey: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#f5f5f5",
      A200: "#eeeeee",
      A400: "#bdbdbd",
      A700: "#616161",
    },
    text: {
      primary: "#f8f9fa",
      secondary: "#adb5bd",
      disabled: "#9e9e9e",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    background: {
      default: "#151521",
      paper: "#1e1e2d"
    },
    action: {
      active: "rgba(255, 255, 255, 0.54)",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(121, 129, 234, 0.16)",
      disabled: "rgba(255, 255, 255, 0.26)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      focus: "rgba(121, 129, 234, 0.12)",
    },
  },
  components: {
    ...baseThemeConfig.components,
    MuiCssBaseline: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiCssBaseline?.styleOverrides,
        body: {
          ...baseThemeConfig.components.MuiCssBaseline?.styleOverrides?.body,
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: theme => theme.palette.mode === "light" 
              ? "linear-gradient(135deg, #F6F8FF 0%, #FFFFFF 100%)"
              : "linear-gradient(135deg, #111827 0%, #1E293B 100%)",
            zIndex: -1
          },
          minHeight: "100vh",
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiButton?.styleOverrides,
        containedPrimary: {
          background: "#7C5DFA",
        },
        containedSecondary: {
          background: "#FF4CAB",
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.23)",
        },
        text: {
          color: "#F7FAFC",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiPaper?.styleOverrides,
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 1,
          elevation: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiCard?.styleOverrides,
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backgroundColor: "#1E293B",
          borderRadius: 1,
          "&:hover": {
            boxShadow: "none",
            transform: "none",
            borderColor: "rgba(255, 255, 255, 0.1)",
          },
          elevation: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiAppBar?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiAppBar?.styleOverrides?.root,
          backgroundImage: "none",
          boxShadow: "none",
          backdropFilter: "none",
          background: "#1E293B",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          elevation: 0,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiDrawer?.styleOverrides,
        paper: {
          ...baseThemeConfig.components.MuiDrawer?.styleOverrides?.paper,
          background: "#1E293B",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiTableCell?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiTableCell?.styleOverrides?.root,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        },
        head: {
          ...baseThemeConfig.components.MuiTableCell?.styleOverrides?.head,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiOutlinedInput?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiOutlinedInput?.styleOverrides?.root,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.25)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7C5DFA",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiFilledInput?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiFilledInput?.styleOverrides?.root,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiListItemButton?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiListItemButton?.styleOverrides?.root,
          "&.Mui-selected": {
            color: "#9277FF",
            fontWeight: 600,
            backgroundColor: alpha("#9277FF", 0.12),
            "&:hover": {
              backgroundColor: alpha("#9277FF", 0.16),
            },
          },
          "&:hover": {
            backgroundColor: alpha("#9277FF", 0.08),
            transform: "none",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiListItem?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiListItem?.styleOverrides?.root,
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiAvatar?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiAvatar?.styleOverrides?.root,
          borderColor: "#1E293B",
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiChip?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiChip?.styleOverrides?.root,
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
        filled: {
          backgroundColor: "rgba(255, 255, 255, 0.12)",
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiTabs?.styleOverrides,
        indicator: {
          ...baseThemeConfig.components.MuiTabs?.styleOverrides?.indicator,
          background: "#7C5DFA",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        ...baseThemeConfig.components.MuiAlert?.styleOverrides,
        root: {
          ...baseThemeConfig.components.MuiAlert?.styleOverrides?.root,
          borderLeft: "4px solid",
        },
        standardError: {
          backgroundColor: "rgba(255, 108, 123, 0.12)",
          borderLeftColor: "#FF6C7B",
        },
        standardWarning: {
          backgroundColor: "rgba(255, 185, 48, 0.12)",
          borderLeftColor: "#FFB930",
        },
        standardInfo: {
          backgroundColor: "rgba(97, 160, 255, 0.12)",
          borderLeftColor: "#61A0FF",
        },
        standardSuccess: {
          backgroundColor: "rgba(0, 210, 198, 0.12)",
          borderLeftColor: "#00D2C6",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          elevation: 0,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          elevation: 0,
        },
      },
    },
  },
});

// Export themes for use in the application
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  system: window?.matchMedia?.('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme
};

// Function to create high contrast versions of themes
export const getHighContrastTheme = (themeType) => {
  const baseTheme = themes[themeType] || themes.light;
  
  // Create a high contrast version
  return createTheme({
    ...baseTheme,
    shape: {
      borderRadius: 1,
    },
    palette: {
      ...baseTheme.palette,
      background: {
        default: themeType === 'dark' ? '#000000' : '#ffffff',
        paper: themeType === 'dark' ? '#121212' : '#ffffff',
      },
      text: {
        primary: themeType === 'dark' ? '#ffffff' : '#000000',
        secondary: themeType === 'dark' ? '#e0e0e0' : '#333333',
      },
      primary: {
        ...baseTheme.palette.primary,
        main: themeType === 'dark' ? '#9085FF' : '#5732F0',
        contrastText: '#ffffff',
      },
      divider: themeType === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
    },
    typography: {
      ...baseTheme.typography,
      fontWeight: 500,
      body1: {
        ...baseTheme.typography.body1,
        fontWeight: 500,
        letterSpacing: '0.015em',
      },
      body2: {
        ...baseTheme.typography.body2,
        fontWeight: 500,
        letterSpacing: '0.015em',
      },
    },
    components: {
      ...baseTheme.components,
      MuiPaper: {
        styleOverrides: {
          ...baseTheme.components.MuiPaper?.styleOverrides,
          root: {
            ...baseTheme.components.MuiPaper?.styleOverrides?.root,
            boxShadow: "none",
            borderRadius: 1,
            border: themeType === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.15)' 
              : '1px solid rgba(0, 0, 0, 0.15)',
            elevation: 0,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          ...baseTheme.components.MuiCard?.styleOverrides,
          root: {
            ...baseTheme.components.MuiCard?.styleOverrides?.root,
            boxShadow: "none",
            borderRadius: 1,
            border: themeType === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.15)' 
              : '1px solid rgba(0, 0, 0, 0.15)',
            elevation: 0,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            elevation: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
            elevation: 0,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
            elevation: 0,
          },
        },
      },
    },
  });
};

export default themes;