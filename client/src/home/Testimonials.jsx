import { ArrowForwardIos } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Card,
    Container,
    IconButton,
    Typography,
    useTheme,
    useMediaQuery
} from "@mui/material";
import React, { useState } from "react";

const testimonials = [
    {
        quote: "Opaige CRM has revolutionized how we handle visa applications. The automated tracking system has reduced our processing time by 40% and our clients love the transparency of seeing their application status in real-time!",
        name: "Emma Thompson",
        position: "Visa Processing Manager",
        company: "GlobalVisa Solutions",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60"
    },
    {
        quote: "The travel booking integration is seamless. We've seen a 50% increase in booking efficiency and our clients appreciate the automated itinerary management. It's truly transformed our operations.",
        name: "James Wilson",
        position: "Travel Operations Director",
        company: "Wanderlust Travel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60"
    },
    {
        quote: "As an immigration consultant, I've tried many systems, but Opaige stands out. The document management and compliance tools have made our work much more efficient and error-free.",
        name: "Sophia Rodriguez",
        position: "Senior Immigration Consultant",
        company: "New Horizons Immigration",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60"
    },
    {
        quote: "The client portal has been a game-changer for our agency. Our clients can now track their applications and communicate with us seamlessly, reducing our support tickets by 60%.",
        name: "David Kumar",
        position: "Client Services Manager",
        company: "Worldwide Immigration Services",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60"
    },
    {
        quote: "The automated compliance checks have saved us countless hours of manual verification. It's like having an extra team member working 24/7 to ensure everything is in order.",
        name: "Olivia Martinez",
        position: "Compliance Officer",
        company: "Global Travel Partners",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=60"
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
            <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: "bold", mb: 1 }}
            >
                Why agencies trust Opaige CRM
            </Typography>
            <Typography variant="body1" sx={{ mb: 5 }}>
                See what our clients have to say about transforming their operations
            </Typography>

            <Box sx={{ position: "relative", my: 4 }}>
                <IconButton
                    onClick={handlePrevious}
                    sx={{
                        position: "absolute",
                        left: isMobile ? -20 : -40,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "#f5f5f5" },
                        zIndex: 2,
                    }}
                >
                    <ArrowForwardIos size={20} style={{ transform: "rotate(180deg)" }} />
                </IconButton>

                <Box
                    sx={{
                        maxWidth: 800,
                        mx: "auto",
                        px: isMobile ? 2 : 4,
                        position: "relative",
                    }}
                >
                    <Card
                        sx={{
                            p: 4,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            },
                        }}
                    >
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mb: 3, 
                                fontStyle: "italic",
                                fontSize: "1.1rem",
                                lineHeight: 1.6,
                            }}
                        >
                            "{testimonials[currentIndex].quote}"
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                            }}
                        >
                            <Avatar 
                                src={testimonials[currentIndex].avatar}
                                sx={{ 
                                    mr: 2,
                                    width: 56,
                                    height: 56,
                                    border: "2px solid #f0f0f0"
                                }} 
                            />
                            <Box sx={{ textAlign: "left" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    {testimonials[currentIndex].name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {testimonials[currentIndex].position}, {testimonials[currentIndex].company}
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box
                                component="img"
                                src={testimonials[currentIndex].logo}
                                alt="Company logo"
                                sx={{
                                    height: 40,
                                    objectFit: "contain",
                                    opacity: 0.8,
                                }}
                            />
                        </Box>
                    </Card>
                </Box>

                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        right: isMobile ? -20 : -40,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        "&:hover": { bgcolor: "#f5f5f5" },
                        zIndex: 2,
                    }}
                >
                    <ArrowForwardIos size={20} />
                </IconButton>

                {/* Dots indicator */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
                    {testimonials.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: index === currentIndex ? "primary.main" : "grey.300",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    bgcolor: index === currentIndex ? "primary.dark" : "grey.400",
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Container>
    );
};

export default Testimonials;
