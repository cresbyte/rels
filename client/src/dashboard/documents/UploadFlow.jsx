import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  AlertCircle,
  FileSignature,
  Globe,
  Upload as LucideUpload,
  User,
  Users,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api/axios";

// Reuse your existing styled components
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  transition: "all 0.2s ease",
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  "&:hover": {
    transform: "translateY(-1px)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.primary.main, 0.1)
        : alpha(theme.palette.primary.main, 0.05),
    boxShadow: "none",
  },
  "&.MuiButton-contained": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  borderRadius: 0,
  overflow: "hidden",
  height: "100%",
  background:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.3)
      : alpha(theme.palette.background.paper, 0.4),
  backdropFilter: "blur(8px)",
  boxShadow: "none",
  transition: "all 0.3s ease",
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, #9C87FB 0%, #7EB3FF 100%)"
      : "linear-gradient(90deg, #4E36E9 0%, #6A5AE0 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
}));

// Scenario config
const SCENARIOS = [
  {
    id: "self",
    title: "Self-Sign Document",
    description:
      "You’ll sign this document yourself (e.g., internal forms, declarations).",
    icon: <User size={24} />,
    color: "primary",
  },
  {
    id: "private",
    title: "Private Multi-Signer",
    description:
      "Send to specific people to sign (e.g., contracts, agreements).",
    icon: <Users size={24} />,
    color: "secondary",
  },
  {
    id: "public",
    title: "Public Form",
    description:
      "Anyone with the link can fill & sign (e.g., NDAs, consent forms).",
    icon: <Globe size={24} />,
    color: "info",
  },
];

function UploadFlow({ onUpload }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { api } = useApi();
  const [file, setFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) {
      setError("Please upload a valid PDF file.");
      return;
    }

    // Only allow PDFs for signing workflows
    if (uploadedFile.type !== "application/pdf") {
      setError("Only PDF files are supported for signing.");
      return;
    }

    setFile(uploadedFile);
    // Extract title from filename (remove .pdf extension)
    const title = uploadedFile.name.replace(/\.pdf$/i, "");
    setDocumentTitle(title);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleContinue = async () => {
    if (!file || !selectedScenario || !documentTitle.trim()) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', documentTitle.trim());
      formData.append('scenario', selectedScenario);

      // Upload document to API
      const response = await api.postFormData('documents/', formData);
      
      // Navigate to the document detail page
      navigate(`/dashboard/documents/${response.data.id}`);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Failed to upload document. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    setFile(null);
    setDocumentTitle("");
    setSelectedScenario(null);
    setError(null);
  };

  const handleRemoveDocument = () => {
    setFile(null);
    setDocumentTitle("");
    setSelectedScenario(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 0 }}>
      <HeaderTypography variant="h5" gutterBottom>
        Upload Document
      </HeaderTypography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Start by uploading a PDF, then choose how you'd like to use it.
      </Typography>

      {!file ? (
        // Step 1: Upload File
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StyledCard>
            <CardContent sx={{ p: 4 }}>
              <Box
                {...getRootProps()}
                sx={{
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 1,
                  p: 6,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.primary.main,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <input {...getInputProps()} />
                <LucideUpload
                  size={48}
                  color={theme.palette.primary.main}
                  opacity={0.6}
                />
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or{" "}
                  <span
                    style={{ color: theme.palette.primary.main, fontWeight: 600 }}
                  >
                    browse files
                  </span>
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Only PDF files supported
                </Typography>
              </Box>

              {error && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ mt: 2, color: "error.main" }}
                >
                  <AlertCircle size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">{error}</Typography>
                </Stack>
              )}
            </CardContent>
          </StyledCard>
        </motion.div>
      ) : (
        // Step 2: Choose Scenario
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <StyledCard sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <FileSignature size={24} color={theme.palette.primary.main} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <Button
                    onClick={handleRemoveDocument}
                    sx={{
                      minWidth: "auto",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    title="Remove document"
                  >
                    <X size={16} />
                  </Button>
                </Stack>
              </CardContent>
            </StyledCard>
          </motion.div>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Document Title
            </Typography>
            <TextField
              fullWidth
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Enter document title"
              variant="outlined"
              disabled={!file}
              helperText="Title extracted from filename (you can modify it)"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  "& fieldset": {
                    borderColor: alpha(theme.palette.divider, 0.08),
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            How will this document be used?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the signing scenario that matches your needs.
          </Typography>

          <Grid container spacing={3}>
            {SCENARIOS.map((scenario) => (
              <Grid item xs={12} md={4} key={scenario.id}>
                <StyledCard
                  onClick={() => setSelectedScenario(scenario.id)}
                  sx={{
                    cursor: "pointer",
                    borderColor:
                      selectedScenario === scenario.id
                        ? theme.palette[scenario.color].main
                        : alpha(theme.palette.divider, 0.08),
                    borderWidth: selectedScenario === scenario.id ? 2 : 1,
                    backgroundColor:
                      selectedScenario === scenario.id
                        ? alpha(theme.palette[scenario.color].main, 0.05)
                        : "transparent",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: alpha(
                          theme.palette[scenario.color].main,
                          0.1
                        ),
                        color: theme.palette[scenario.color].main,
                        mb: 2,
                      }}
                    >
                      {scenario.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 1 }}
                    >
                      {scenario.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {scenario.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <ActionButton variant="outlined" onClick={handleBack}>
              Back
            </ActionButton>
            <ActionButton
              variant="contained"
              onClick={handleContinue}
              disabled={!selectedScenario || !documentTitle.trim() || isUploading}
              startIcon={
                isUploading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              {isUploading ? "Processing..." : "Continue"}
            </ActionButton>
          </Stack>
        </motion.div>
      )}
    </Box>
  );
}

export default UploadFlow;
