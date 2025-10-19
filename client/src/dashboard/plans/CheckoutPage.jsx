import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Mock payment handler — replace with Stripe, PayPal, etc.
const processPayment = async (planId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1500);
  });
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const planId = new URLSearchParams(location.search).get("plan");
  const plan = planId === "pro" ? { name: "Pro", price: "$19/month" } : null;

  useEffect(() => {
    if (!planId || planId !== "pro") {
      navigate("/billing");
    }
  }, [planId, navigate]);

  const handlePayment = async () => {
    if (!planId) return;
    setLoading(true);
    setError("");

    try {
      // Replace with real payment API call
      // const res = await api.post("/billing/subscribe/", { plan: planId });
      await processPayment(planId);

      setSuccess(true);
      // Optionally refresh user plan
      setTimeout(() => {
        navigate("/billing");
      }, 2000);
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button
        startIcon={<ArrowLeft />}
        onClick={() => navigate("/billing")}
        sx={{ mb: 3 }}
      >
        Back to Plans
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Confirm Upgrade
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You're about to upgrade to the <strong>{plan.name}</strong> plan.
          </Typography>

          <Box
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderRadius: 1,
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {plan.price}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Payment successful! Redirecting...
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handlePayment}
            disabled={loading || success}
            sx={{ py: 1.5, fontWeight: "bold", textTransform: "none" }}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Secure payment • Cancel anytime
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
