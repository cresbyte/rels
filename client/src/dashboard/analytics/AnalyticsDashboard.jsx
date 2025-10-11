import {
  Alert,
  alpha,
  Box,
  CircularProgress,
  Grid,
  Stack,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardStatistics from "./DashboardStatistics";
import MySignatures from "./MySignatures";
import RecentDocuments from "./RecentDocuments";
import UploadDocuments from "../documents/UploadFlow";

const AnalyticsDashboard = ({ refreshKey }) => {
  const theme = useTheme();
  // DashboardPage state
  const [pageData, setPageData] = useState({
    summary: null,
    revenueTimeSeries: null,
    applicationsStatus: null,
    pipelineProgress: null,
  });

  // DashboardLayout state
  const [layoutData, setLayoutData] = useState({
    staffData: null,
    leadSourcesData: null,
    tasksPriorityData: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define chart colors - Enhanced color palette
  const COLORS = {
    primary: theme.palette.primary.main,
    primaryLight: alpha(theme.palette.primary.main, 0.7),
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
    grey: theme.palette.grey[400],
  };

  const STATUS_COLORS = {
    completed: COLORS.success,
    in_progress: COLORS.warning,
    pending: COLORS.grey,
  };

  const COLORS_ARRAY = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch DashboardPage data
        const [
          summaryRes,
          revenueRes,
          applicationsStatusRes,
          pipelineProgressRes,
        ] = await Promise.all([
          api.get("summary/"),
          api.get("revenue-time-series/"),
          api.get("applications-status/"),
          api.get("pipeline-progress/"),
        ]);

        const summaryData = summaryRes.data;
        const revenueData = revenueRes.data;
        const applicationsStatusData = applicationsStatusRes.data;
        const pipelineProgressData = pipelineProgressRes.data;

        // Verify that applications status data has the expected structure
        const validApplicationsStatus = Array.isArray(applicationsStatusData)
          ? applicationsStatusData
          : [];

        setPageData({
          summary: summaryData,
          revenueTimeSeries: revenueData,
          applicationsStatus: validApplicationsStatus,
          pipelineProgress: pipelineProgressData,
        });

        // Fetch DashboardLayout data
        const [staffResponse, leadSourcesResponse, tasksPriorityResponse] =
          await Promise.all([
            api.get("staff-performance/"),
            api.get("lead-sources/"),
            api.get("tasks-priority/"),
          ]);

        const staffData = staffResponse.data;
        const leadSourcesData = leadSourcesResponse.data;
        const tasksPriorityData = tasksPriorityResponse.data;

        setLayoutData({
          staffData: staffData,
          leadSourcesData: leadSourcesData,
          tasksPriorityData: tasksPriorityData,
        });

        console.log("All dashboard data loaded successfully");
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();

    // Set up polling for real-time updates (every 5 minutes)
    const intervalId = setInterval(fetchAllDashboardData, 300000);

    return () => clearInterval(intervalId);
  }, [refreshKey]);

  // We're using a full-screen loading state to prevent layout jumps
  if (loading && !pageData.summary) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        {/* Skeleton for statistics cards */}
        <DashboardStatistics loading={true} />

        {/* Skeleton for main chart area */}
        <Box
          sx={{
            width: "100%",
            height: "400px",
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>

        {/* Skeleton for staff performance and leaderboard */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: "300px",
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: "300px",
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>

        {/* Skeleton for lead sources */}
        <Box
          sx={{
            width: "100%",
            height: "300px",
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 1,
            mt: 2,
          }}
        />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={6}>
      {/* Dashboard Statistics */}
      <DashboardStatistics summary={pageData.summary} loading={loading} />
      <MySignatures />
      <RecentDocuments />
    </Stack>
  );
};

export default AnalyticsDashboard;
