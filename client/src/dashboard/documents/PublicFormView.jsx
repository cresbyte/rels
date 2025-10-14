import { Box, Button, CircularProgress, Divider, FormControlLabel, Popover, Radio, RadioGroup, Stack, TextField, Typography, Paper, Modal, Alert } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useApi } from "../../api/axios";
import Canvas from "./canvas/Canvas";
import { DraggablePaletteItem, DroppedField } from "./canvas/FieldsLayer";
import { DndProvider, MouseTransition, Preview, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { CustomDragLayer } from "./canvas/Canvas";

export default function PublicFormView({ publicToken }) {
  const { api } = useApi();

  const [numPages, setNumPages] = useState(0);
  const [scale] = useState(1.2);
  const [fields, setFields] = useState([]);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const pageRefs = useRef({});
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sigOpen, setSigOpen] = useState(false);
  const sigRef = useRef(null);
  const resizingRef = useRef(null);

  // Submitter info
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");

  const onMouseMove = useCallback((e) => {
    const r = resizingRef.current;
    if (!r) return;
    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;
    const newW = Math.max(24, r.startW + dx);
    const newH = Math.max(20, r.startH + dy);
    setFields((prev) => prev.map((f) => (f.id === r.id ? { ...f, width: newW, height: newH } : f)));
  }, []);

  const onMouseUp = useCallback(() => {
    resizingRef.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const startResize = useCallback(
    (id, e) => {
      e.preventDefault();
      e.stopPropagation();
      const f = fields.find((x) => x.id === id);
      if (!f) return;
      resizingRef.current = { id, startX: e.clientX, startY: e.clientY, startW: f.width || 140, startH: f.height || 28 };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [fields, onMouseMove, onMouseUp]
  );

  const loadPublicForm = useCallback(async () => {
    if (!publicToken) return;
    setLoading(true);
    try {
      const response = await api.get(`public-forms/${publicToken}/`);
      setDocument(response.data);
      
      // Load fields for this public form
      const fieldsResponse = await api.get(`public-forms/${publicToken}/fields/`);
      setFields(fieldsResponse.data.map(field => ({
        id: field.id,
        type: field.widget_type,
        label: field.label,
        page: field.page_number,
        x: field.x_position,
        y: field.y_position,
        width: field.width,
        height: field.height,
        value: field.value,
        signatureData: field.signature_data,
        recipientId: field.recipient_id || 'public',
      })));
    } catch (err) {
      setError("Failed to load public form");
      console.error("Error loading public form:", err);
    } finally {
      setLoading(false);
    }
  }, [api, publicToken]);

  useEffect(() => {
    loadPublicForm();
  }, [loadPublicForm]);

  const handleDropOnPage = useCallback(
    (pageNumber, offset, item) => {
      // For public forms, we don't allow adding new fields
    },
    []
  );

  const removeField = useCallback((id) => {
    // For public forms, we don't allow removing fields
  }, []);

  const renderFields = useCallback(
    (pageNumber) =>
      fields
        .filter((f) => f.page === pageNumber)
        .map((f) => (
          <DroppedField
            key={f.id}
            field={f}
            onRemove={removeField}
            onSelect={(id, anchor) => {
              setSelectedId(id);
              setAnchorEl(anchor);
            }}
            onStartResize={(id, e) => startResize(id, e)}
          />
        )),
    [fields, removeField, startResize]
  );

  const handleSubmitForm = useCallback(async () => {
    if (!submitterName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      setSaving(true);
      
      // Prepare field data
      const fieldData = {};
      fields.forEach(field => {
        fieldData[field.id] = {
          value: field.value,
          signature_data: field.signatureData,
          type: field.type,
          label: field.label
        };
      });
      
      // Submit the form
      await api.post(`public-forms/${publicToken}/submit/`, {
        fields: fieldData,
        name: submitterName,
        email: submitterEmail
      });
      
      setSubmitted(true);
      setSuccess("Form submitted successfully! Thank you.");
    } catch (err) {
      setError("Failed to submit form");
      console.error("Error submitting form:", err);
    } finally {
      setSaving(false);
    }
  }, [api, publicToken, fields, submitterName, submitterEmail]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!document) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Invalid or expired public form</Alert>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Form submitted successfully! Thank you for your submission.
        </Alert>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {document.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your submission has been received and will be processed.
        </Typography>
      </Box>
    );
  }

  return (
    <DndProvider
      options={{
        backends: [
          { id: "html5", backend: HTML5Backend, transition: MouseTransition },
          { id: "touch", backend: TouchBackend, options: { enableMouseEvents: true }, preview: true, transition: TouchTransition },
        ],
      }}
    >
      <Preview>{() => null}</Preview>
      <CustomDragLayer />
      <Stack direction="row" spacing={2} sx={{ height: "100%", p: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Canvas
            fileUrl={document.file}
            scale={scale}
            numPages={numPages}
            setNumPages={setNumPages}
            onDropField={handleDropOnPage}
            renderFields={renderFields}
            pageRefs={pageRefs}
          />
        </Box>
        <Paper elevation={1} sx={{ width: 260, p: 2, flexShrink: 0, position: "sticky", top: 12, alignSelf: "flex-start", maxHeight: "calc(100vh - 24px)", overflow: "auto" }}>
          {/* Success/Error Messages */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Document Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {document.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill out the form below
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Submitter Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Your Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Your Name *"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
                size="small"
                required
              />
              <TextField
                fullWidth
                label="Email (Optional)"
                type="email"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                size="small"
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          {/* Action Buttons */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Actions
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="contained"
                onClick={handleSubmitForm}
                disabled={saving || !submitterName.trim()}
                fullWidth
                startIcon={saving ? <CircularProgress size={16} /> : null}
              >
                {saving ? "Submitting..." : "Submit Form"}
              </Button>
            </Stack>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Fill in all required fields and click Submit Form when done.
          </Typography>
        </Paper>

        <Popover
          open={Boolean(selectedId && anchorEl)}
          anchorEl={anchorEl}
          onClose={() => {
            setSelectedId(null);
            setAnchorEl(null);
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 2, minWidth: 240 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Field options
            </Typography>
            {(() => {
              const field = fields.find((f) => f.id === selectedId);
              if (!field) return null;
              if (field.type === "text") {
                return (
                  <TextField
                    fullWidth
                    size="small"
                    label="Text"
                    value={field.value || ""}
                    onChange={(e) => setFields((prev) => prev.map((f) => (f.id === selectedId ? { ...f, value: e.target.value } : f)))}
                    sx={{ mt: 1 }}
                  />
                );
              }
              if (field.type === "date") {
                return (
                  <TextField
                    fullWidth
                    size="small"
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={field.value || ""}
                    onChange={(e) => setFields((prev) => prev.map((f) => (f.id === selectedId ? { ...f, value: e.target.value } : f)))}
                    sx={{ mt: 1 }}
                  />
                );
              }
              if (field.type === "signature") {
                return (
                  <Button onClick={() => setSigOpen(true)} variant="outlined" size="small" sx={{ mt: 1 }}>
                    Sign…
                  </Button>
                );
              }
              return null;
            })()}
          </Box>
        </Popover>

        <SignatureModal sigOpen={sigOpen} setSigOpen={setSigOpen} sigRef={sigRef} selectedId={selectedId} setFields={setFields} />
      </Stack>
    </DndProvider>
  );
}

function SignatureModal({ sigOpen, setSigOpen, sigRef, selectedId, setFields }) {
  return (
    <Modal open={sigOpen} onClose={() => setSigOpen(false)}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 2, boxShadow: 24 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Draw Signature
        </Typography>
        <SignatureCanvas ref={sigRef} penColor="#000" canvasProps={{ width: 480, height: 180, style: { border: "1px solid #ccc" } }} />
        <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: "flex-end" }}>
          <Button onClick={() => sigRef.current?.clear()} size="small">
            Clear
          </Button>
          <Button
            onClick={() => {
              try {
                const data = sigRef.current?.toDataURL();
                if (data && selectedId) {
                  setFields((prev) => prev.map((f) => (f.id === selectedId ? { ...f, signatureData: data } : f)));
                }
              } finally {
                setSigOpen(false);
              }
            }}
            size="small"
            variant="contained"
          >
            Done
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
