import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Plus, Signature, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "../../api/axios";
import AddSign from "./AddSign"; // your fixed signature modal

// Main component
const MySigns = () => {
  const { api } = useApi();
  const theme = useTheme();
  const [signatures, setSignatures] = useState([]);
  const [openSignature, setOpenSignature] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch signatures from backend
  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        setLoading(true);
        const response = await api.get("signatures/");
        console.log("Fetched signatures:", response);
        setSignatures(response.data.results);
        setError(null);
      } catch (err) {
        console.error("Error fetching signatures:", err);
        setError("Failed to load signatures");
      } finally {
        setLoading(false);
      }
    };

    fetchSignatures();
  }, []);

  const handleSaveSignature = async (signatureData) => {
    try {
      const formData = new FormData();

      // Convert dataURL to Blob for the image
      if (signatureData.image) {
        const response = await fetch(signatureData.image);
        const blob = await response.blob();
        const file = new File([blob], "signature.png", { type: "image/png" });
        formData.append("image", file);
      }

      // Add other fields
      formData.append("name", signatureData.name);
      formData.append("type", signatureData.type);
      if (signatureData.font) formData.append("font", signatureData.font);
      if (signatureData.color) formData.append("color", signatureData.color);

      const response = await api.post("signatures/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add the new signature to the list
      setSignatures((prev) => [response.data, ...prev]);
      setOpenSignature(false);
    } catch (err) {
      console.error("Error saving signature:", err);
      alert("Failed to save signature. Please try again.");
    }
  };

  const sortedSignatures = signatures; // already newest-first due to prepend

  return (
    <Box sx={{ width: "100%", mt: 6 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: theme.palette.text.primary,
        }}
      >
        My Signatures
      </Typography>

      {loading ? (
        <Typography>Loading signatures...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <AddSignatureCard onClick={() => setOpenSignature(true)} />
          </Grid>
          {sortedSignatures.map((sig) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sig.id}>
              <SignatureCard
                signature={sig}
                onDelete={(id) => {
                  setSignatures((prev) => prev.filter((s) => s.id !== id));
                }}
              />
            </Grid>
          ))}
    
        </Grid>
      )}

      <AddSign
        open={openSignature}
        onClose={() => setOpenSignature(false)}
        onSave={handleSaveSignature}
      />
    </Box>
  );
};

// Signature card component (matches your design exactly)
const SignatureCard = ({ signature, onDelete }) => {
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };
 const { api } = useApi();
  const handleConfirmDelete = async () => {
   
    try {
      await api.delete(`signatures/${signature.id}/`);
      setDeleteDialogOpen(false);
      if (onDelete) onDelete(signature.id);
    } catch (err) {
      console.error("Error deleting signature:", err);
      alert("Failed to delete signature. Please try again.");
    }
  };

  const getSignaturePreview = () => {
   
      // drawn or uploaded: show image
      return (
        <Box
          component="img"
          src={signature.image}
          alt="Signature"
          sx={{
            width: "100%",
            height: 40,
            objectFit: "contain",
            filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
          }}
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "block";
          }}
        />
      );
   
  };

  const getTypeLabel = () => {
    if (signature.type === "typed") {
      const fontName =
        signature.font.split(",")[0]?.replace(/"/g, "") || "Custom";
      return `Typed signature — ${fontName}`;
    }
    return "Drawn signature";
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          position: "relative",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.2),
            },
          }}
          onClick={handleDeleteClick}
        >
          <Trash2 size={16} />
        </IconButton>

        <CardContent sx={{ pb: 2, flexGrow: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mb: 2,
              alignSelf: "flex-start",
            }}
          >
            <Signature size={20} />
          </Box>

          {getSignaturePreview()}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mt: 1.5,
              mb: 1,
              lineHeight: 1.3,
              minHeight: 44,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {signature.name}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {getTypeLabel()}
          </Typography>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Signature</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this signature? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Add new signature card
const AddSignatureCard = ({ onClick }) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[4],
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      <CardContent
        sx={{
          pb: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          <Plus size={20} />
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            textAlign: "center",
            color: theme.palette.primary.main,
          }}
        >
          Add New Signature
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MySigns;
