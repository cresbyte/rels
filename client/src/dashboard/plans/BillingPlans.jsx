import React, { useState, useEffect } from "react";
import {
    alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Check, X } from "lucide-react";
import { useApi } from "../../api/axios";

const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 5 documents/month",
      "Draw-only signatures",
      "PDF upload & sign",
      "Email support",
      "Standard templates",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For professionals & small teams",
    features: [
      "Unlimited documents",
      "Typed + drawn signatures",
      "4 signature fonts (Dancing Script, Great Vibes, etc.)",
      "Custom signature colors",
      "Advanced templates",
      "Priority support",
      "Team collaboration (up to 5)",
      "Audit trail & logs",
    ],
    popular: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO & SAML integration",
      "Dedicated account manager",
      "Custom SLA & compliance",
      "White-label signing",
      "Full API access",
      "On-premise option",
    ],
  },
};

export default function BillingPlans() {
  const theme = useTheme();
  const { api } = useApi();
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate API call — replace with real one
    const fetchPlan = async () => {
      try {
        // const res = await api.get("/billing/plan/");
        // setUserPlan(res.data.plan_id || "free");
        setTimeout(() => {
          setUserPlan("free");
          setLoading(false);
        }, 600);
      } catch (err) {
        setError("Failed to load plan info");
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleUpgrade = (planId) => {
    if (planId === "enterprise") {
      window.location.href = "mailto:sales@yourapp.com?subject=Enterprise Plan";
      return;
    }
    // Navigate to checkout
    window.location.href = `/checkout?plan=${planId}`;
  };

  const isCurrent = (planId) => userPlan === planId;
  const isFree = userPlan === "free";

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Plans & Billing
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={180} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={40} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Plans & Billing
        </Typography>
        {userPlan && (
          <Chip
            label={`Current plan: ${PLANS[userPlan]?.name || userPlan}`}
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {Object.values(PLANS).map((plan) => (
          <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
            <Card
              variant={isCurrent(plan.id) ? "outlined" : "elevation"}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderColor: isCurrent(plan.id)
                  ? theme.palette.primary.main
                  : undefined,
                borderWidth: isCurrent(plan.id) ? 2 : undefined,
              }}
            >
              <CardContent sx={{ pb: 2, flexGrow: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                  </Box>
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Stack>

                <Box sx={{ my: 2 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {plan.price}
                  </Typography>
                  {plan.period && (
                    <Typography variant="body2" color="text.secondary">
                      / {plan.period}
                    </Typography>
                  )}
                </Box>

                <List dense sx={{ mb: 3, flexGrow: 1 }}>
                  {plan.features.map((feature, i) => {
                    const showLock = isFree && plan.id !== "free" && i >= 5;
                    return (
                      <ListItem key={i} sx={{ py: 0.4 }}>
                        {showLock ? (
                          <X size={16} color={theme.palette.grey[400]} />
                        ) : (
                          <Check size={16} color={theme.palette.success.main} />
                        )}
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: showLock
                                  ? "text.disabled"
                                  : "text.primary",
                                textDecoration: showLock
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {feature}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>

                <Button
                  fullWidth
                  variant={isCurrent(plan.id) ? "outlined" : "contained"}
                  disabled={isCurrent(plan.id)}
                  onClick={() => handleUpgrade(plan.id)}
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                  {isCurrent(plan.id)
                    ? "Current Plan"
                    : plan.id === "enterprise"
                    ? "Contact Sales"
                    : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isFree && (
        <Card
          sx={{
            mt: 6,
            bgcolor: alpha(theme.palette.info.main, 0.04),
            border: "none",
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems="center"
            >
              <Box textAlign={{ xs: "center", md: "left" }} flex={1}>
                <Typography variant="h6" fontWeight="bold">
                  Ready to unlock typed signatures and more?
                </Typography>
                <Typography color="text.secondary">
                  Upgrade to Pro and get unlimited documents, custom fonts, team
                  features, and priority support.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => handleUpgrade("pro")}
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Upgrade to Pro
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
