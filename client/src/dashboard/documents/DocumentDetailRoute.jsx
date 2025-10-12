import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import MultiSigningDocument from "./MultiSigningDocument";
import PublicDocument from "./PublicDocument";
import SelfSigningDocument from "./self/SelfSigningDocument";

// Mock document data - in real app, this would come from API
const SAMPLE_DOCUMENTS = [
    {
        id: "doc3",
        title: "Employee Confidentiality Agreement",
        type: "self",
        status: "in_progress",
        fileUrl: "http://127.0.0.1:8000/media/uploads/org_2/documents/SwiftPass-Global-Medical-Form.pdf",
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000),
        fields: [
            {
                id: "f1",
                label: "Full Name",
                type: "text",
                required: true,
                position: { x: 100, y: 150 },
                width: 200,
                height: 30,
                value: "",
                formatting: { font: "Arial", size: 12, color: "#000" },
                tooltip: "Enter your full legal name",
                recipient: "current_user",
            },
            {
                id: "f2",
                label: "Signature",
                type: "signature",
                required: true,
                position: { x: 100, y: 250 },
                width: 300,
                height: 80,
                value: null,
                recipient: "current_user",
            },
            {
                id: "f3",
                label: "Date",
                type: "date",
                required: true,
                position: { x: 100, y: 350 },
                width: 150,
                height: 30,
                value: new Date().toISOString().split("T")[0],
                recipient: "current_user",
            },
        ],
    },
    {
        id: "doc2",
        title: "Contract Agreement",
        type: "MultiSign",
        status: "in_progress",
        fileUrl: "https://example.com/contract.pdf",
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000),
        fields: [],
    },
    {
        id: "doc3",
        title: "Public Registration Form",
        type: "Public",
        status: "completed",
        fileUrl: "https://example.com/registration.pdf",
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 1000),
        fields: [],
    },
];

const DocumentDetailRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 100));

                // Find document by ID
                const foundDocument = SAMPLE_DOCUMENTS.find(doc => doc.id === id);

                if (!foundDocument) {
                    setError("Document not found");
                    return;
                }

                setDocument(foundDocument);
            } catch (err) {
                setError("Failed to load document");
                console.error("Error fetching document:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocument();
        }
    }, [id]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                    flexDirection: "column",
                }}
            >
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading document...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Typography variant="body2" color="text.secondary">
                    The document you're looking for doesn't exist or you don't have permission to view it.
                </Typography>
            </Box>
        );
    }

    if (!document) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6">Document not found</Typography>
                <Typography variant="body2" color="text.secondary">
                    The requested document could not be found.
                </Typography>
            </Box>
        );
    }

    // Render the appropriate document component based on type
    const renderDocument = () => {
        switch (document.type) {
            case 'self':
                return <SelfSigningDocument document={document} />;
            case 'MultiSign':
                return <MultiSigningDocument document={document} />;
            case 'Public':
                return <PublicDocument document={document} />;
            default:
                return (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">Unknown document type</Typography>
                        <Typography variant="body2" color="text.secondary">
                            This document type is not supported.
                        </Typography>
                    </Box>
                );
        }
    };

    return renderDocument();
};

export default DocumentDetailRoute;
