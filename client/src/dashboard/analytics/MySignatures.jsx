import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Signature, Plus } from "lucide-react";

// Sample signature data
const signatures = [
  {
    id: "sig1",
    name: "John Doe",
    type: "drawn",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sig2",
    name: "JD",
    type: "drawn",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sig3",
    name: "John Doe",
    type: "typed",
    font: "Pacifico",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sig4",
    name: "John D.",
    type: "typed",
    font: "Courier New",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sig5",
    name: "Signature Scan",
    type: "uploaded",
    imageUrl:
      "https://img.favpng.com/25/4/20/signature-symbol-handwriting-clip-art-png-favpng-HsddAVPhptM1xnsHvyZ2REGPz.jpg",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Drawn signature SVG component
const DrawnSignaturePreview = () => (
  <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
    <path
      d="M10 25 Q30 10, 50 25 T90 25 Q110 10, 130 25 T170 25"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Signature card component
const SignatureCard = ({ signature }) => {
  const theme = useTheme();

  const getSignaturePreview = () => {
    switch (signature.type) {
      case "drawn":
        return (
          <Box
            sx={{
              width: "100%",
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.text.primary,
            }}
          >
            <DrawnSignaturePreview />
          </Box>
        );
      case "typed":
        return (
          <Typography
            variant="h6"
            sx={{
              fontFamily: signature.font,
              fontSize: "1.5rem",
              fontWeight: "normal",
              color: theme.palette.text.primary,
              textAlign: "center",
            }}
          >
            {signature.name}
          </Typography>
        );
      case "uploaded":
        return (
          <Box
            component="img"
            src={signature.imageUrl}
            alt="Uploaded signature"
            sx={{
              width: "100%",
              height: 40,
              objectFit: "contain",
              filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
            }}
          />
        );
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    if (signature.type === "typed") {
      return `Typed signature — ${signature.font}`;
    }
    return signature.type === "drawn" ? "Drawn signature" : "Uploaded image";
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
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
  );
};

// Add new signature card
const AddSignatureCard = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
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

// Main component
const MySignatures = () => {
  const theme = useTheme();

  // Sort signatures by createdAt (newest first)
  const sortedSignatures = [...signatures].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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

      <Grid container spacing={3}>
        {sortedSignatures.map((sig) => (
          <Grid size={{xs:12,sm:2,md:4}} key={sig.id}>
            <SignatureCard signature={sig} />
          </Grid>
        ))}
        <Grid size={{xs:12,sm:2,md:4}}>
          <AddSignatureCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MySignatures;
