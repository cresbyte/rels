import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Paper,
  Stack,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Utility function to generate random data
const generateRandomData = (length, min, max) => {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export function DashboardPreview() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("monthly");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // State for chart data
  const [barChartData, setBarChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Clients",
        data: [42, 38, 51, 49, 56, 60],
        backgroundColor: theme.palette.primary.main,
        borderRadius: 6,
      },
      {
        label: "Completed Cases",
        data: [37, 32, 41, 38, 43, 41],
        backgroundColor: theme.palette.success.main,
        borderRadius: 6,
      },
    ],
  });

  const [lineChartData, setLineChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue Growth",
        data: [9000, 15000, 20000, 35000, 48000, 63000],
        borderColor: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
        fill: true,
        pointBackgroundColor: theme.palette.secondary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  });

  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: [
      "Visa Services",
      "Travel Booking",
      "Documentation",
      "Consultation",
      "Other Services",
    ],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main,
        ],
        borderWidth: 0,
      },
    ],
  });

  // Intersection Observer to trigger visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Animation for charts
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Update Bar Chart
      setBarChartData((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          data: generateRandomData(6, 30, 70), // Random values between 30 and 70
        })),
      }));

      // Update Line Chart
      setLineChartData((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          data: generateRandomData(6, 5000, 70000), // Random values between 5K and 70K
        })),
      }));

      // Update Doughnut Chart
      setDoughnutChartData((prev) => ({
        ...prev,
        datasets: prev.datasets.map((dataset) => ({
          ...dataset,
          data: generateRandomData(5, 5, 40), // Random values between 5 and 40
        })),
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleTabChange = (event, newValue) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        border: {
          display: false,
        },
        grid: {
          display: true,
          color: alpha(theme.palette.text.secondary, 0.1),
        },
        ticks: {
          padding: 10,
          color: alpha(theme.palette.text.secondary, 0.7),
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
          color: alpha(theme.palette.text.secondary, 0.7),
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
    animation: {
      duration: 1000, // Smooth transition for data updates
      easing: "easeInOutQuad",
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  // Stat cards data
  const statCards = [
    {
      title: "Active Clients",
      value: "248",
      change: "+8.2%",
      positive: true,
    },
    {
      title: "Pending Visas",
      value: "86",
      change: "-12.5%",
      positive: true,
    },
    {
      title: "Avg. Processing Time",
      value: "14 days",
      change: "-3.4%",
      positive: true,
    },
  ];

  return (
    <Box
      component="section"
      id="dashboard"
      ref={sectionRef}
      sx={{
        py: 8,
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Orbs for Background */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation:
            "orbitTopLeft 20s ease-in-out infinite, glow 6s ease-in-out infinite",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 70, 239, 0.25) 0%, transparent 70%)",
          filter: "blur(45px)",
          animation:
            "orbitBottomRight 24s ease-in-out infinite, glow 8s ease-in-out infinite",
          zIndex: -1,
        }}
      />
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start" },
            justifyContent: "space-between",
            maxWidth: "1200px",
            mx: "auto",
            mb: 6,
          }}
        >
          <Box
            sx={{
              mb: { xs: 4, md: 0 },
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "1.875rem", md: "2.25rem" },
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Streamline Your Agency Operations
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: "1.125rem",
                maxWidth: "560px",
              }}
            >
              Our intuitive dashboard gives you a complete overview of your
              agency's performance. Track clients, monitor visa applications,
              and identify business opportunities at a glance.
            </Typography>
          </Box>

          <Box
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(0.8)",
              transition:
                "opacity 0.5s ease-out 0.1s, transform 0.5s ease-out 0.1s",
            }}
          >
            <Paper
              elevation={1}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: "blur(10px)",
              }}
            >
              <ToggleButtonGroup
                value={activeTab}
                exclusive
                onChange={handleTabChange}
                aria-label="time period"
                sx={{
                  width: "260px",
                  "& .MuiToggleButtonGroup-grouped": {
                    border: 0,
                    flex: 1,
                    py: 1,
                  },
                }}
              >
                <ToggleButton
                  value="monthly"
                  aria-label="monthly"
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    },
                  }}
                >
                  Monthly
                </ToggleButton>
                <ToggleButton
                  value="yearly"
                  aria-label="yearly"
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    },
                  }}
                >
                  Yearly
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>
        </Box>

        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          {/* Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {statCards.map((stat, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={stat.title}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: theme.shadows[8],
                    },
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.5s ease-out ${
                      index * 0.1 + 0.2
                    }s, transform 0.5s ease-out ${
                      index * 0.1 + 0.2
                    }s, box-shadow 0.3s ease, transform 0.3s ease`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {stat.title}
                      </Typography>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="body2">
                              {stat.title}{" "}
                              {activeTab === "monthly"
                                ? "for current month"
                                : "for current year"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Compare with previous{" "}
                              {activeTab === "monthly" ? "month" : "year"}
                            </Typography>
                          </Box>
                        }
                      >
                        <IconButton
                          size="small"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
                    >
                      <Typography
                        variant="h5"
                        component="span"
                        fontWeight={600}
                      >
                        {stat.value}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: stat.positive
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          fontSize: "0.875rem",
                        }}
                      >
                        {stat.positive ? (
                          <ArrowUpwardIcon
                            fontSize="inherit"
                            sx={{ mr: 0.5 }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            fontSize="inherit"
                            sx={{ mr: 0.5 }}
                          />
                        )}
                        {stat.change}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Main Chart */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition:
                    "opacity 0.5s ease-out 0.4s, transform 0.5s ease-out 0.4s",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Client Acquisition & Case Completion
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: theme.palette.primary.main,
                            mr: 0.75,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          New Clients
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", ml: 2 }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: theme.palette.success.main,
                            mr: 0.75,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Completed Cases
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ height: 288 }}>
                    <Bar options={chartOptions} data={barChartData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Side Charts */}
            <Grid
              size={{ xs: 12, md: 4 }}
              container
              spacing={3}
              component={Stack}
            >
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition:
                    "opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s",
                  width: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Revenue Growth
                  </Typography>
                  <Box sx={{ height: 192 }}>
                    <Line options={chartOptions} data={lineChartData} />
                  </Box>
                </CardContent>
              </Card>

              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: "blur(8px)",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transition:
                    "opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    Service Distribution
                  </Typography>
                  <Box
                    sx={{
                      height: 160,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ width: 160, height: 160 }}>
                      <Doughnut
                        data={doughnutChartData}
                        options={doughnutOptions}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 1.5,
                      mt: 1.5,
                    }}
                  >
                    {doughnutChartData.labels.map((label, idx) => (
                      <Box
                        key={label}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor:
                              doughnutChartData.datasets[0].backgroundColor[
                                idx
                              ],
                            mr: 0.75,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes orbitTopLeft {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10vw, -5vh);
          }
          50% {
            transform: translate(15vw, 5vh);
          }
          75% {
            transform: translate(5vw, 10vh);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes orbitBottomRight {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-8vw, 8vh);
          }
          50% {
            transform: translate(-12vw, -5vh);
          }
          75% {
            transform: translate(-5vw, -10vh);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes glow {
          0% {
            opacity: 0.7;
            filter: blur(30px);
          }
          50% {
            opacity: 1;
            filter: blur(40px);
          }
          100% {
            opacity: 0.7;
            filter: blur(30px);
          }
        }
      `}</style>
    </Box>
  );
}
