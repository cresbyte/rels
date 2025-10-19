import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { PenTool } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import SignaturePad from "signature_pad";

const SIGNATURE_FONTS = [
  { name: "Dancing Script", value: '"Dancing Script", cursive' },
  { name: "Great Vibes", value: '"Great Vibes", cursive' },
  { name: "Kaushan Script", value: '"Kaushan Script", cursive' },
  { name: "Parisienne", value: '"Parisienne", cursive' },
];

const PEN_COLORS = ["#000000", "#ff0000", "#0000ff"];

// Generate typed signature as PNG with transparent background
const generateTypedSignatureImage = (text, font, color = "#000000") => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const ratio = Math.max(window.devicePixelRatio || 1, 2); // Increase ratio for better quality

    const fontSize = 32 * ratio; // Larger font size for better quality
    ctx.font = `${fontSize}px ${font}`;
    const metrics = ctx.measureText(text);
    const width = Math.ceil(metrics.width + 20 * ratio); // Reduced padding
    const height = Math.ceil(fontSize + 10 * ratio); // Reduced padding

    canvas.width = width;
    canvas.height = height;
    ctx.scale(ratio, ratio);
    ctx.font = `32px ${font}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    // Don't fill background - keep it transparent
    ctx.fillStyle = color;
    ctx.fillText(text, 10, height / (2 * ratio)); // Reduced padding

    resolve(canvas.toDataURL("image/png"));
  });
};

export default function AddSign({ open, onClose, onSave }) {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [activeTab, setActiveTab] = useState("type");
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0].value);
  const [penColor, setPenColor] = useState("#000000");
  const [isSaving, setIsSaving] = useState(false);

  // Robust canvas initializer (no penColor dependency)
  const initSignaturePad = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.offsetWidth === 0) return false;

    const ctx = canvas.getContext("2d");
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);

    // Save existing signature data before destroying
    let existingData = null;
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      existingData = signaturePadRef.current.toData();
    }

    // Destroy old
    if (signaturePadRef.current) {
      signaturePadRef.current.off();
    }

    // Create new with current pen color
    const pad = new SignaturePad(canvas, {
      penColor: penColor,
      backgroundColor: "rgba(255,255,255,0)", // Transparent background
      minWidth: 0.8,
      maxWidth: 3.0,
      velocityFilterWeight: 0.7,
      dotSize: function () {
        return (this.minWidth + this.maxWidth) / 2;
      },
    });

    // Restore the signature
    if (existingData) {
      pad.fromData(existingData);
    }

    pad.on();
    signaturePadRef.current = pad;
    return true;
  }, []); // No dependencies - only init on mount/tab change

  // Handle pen color changes dynamically
  useEffect(() => {
    if (activeTab === "draw" && signaturePadRef.current) {
      // Save current drawing
      const existingData = signaturePadRef.current.isEmpty()
        ? null
        : signaturePadRef.current.toData();

      // Update pen color
      signaturePadRef.current.penColor = penColor;

      // Redraw with existing data to preserve drawing
      if (existingData) {
        signaturePadRef.current.clear();
        signaturePadRef.current.fromData(existingData);
      }
    }
  }, [penColor, activeTab]);

  // Re-init when dialog opens or tab changes
  useEffect(() => {
    if (!open || activeTab !== "draw") {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
      return;
    }

    // Try immediately
    let success = initSignaturePad();

    // If failed (no size), retry until it works (max 3 tries)
    if (!success) {
      let attempts = 0;
      const retry = () => {
        attempts++;
        if (attempts > 3) return;
        success = initSignaturePad();
        if (!success) setTimeout(retry, 100);
      };
      const timer = setTimeout(retry, 50);
      return () => clearTimeout(timer);
    }
  }, [open, activeTab, initSignaturePad]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, []);

  const handleSaveSignature = async () => {
    let dataURL;
    const isTyped = activeTab === "type";

    if (isTyped) {
      if (!typedName.trim()) return;
      dataURL = await generateTypedSignatureImage(
        typedName,
        selectedFont,
        penColor
      );
    } else {
      const pad = signaturePadRef.current;
      if (!pad || pad.isEmpty()) return;
      // Generate high-quality PNG with transparent background
      dataURL = pad.toDataURL("image/png", 1.0);
    }

    const newSignature = {
      name: typedName || "Signature",
      image: dataURL,
      type: isTyped ? "typed" : "drawn",
      font: isTyped ? selectedFont : null,
      color: penColor,
    };

    setIsSaving(true);
    try {
      if (onSave) await onSave(newSignature);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCanvas = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const renderPenColorPicker = () => (
    <Stack direction="row" spacing={1} mb={2}>
      <Typography variant="caption" sx={{ alignSelf: "center" }}>
        Pen Color:
      </Typography>
      {PEN_COLORS.map((color) => (
        <IconButton
          key={color}
          onClick={() => setPenColor(color)}
          sx={{
            borderRadius: "50%",
            width: 36,
            height: 36,
            bgcolor:
              penColor === color ? theme.palette.grey[300] : "transparent",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <PenTool color={color} size={20} />
        </IconButton>
      ))}
    </Stack>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Signature</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Draw" value="draw" />
          <Tab label="Type" value="type" />
        </Tabs>

        {/* Draw Tab */}
        {activeTab === "draw" && (
          <Box>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                width: "100%",
                height: 200,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  touchAction: "none",
                  display: "block",
                }}
              />
            </Box>

            {renderPenColorPicker()}

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={handleClearCanvas}>
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveSignature}
                disabled={
                  isSaving ||
                  (signaturePadRef.current && signaturePadRef.current.isEmpty())
                }
              >
                {isSaving ? "Saving..." : "Save Signature"}
              </Button>
            </Stack>
          </Box>
        )}

        {/* Type Tab */}
        {activeTab === "type" && (
          <Box>
            <TextField
              fullWidth
              label="Signature Text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="e.g., John Doe"
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Choose Font:
            </Typography>
            <Grid container spacing={1} mb={2}>
              {SIGNATURE_FONTS.map((font) => (
                <Grid item xs={6} sm={3} key={font.value}>
                  <Chip
                    label={font.name}
                    variant={
                      selectedFont === font.value ? "filled" : "outlined"
                    }
                    onClick={() => setSelectedFont(font.value)}
                    sx={{
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      fontFamily: font.value,
                      fontWeight: "bold",
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 1,
                width: "100%",
                height: 80,
                overflow: "hidden",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "white",
              }}
            >
              {typedName && (
                <Typography
                  sx={{
                    fontFamily: selectedFont,
                    fontSize: "24px",
                    color: penColor,
                    textAlign: "center",
                  }}
                >
                  {typedName}
                </Typography>
              )}
            </Box>

            {renderPenColorPicker()}

            <Button
              variant="contained"
              onClick={handleSaveSignature}
              fullWidth
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Typed Signature"}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
