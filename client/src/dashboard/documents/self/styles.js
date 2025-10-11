import { styled, alpha } from "@mui/material/styles";
import { Button } from "@mui/material";

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  transition: "all 0.2s ease",
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  "&:hover": {
    transform: "translateY(-1px)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.primary.main, 0.1)
        : alpha(theme.palette.primary.main, 0.05),
    boxShadow: "none",
  },
  "&.MuiButton-contained": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));
