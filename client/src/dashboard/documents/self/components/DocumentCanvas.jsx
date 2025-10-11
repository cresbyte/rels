import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Info, ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState } from "react";

const DocumentCanvas = ({
  document,
  zoom,
  renderFieldInCanvas,
  onFieldDrop,
  onFieldDragOver,
  onFieldLibraryDrop,
  isDocumentLoaded,
}) => {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const documentRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%", // Ensure full height
      }}
    >
      {/* Canvas Area */}
      <Box
        ref={canvasRef}
        sx={{
          flexGrow: 1,
          overflow: "auto", // Only this container scrolls

          position: "relative",
          display: "flex",
          alignItems: "flex-start", // Changed from center to allow scrolling
          justifyContent: "center",

          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: alpha(theme.palette.divider, 0.1),
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: "4px",
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.5),
            },
          },
        }}
      >
        {/* Loading State */}
        {!isDocumentLoaded && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 800,
              height: 600,
              border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
              Loading document...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we prepare your document
            </Typography>
          </Box>
        )}

        {/* PDF Document Display */}
        {isDocumentLoaded && (
          <Box
            ref={documentRef}
            sx={{
              width: "100%",
              position: "relative",
              overflow: "visible",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              minWidth: "600px", // Minimum width for better readability
              maxWidth: "100%", // Ensure it doesn't exceed container
            }}
            onDrop={(e) => {
              setIsDragOver(false);
              onFieldLibraryDrop(e);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            {/* PDF Viewer - Changed to embed for better compatibility */}
            <embed
              src={document.fileUrl}
              type="application/pdf"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "800px", // Minimum height for visibility
                border: "none",
                position: "relative",
                zIndex: 1,
              }}
              title={document.title}
            />

            {/* Drag Over Indicator */}
            {isDragOver && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `2px dashed ${theme.palette.primary.main}`,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Drop field here
                </Typography>
              </Box>
            )}

            {/* Overlay for Fields */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
              }}
              onDrop={onFieldDrop}
              onDragOver={onFieldDragOver}
            >
              {/* Render fields as overlays */}
              {document.fields.map(renderFieldInCanvas)}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DocumentCanvas;
