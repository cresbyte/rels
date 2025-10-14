import { useDrag } from "react-dnd";
import { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Box, Button, Paper, Typography } from "@mui/material";

export const ItemTypes = { FIELD: "FIELD", PLACED_FIELD: "PLACED_FIELD" };

export function DraggablePaletteItem({ label, type, widget }) {
  const [{ isDragging }, dragRef, preview] = useDrag(
    () => ({
      type: ItemTypes.FIELD,
      item: { type, label, widget },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [type, label, widget]
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return (
    <Paper ref={dragRef} elevation={1} sx={{ p: 1, opacity: isDragging ? 0.5 : 1, cursor: "grab" }}>
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );
}

export function DroppedField({ field, onRemove, onSelect, onStartResize }) {
  const [{ isDragging }, dragRef, preview] = useDrag(
    () => ({
      type: ItemTypes.PLACED_FIELD,
      item: { id: field.id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [field.id]
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return (
    <Box
      ref={dragRef}
      sx={{
        position: "absolute",
        left: field.x,
        top: field.y,
        px: 1,
        py: 0.5,
        bgcolor: isDragging ? "rgba(33, 156, 160, 0.2)" : "transparent",
        color: "text.primary",
        borderRadius: 0.5,
        userSelect: "none",
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid rgba(0,0,0,0.2)",
        width: field.width,
        height: field.height,
        boxSizing: "border-box",
        cursor: "move",
        // Reduce opacity while dragging instead of hiding completely
        opacity: isDragging ? 0.3 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(field.id, e.currentTarget);
      }}
    >
      <Typography variant="caption" sx={{ pointerEvents: "none" }}>
        {field.type === "signature" && field.signatureData ? (
          <img src={field.signatureData} alt="signature" style={{ maxHeight: "100%", maxWidth: "100%" }} />
        ) : (
          field.value || field.label
        )}
      </Typography>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(field.id);
        }}
        size="small"
        sx={{ minWidth: 0, position: "absolute", right: -8 }}
        variant="text"
        color="error"
      >
        ×
      </Button>
      <Box
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartResize(field.id, e);
        }}
        sx={{
          position: "absolute",
          right: -2,
          bottom: -2,
          width: 6,
          height: 6,
          bgcolor: "background.paper",
          border: "1px solid rgba(0,0,0,0.3)",
          borderRadius: 0.5,
          cursor: "nwse-resize",
        }}
      />
    </Box>
  );
}


