import React, { useRef, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { Stage, Layer } from "react-konva";
import { Box, IconButton, ButtonGroup, Button } from "@mui/material";
import { ZoomIn, ZoomOut, RestartAlt } from "@mui/icons-material";
import DraggableField from "./DraggableField";
import { widgetDefinitions } from "../../../utils/widgetDefinitions";
import { useNavigate } from "react-router";

const PDFCanvas = ({
  pdfFile,
  currentPage,
  fields,
  selectedFieldKey,
  onFieldSelect,
  onFieldChange,
  onFieldDelete,
  onFieldAdd,
  onDocumentLoad,
  currentUserId,
  onFieldClick,
}) => {
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [scale, setScale] = useState(1.0);
  const containerRef = useRef(null);


  const handleDrop = (e) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType");

    if (!widgetType || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const widgetDef = widgetDefinitions.find((w) => w.type === widgetType);
    if (!widgetDef) return;

    const newField = {
      xPosition: x,
      yPosition: y,
      Width: widgetDef.defaultWidth,
      Height: widgetDef.defaultHeight,
      scale: scale,
      key: Date.now(),
      type: widgetType,
      isStamp: widgetType === "stamp",
      signatureType: widgetType === "signature" ? "draw" : undefined,
      options: {
        name: `${widgetType}-${Date.now()}`,
        status: "required",
        defaultValue: "",
      },
    };

    onFieldAdd(newField);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  const currentPageFields = fields.filter((f) => f.key);

    const navigate = useNavigate()


  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "scroll",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px",
          borderColor: "border",
          backgroundColor: "card",
        }}
      >
        <div
          style={{ fontSize: "16px", fontWeight: "600", color: "foreground" }}
        >
          Page {currentPage}
        </div>
        <Button onClick={() => navigate(-1)}>Back</Button>
        <ButtonGroup variant="outlined" size="small">
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOut />
          </IconButton>
          <IconButton onClick={handleResetZoom} size="small">
            <RestartAlt />
          </IconButton>
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomIn />
          </IconButton>
        </ButtonGroup>
      </div>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          padding: "24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          ref={containerRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            position: "relative",
            display: "inline-block",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.2s ease",
          }}
        >
          {pdfFile && (
            <Document file={pdfFile} onLoadSuccess={onDocumentLoad}>
              <Page
                pageNumber={currentPage}
                onLoadSuccess={(page) => {
                  setPageWidth(page.width);
                  setPageHeight(page.height);
                }}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={Math.min(
                  containerRef.current?.parentElement?.clientWidth - 48 || 800,
                  800
                )}
              />
            </Document>
          )}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <Stage
              width={pageWidth}
              height={pageHeight}
              style={{ pointerEvents: "auto" }}
              onClick={(e) => {
                if (e.target === e.target.getStage()) {
                  onFieldSelect(null);
                }
              }}
            >
              <Layer>
                {currentPageFields.map((field) => (
                  <DraggableField
                    key={field.key}
                    field={field}
                    isSelected={field.key === selectedFieldKey}
                    onSelect={() => onFieldSelect(field.key)}
                    onChange={(newAttrs) => onFieldChange(field.key, newAttrs)}
                    onDelete={() => onFieldDelete(field.key)}
                    isOwned={field.recipientId === currentUserId}
                    onClick={() => onFieldClick(field)}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default PDFCanvas;
