import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../api/axios";
import PDFEditor from "../dashboard/documents/pdf-editor/PDFEditor";

export default function PublicForm() {
  const { public_token } = useParams();
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
        const resp = await api.get(`documents/public-forms/${public_token}/`);
        const doc = resp.data;
        if (!mounted) return;
        setFileUrl(doc.file);
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load public form");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [public_token, api]);

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
        <Typography variant="body2" color="error">{error || "Public form not available"}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh" }}>
      <PDFEditor fileURL={fileUrl} documentId={null} isPublic publicToken={public_token} />
    </Box>
  );
}


