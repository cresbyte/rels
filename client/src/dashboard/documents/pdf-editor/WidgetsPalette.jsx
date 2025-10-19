import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { widgetDefinitions } from "../../../utils/widgetDefinitions";

const WidgetsPalette = ({ onDragStart }) => {
  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        bgcolor: "#f9fafb",
        borderLeft: "1px solid #e5e7eb",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Widgets
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {widgetDefinitions.map((widget) => (
          <Button
            key={widget.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copy";
              e.dataTransfer.setData("widgetType", widget.type);
              onDragStart(widget.type);
            }}
            variant="outlined"
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              py: 1.5,
              px: 2,
              cursor: "move",
            }}
            startIcon={
              <span style={{ fontSize: "1.25rem" }}>{widget.icon}</span>
            }
          >
            <span style={{ fontWeight: 500 }}>{widget.label}</span>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default WidgetsPalette;
