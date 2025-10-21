import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../api/axios";
import { UserProvider } from "./pdf-editor/UserContext";
import PDFEditor from "./pdf-editor/PDFEditor";
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
        console.log(fileUrl)
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
    return () => {
      mounted = false;
    };
  }, [id, api]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error || !fileUrl) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="error">
          {error || "PDF not available"}
        </Typography>
      </Box>
    );
  }
  return (
    <UserProvider>
      <PDFEditor fileURL={fileUrl} documentId={id} />
    </UserProvider>
  );
}
