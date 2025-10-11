import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

const faqs = [
  {
    question: "What is Opaige CRM?",
    answer: "Opaige CRM is a comprehensive platform designed specifically for travel and immigration agencies. It helps you manage client relationships, track visa applications, handle travel bookings, and streamline your agency's operations all in one place."
  },
  {
    question: "How does Opaige help with visa processing?",
    answer: "Opaige provides a structured workflow for visa applications, including document tracking, status updates, deadline reminders, and automated notifications. It helps you maintain compliance with immigration regulations while ensuring efficient processing of applications."
  },
  {
    question: "Can I integrate Opaige with my existing systems?",
    answer: "Yes, Opaige offers robust integration capabilities with popular travel booking systems, payment gateways, and document management systems. Our API documentation provides detailed information on how to connect your existing tools with Opaige."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide 24/7 customer support through multiple channels including email, phone, and live chat. Additionally, we offer comprehensive documentation, video tutorials, and regular training sessions to help you make the most of the platform."
  },
  {
    question: "Is my data secure with Opaige?",
    answer: "Absolutely. We implement industry-standard security measures including end-to-end encryption, regular security audits, and strict access controls. Your data is backed up regularly and stored in compliance with international data protection regulations."
  },
  {
    question: "How does the pricing work?",
    answer: "Opaige offers flexible pricing plans based on your agency's size and needs. We have a free tier for small agencies, and scalable paid plans for growing businesses. Contact our sales team for a customized quote based on your specific requirements."
  },
  {
    question: "Can I try Opaige before committing?",
    answer: "Yes, we offer a 14-day free trial with full access to all features. This allows you to evaluate how Opaige can benefit your agency before making a commitment. No credit card is required to start your trial."
  },
  {
    question: "What training and onboarding support is available?",
    answer: "We provide comprehensive onboarding support including personalized training sessions, documentation, and video tutorials. Our team will work with you to ensure a smooth transition and help you get the most out of the platform."
  },
  {
    question: "How does Opaige handle multiple users?",
    answer: "Opaige supports team collaboration with role-based access control. You can create different user roles with specific permissions, ensuring that team members have access to the features they need while maintaining data security."
  },
  {
    question: "What kind of reporting and analytics does Opaige provide?",
    answer: "Opaige offers detailed analytics and reporting tools that help you track key metrics like application success rates, processing times, revenue, and client satisfaction. You can generate custom reports and export data for further analysis."
  }
];

export default function FAQs() {
  return (
    <Box className="opaige-app" sx={{ bgcolor: "#f9f5f6", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to bottom, #fde2e2, #ecf8e7)",
          py: 6,
          position: "relative",
          overflow: "hidden",
          pt: { xs: 12, md: 16 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "#ff6b6b", fontWeight: "bold" }}
            >
              FREQUENTLY ASKED QUESTIONS
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Everything You Need to Know
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3, maxWidth: 800, mx: "auto" }}
            >
              Find answers to common questions about Opaige CRM and how it can help
              your travel and immigration agency thrive.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* FAQs Section */}
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #fff, #f8f9fa)",
          }}
        >
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                borderRadius: "8px !important",
                "&:before": {
                  display: "none",
                },
                boxShadow: "none",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
} 