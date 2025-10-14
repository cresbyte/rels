import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useApi } from "../../api/axios";
import PdfCanvas from "./PdfCanvas";

// This component bridges our dashboard route to the OpenSign canvas.
// It intentionally delegates URL params to the OpenSign page, which reads useParams internally.
export default function OpenSignDocument() {
  const { id } = useParams();
  const { api } = useApi();
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await api.get(`documents/${id}/`);
        const doc = resp.data;
        if (!mounted) return;
        setFileUrl(doc.file);
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load PDF document");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, api]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !fileUrl) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="error">{error || "PDF not available"}</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <PdfCanvas fileUrl={fileUrl} />
    </Box>
  );
}


