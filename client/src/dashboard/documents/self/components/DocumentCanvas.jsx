import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Info, ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  const pdfCanvasRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  // Load PDF document
  useEffect(() => {
    if (document?.fileUrl && isDocumentLoaded) {
      loadPdfDocument(document.fileUrl);
    }
  }, [document?.fileUrl, isDocumentLoaded]);

  const loadPdfDocument = async (url) => {
    try {
      setPdfLoading(true);
      setPdfError(null);
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      
      setPdfDocument(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      
      // Render first page
      await renderPdfPage(pdf, 1);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setPdfError('Failed to load PDF document');
    } finally {
      setPdfLoading(false);
    }
  };

  const renderPdfPage = async (pdf, pageNum) => {
    if (!pdfCanvasRef.current) return;
    
    try {
      const page = await pdf.getPage(pageNum);
      const canvas = pdfCanvasRef.current;
      const context = canvas.getContext('2d');
      
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering PDF page:', error);
    }
  };

  // Re-render page when zoom changes
  useEffect(() => {
    if (pdfDocument && currentPage) {
      renderPdfPage(pdfDocument, currentPage);
    }
  }, [zoom, pdfDocument, currentPage]);

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
        {(!isDocumentLoaded || pdfLoading) && (
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
              {!isDocumentLoaded ? 'Loading document...' : 'Rendering PDF...'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we prepare your document
            </Typography>
          </Box>
        )}

        {/* PDF Error State */}
        {pdfError && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 800,
              height: 600,
              border: `2px solid ${theme.palette.error.main}`,
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" color="error" sx={{ fontWeight: 500 }}>
              PDF Loading Error
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {pdfError}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              This might be due to CORS restrictions or the PDF file being corrupted.
            </Typography>
          </Box>
        )}

        {/* PDF Document Display */}
        {isDocumentLoaded && !pdfError && (
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
            {/* PDF Canvas Renderer */}
            <canvas
              ref={pdfCanvasRef}
              style={{
                width: "100%",
                height: "auto",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                position: "relative",
                zIndex: 1,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
