import {
  Box,
  Card,
  Typography,
  alpha,
  useTheme,
  Grid
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  FileText
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Import subcomponents
import DocumentCanvas from "./components/DocumentCanvas";
import FieldLibrary from "./components/FieldLibrary";
import FieldSettings from "./components/FieldSettings";





// Mock document data
const SAMPLE_DOCUMENT = {
  id: "doc1",
  title: "Employee Confidentiality Agreement",
  type: "self",
  status: "in_progress",
  fileUrl:
    "http://127.0.0.1:8000/media/uploads/org_2/documents/SwiftPass-Global-Medical-Form.pdf",
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
};


// Main component
const SelfSigningDocument = ({ doc }) => {
  const theme = useTheme();
  const [document, setDocument] = useState(doc);
  const [selectedField, setSelectedField] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [draggingField, setDraggingField] = useState(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const canvasRef = useRef(null);

  // Handle document loading
  useEffect(() => {
    // Simulate document loading
    const timer = setTimeout(() => {
      setIsDocumentLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle field selection
  const handleFieldClick = (fieldId) => {
    const field = document.fields.find((f) => f.id === fieldId);
    setSelectedField(field);
  };

  // Handle field update
  const updateField = (updates) => {
    setDocument((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === selectedField.id ? { ...f, ...updates } : f
      ),
    }));
  };

  // Add new field to document
  const addField = (fieldType) => {
    const newField = {
      id: `f${Date.now()}`,
      label: fieldType.label,
      type: fieldType.id,
      required: true,
      position: { x: 100, y: 100 },
      width: 200,
      height: 30,
      value: "",
      formatting: { font: "Arial", size: 12, color: "#000" },
      tooltip: `Enter ${fieldType.label}`,
      recipient: "current_user",
    };

    setDocument((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setSelectedField(newField);
  };

  // Remove field
  const removeField = () => {
    if (!selectedField) return;

    setDocument((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== selectedField.id),
    }));

    setSelectedField(null);
  };

  // Complete document
  const completeDocument = () => {
    setDocument((prev) => ({
      ...prev,
      status: "completed",
      updatedAt: new Date().toISOString(),
    }));

    setIsPreviewMode(true);
  };

  // Save draft
  const saveDraft = () => {
    // In real app, call API to save
    alert("Draft saved!");
  };

  // Download document
  const downloadDocument = () => {
    // In real app, generate PDF with embedded fields
    alert("Downloading signed document...");
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  // Reset zoom
  const resetZoom = () => setZoom(1.0);

  // Handle field drag start
  const handleFieldDragStart = (e, field) => {
    e.dataTransfer.setData("text/plain", field.id);
    setDraggingField(field);
  };

  // Handle field drag end
  const handleFieldDragEnd = () => {
    setDraggingField(null);
  };

  // Handle field drop from field library
  const handleFieldLibraryDrop = (e) => {
    e.preventDefault();

    try {
      const fieldTypeData = e.dataTransfer.getData("text/plain");
      const fieldType = JSON.parse(fieldTypeData);

      if (fieldType && fieldType.id) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create new field at drop position
        const newField = {
          id: `f${Date.now()}`,
          label: fieldType.label,
          type: fieldType.id,
          required: true,
          position: { x: Math.max(0, x - 100), y: Math.max(0, y - 15) },
          width: fieldType.id === 'signature' ? 300 : 200,
          height: fieldType.id === 'signature' ? 80 : 30,
          value: fieldType.id === 'date' ? new Date().toISOString().split("T")[0] : "",
          formatting: { font: "Arial", size: 12, color: "#000" },
          tooltip: `Enter ${fieldType.label}`,
          recipient: "current_user",
        };

        setDocument((prev) => ({
          ...prev,
          fields: [...prev.fields, newField],
        }));

        setSelectedField(newField);
      }
    } catch (error) {
      console.error("Error parsing field type data:", error);
    }
  };

  // Handle field drop (existing field repositioning)
  const handleFieldDrop = (e) => {
    e.preventDefault();
    const fieldId = e.dataTransfer.getData("text/plain");
    const field = document.fields.find(f => f.id === fieldId);

    if (field) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update the field position with improved formula
      setDocument((prev) => ({
        ...prev,
        fields: prev.fields.map((f) =>
          f.id === fieldId
            ? {
              ...f,
              position: {
                x: Math.max(0, x - field.width / 2),
                y: Math.max(0, y - field.height / 2)
              }
            }
            : f
        ),
      }));
    }
  };

  // Handle field drag over
  const handleFieldDragOver = (e) => {
    e.preventDefault();
  };

  // Render field in canvas
  const renderFieldInCanvas = (field) => {
    const isSelected = selectedField?.id === field.id;
    const isDragging = draggingField?.id === field.id;

    const style = {
      position: "absolute",
      left: `${field.position.x}px`,
      top: `${field.position.y}px`,
      width: `${field.width}px`,
      height: `${field.height}px`,
      border: isSelected
        ? "2px solid #4E36E9"
        : "1px solid rgba(0,0,0,0.2)",
      backgroundColor: isSelected
        ? "rgba(78, 54, 233, 0.1)"
        : "rgba(255,255,255,0.95)",
      padding: "6px 8px",
      cursor: "move",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: `12px`,
      fontWeight: 500,
      textAlign: "center",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      zIndex: isSelected ? 10 : 1,
      pointerEvents: "auto",
      borderRadius: "6px",
      boxShadow: isSelected
        ? "0 4px 12px rgba(78, 54, 233, 0.3)"
        : "0 2px 8px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
      opacity: isDragging ? 0.7 : 1,
      transform: isDragging ? "scale(0.95)" : "scale(1)",
      "&:hover": {
        backgroundColor: isSelected
          ? "rgba(78, 54, 233, 0.15)"
          : "rgba(78, 54, 233, 0.05)",
        borderColor: "#4E36E9",
        boxShadow: "0 4px 12px rgba(78, 54, 233, 0.2)",
      },
    };

    return (
      <div
        key={field.id}
        style={style}
        onClick={() => handleFieldClick(field.id)}
        onMouseDown={(e) => {
          // Handle field dragging within canvas
          if (e.button === 0) { // Left mouse button
            e.preventDefault();
            e.stopPropagation();

            const startX = e.clientX - field.position.x;
            const startY = e.clientY - field.position.y;

            const handleMouseMove = (e) => {
              e.preventDefault();
              const newX = e.clientX - startX;
              const newY = e.clientY - startY;

              // Update the field position
              setDocument((prev) => ({
                ...prev,
                fields: prev.fields.map((f) =>
                  f.id === field.id
                    ? {
                      ...f,
                      position: {
                        x: Math.max(0, newX),
                        y: Math.max(0, newY)
                      }
                    }
                    : f
                ),
              }));
            };

            const handleMouseUp = (e) => {
              e.preventDefault();
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }
        }}
        onDragStart={(e) => handleFieldDragStart(e, field)}
        onDragEnd={handleFieldDragEnd}
        draggable
      >
        {field.type === "signature" ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={20} />
          </Box>
        ) : (
          <Typography variant="body2" noWrap>
            {field.value || field.label}
          </Typography>
        )}
      </div>
    );
  };

  return (
    <Box
      sx={{ 
        p: 0, 
        height: "calc(100vh - 68px)", // Adjust height to account for topbar
        overflow: "hidden"
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%", }}>
        {/* Left Column: Field Library */}
        <Grid size={{xs:2.5}} sx={{ 
          overflowY: "auto",
          overflowX: "scroll",
            height: "calc(100vh - 68px)",
                            bgcolor: theme.palette.background.paper,


        }}>
          <FieldLibrary onAddField={addField} />
        </Grid>

        {/* Center Column: Document Canvas */}
        <Grid size={{xs:7}} sx={{ 
          overflowY: "auto",
          overflowX: "auto",
          position: "relative"
        }}>
          <DocumentCanvas
            document={document}
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={resetZoom}
            renderFieldInCanvas={renderFieldInCanvas}
            onFieldDrop={handleFieldDrop}
            onFieldDragOver={handleFieldDragOver}
            onFieldLibraryDrop={handleFieldLibraryDrop}
            isDocumentLoaded={isDocumentLoaded}
          />
        </Grid>

        {/* Right Column: Field Settings */}
        <Grid size={{xs:2.5}} sx={{ 
          overflowY: "auto",
          overflowX: "scroll",
            height: "calc(100vh - 68px)",
             bgcolor: theme.palette.background.paper,
        }}>
          <FieldSettings
            selectedField={selectedField}
            onClose={() => setSelectedField(null)}
            onUpdateField={updateField}
            onRemoveField={removeField}
            document={document}
            onPreviewMode={() => setIsPreviewMode(!isPreviewMode)}
            onSaveDraft={saveDraft}
            onCompleteDocument={completeDocument}
            onDownloadDocument={downloadDocument}
            isPreviewMode={isPreviewMode}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelfSigningDocument;
