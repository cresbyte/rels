import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import MultiSigningDocument from "./MultiSigningDocument";
import PublicDocument from "./PublicDocument";
import SelfSigningDocument from "./self/SelfSigningDocument";
import { useApi } from "../../api/axios";


const DocumentDetailRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useApi();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch document from API
                const response = await api.get(`documents/${id}/`);
                const documentData = response.data;
                console.log(documentData);

                // Transform the API response to match the expected format
                const transformedDocument = {
                    id: documentData.id,
                    title: documentData.title,
                    type: documentData.scenario,
                    status: "in_progress", // Default status since it's not in the API yet
                    fileUrl: documentData.file,
                    createdAt: new Date(documentData.created_at),
                    updatedAt: new Date(documentData.updated_at),
                    fields: [], // Default empty fields array
                };

                setDocument(transformedDocument);
            } catch (err) {
                console.error("Error fetching document:", err);
                if (err.response?.status === 404) {
                    setError("Document not found");
                } else if (err.response?.status === 403) {
                    setError("You don't have permission to view this document");
                } else {
                    setError("Failed to load document");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocument();
        }
    }, [id, api]);

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
                return <SelfSigningDocument doc={document} />;
            case 'private':
                return <MultiSigningDocument doc={document} />;
            case 'public':
                return <PublicDocument doc={document} />;
            default:
                return (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6">Unknown document type</Typography>
                        <Typography variant="body2" color="text.secondary">
                            This document type ({document.type}) is not supported.
                        </Typography>
                    </Box>
                );
        }
    };

    return renderDocument();
};

export default DocumentDetailRoute;
