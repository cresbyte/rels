import {
  ArrowDownward,
  ArrowUpward
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Card,
  Grid,
  Skeleton,
  Typography,
  useTheme
} from "@mui/material";
import { FileArchive, FileCheck2, FilePenLine, FileWarning } from "lucide-react";
import React from "react";

// Custom components
const StatCard = ({ title, value, icon, change, color, loading }) => {
  const theme = useTheme();
  const isPositive = change >= 0;
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        p: 0,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[10],
        }
      }}
    >
      {loading ? (
        <Box p={3}>
          {/* The top highlight band */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: color,
            }}
          />
          
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              right: -10,
              bottom: -10,
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: alpha(color, 0.04),
              zIndex: 0
            }}
          />
          
          {/* Icon placeholder */}
          <Box
            sx={{
              position: "absolute",
              top: '16px',
              right: '16px',
              width: '24px',
              height: '24px',
            }}
          >
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          
          {/* Title skeleton */}
          <Skeleton variant="text" width="60%" height={20} />
          
          {/* Value skeleton */}
          <Skeleton variant="text" width="40%" height={40} sx={{ my: 1.5 }} />
          
          {/* Change percentage skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Skeleton variant="circular" width={14} height={14} sx={{ mr: 0.5 }} />
            <Skeleton variant="text" width="30%" height={16} />
          </Box>
        </Box>
      ) : (
        <>
          {/* Subtle highlight band at top */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: color,
            }}
          />
          
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              right: -10,
              bottom: -10,
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: alpha(color, 0.04),
              zIndex: 0
            }}
          />

          <Box sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Typography
              variant="body2"
              sx={{ 
                fontWeight: 500, 
                color: theme.palette.text.secondary,
                opacity: 0.8,
                mb: 1
              }}
            >
              {title}
            </Typography>
            
            <Typography
              variant="h4"
              component="div"
              sx={{ 
                fontWeight: 600, 
                mb: 1.5,
                color: theme.palette.text.primary
              }}
            >
              {value}
            </Typography>
            
            {change !== undefined && (
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  mt: 1
                }}
              >
                {isPositive ? (
                  <ArrowUpward
                    sx={{
                      fontSize: 14,
                      color: theme.palette.success.main,
                      mr: 0.5,
                    }}
                  />
                ) : (
                  <ArrowDownward
                    sx={{
                      fontSize: 14,
                      color: theme.palette.error.main,
                      mr: 0.5,
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  color={isPositive ? "success.main" : "error.main"}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: "0.75rem"
                  }}
                >
                  {Math.abs(change)}% {isPositive ? "increase" : "decrease"}
                </Typography>
              </Box>
            )}
            
            <Box
              sx={{
                position: "absolute",
                top: '16px',
                right: '16px',
                opacity: 0.9,
              }}
            >
              {React.cloneElement(icon, { 
                size: 24,
                color: color
              })}
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
};

const DashboardStatistics = ({ summary, loading }) => {
  const theme = useTheme();
  
  // Define colors based on the Mantis Dashboard palette
  const COLORS = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: '#2196f3', // Using a specific blue shade from Mantis
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Total Documents"
          value={summary?.total_active_clients || 0}
          icon={<FileArchive />}
          color={COLORS.primary}
          loading={loading}
          change={12}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Completed"
          value={`$${parseFloat(summary?.total_revenue || 0).toLocaleString()}`}
          icon={<FileCheck2 />}
          change={18}
          color={COLORS.success}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Public Forms"
          value={summary?.total_applications || 0}
          icon={<FilePenLine />}
          change={5}
          color={COLORS.info}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          title="Pending Signatures"
          value={summary?.completed_applications || 0}
          icon={<FileWarning />}
          color={COLORS.secondary}
          change={-3}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStatistics;