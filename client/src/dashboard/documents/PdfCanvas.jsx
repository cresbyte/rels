import { Box, Button, CircularProgress, Divider, Modal, FormControlLabel, Popover, Radio, RadioGroup, Stack, TextField, Typography, Paper, Alert, Chip } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useApi } from "../../api/axios";
import Canvas from "./canvas/Canvas";
import ContactsPanel from "./canvas/ContactsPanel";
import { DraggablePaletteItem, DroppedField } from "./canvas/FieldsLayer";
import { DndProvider, MouseTransition, Preview, TouchTransition } from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { CustomDragLayer } from "./canvas/Canvas";
import { mergeFieldsIntoPDF, downloadPDF } from "../../utils/pdfMerger";

export default function PdfCanvas({ fileUrl, documentId, documentType = 'self-sign' }) {
  const { api } = useApi();

  const [numPages, setNumPages] = useState(0);
  const [scale] = useState(1.2);
  const [fields, setFields] = useState([]);

  const [recipients] = useState([
    { id: "r1", name: "You" },
    { id: "r2", name: "Signer 2" },
  ]);
  const [activeRecipientId] = useState("r1");

  const [loadingWidgets, setLoadingWidgets] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const pageRefs = useRef({});
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sigOpen, setSigOpen] = useState(false);
  const sigRef = useRef(null);

  const resizingRef = useRef(null);
  
  // Document management state
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const fetchWidgets = useCallback(async () => {
    setLoadingWidgets(true);
    setError(null);
    try {
      const response = await api.get("widgets/");
      setWidgets(response.data.results);
    } catch (err) {
      setError("Failed to fetch widgets");
      console.error("Error fetching widgets:", err);
    } finally {
      setLoadingWidgets(false);
    }
  }, [api]);

  useEffect(() => {
    fetchWidgets();
    if (documentId) {
      loadDocument();
    }
  }, [fetchWidgets, documentId]);

  const loadDocument = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    try {
      const response = await api.get(`documents/${documentId}/`);
      setDocument(response.data);
      
      // Load existing fields
      const fieldsResponse = await api.get(`documents/${documentId}/fields/`);
      const loadedFields = fieldsResponse.data.map(field => ({
        id: field.id,
        type: field.widget_type,
        label: field.label,
        page: field.page_number,
        x: field.x_position,
        y: field.y_position,
        width: field.width || 140,
        height: field.height || 28,
        value: field.value,
        signatureData: field.signature_data,
        recipientId: field.recipient_id || 'r1',
      }));
      setFields(loadedFields);
    } catch (err) {
      setError("Failed to load document");
      console.error("Error loading document:", err);
    } finally {
      setLoading(false);
    }
  }, [api, documentId]);

  const saveDocument = useCallback(async (fieldsToSave = fields) => {
    if (!documentId) return;
    setSaving(true);
    try {
      console.log("Starting save process with fields:", fieldsToSave);
      
      // Get existing fields from server to compare
      const existingFieldsResponse = await api.get(`documents/${documentId}/fields/`);
      const existingFields = existingFieldsResponse.data;
      const existingFieldIds = new Set(existingFields.map(f => f.id));
      
      console.log("Existing fields from server:", existingFields);
      
      // Track fields that are still present
      const currentFieldIds = new Set();
      
      // Process each field
      const updatedFields = [];
      for (const field of fieldsToSave) {
        const fieldData = {
          widget_type: field.type,
          label: field.label,
          page_number: field.page,
          x_position: field.x,
          y_position: field.y,
          width: field.width,
          height: field.height,
          value: field.value,
          signature_data: field.signatureData,
          recipient_id: field.recipientId,
        };
        
        console.log("Processing field:", field, "Field data:", fieldData);
        
        // Check if this is a new field (contains '-' in ID) or existing field
        if (field.id && field.id.toString().includes('-')) {
          // New field - create it
          console.log("Creating new field with POST request to:", `documents/${documentId}/fields/`);
          const response = await api.post(`documents/${documentId}/fields/`, fieldData);
          console.log("Field creation response:", response.data);
          // Update the field ID with the server response
          updatedFields.push({ ...field, id: response.data.id });
          currentFieldIds.add(response.data.id);
        } else if (field.id && existingFieldIds.has(field.id)) {
          // Existing field - update it
          console.log("Updating existing field with PATCH request to:", `document-fields/${field.id}/`);
          await api.patch(`document-fields/${field.id}/`, fieldData);
          updatedFields.push(field);
          currentFieldIds.add(field.id);
        }
      }
      
      // Update the fields state with the corrected IDs
      setFields(updatedFields);
      
      // Delete fields that are no longer present
      for (const existingField of existingFields) {
        if (!currentFieldIds.has(existingField.id)) {
          console.log("Deleting field:", existingField.id);
          await api.delete(`document-fields/${existingField.id}/`);
        }
      }
      
      console.log("Save process completed successfully");
      setSuccess("Document saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save document");
      console.error("Error saving document:", err);
    } finally {
      setSaving(false);
    }
  }, [api, documentId, fields]);

  const handleSaveOnly = useCallback(async () => {
    try {
      setSaving(true);
      await saveDocument();
    } catch (err) {
      setError("Failed to save document");
      console.error("Error saving document:", err);
    } finally {
      setSaving(false);
    }
  }, [saveDocument]);

  const handleSaveAndDownload = useCallback(async () => {
    try {
      setSaving(true);
      
      // First save the document
      await saveDocument();
      
      // Then merge and download
      const pdfBytes = await mergeFieldsIntoPDF(fileUrl, fields);
      downloadPDF(pdfBytes, `signed-${document?.title || 'document'}.pdf`);
      
      setSuccess("Document downloaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to generate PDF");
      console.error("Error generating PDF:", err);
    } finally {
      setSaving(false);
    }
  }, [fileUrl, fields, document, saveDocument]);

  const handleSendForSigning = useCallback(async () => {
    if (selectedContacts.length === 0) {
      setError("Please select at least one contact");
      return;
    }
    
    try {
      setSaving(true);
      await saveDocument();
      
      const response = await api.post(`documents/${documentId}/send-for-signing/`, {
        contacts: selectedContacts.map(c => c.id),
        fields: fields.map(f => ({
          id: f.id,
          recipient_id: f.recipientId,
        }))
      });
      
      setSuccess("Document sent for signing successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to send document for signing");
      console.error("Error sending for signing:", err);
    } finally {
      setSaving(false);
    }
  }, [api, documentId, selectedContacts, fields, saveDocument]);

  const handleCreatePublicForm = useCallback(async () => {
    try {
      setSaving(true);
      await saveDocument();
      
      const response = await api.post(`documents/${documentId}/create-public-form/`);
      
      setSuccess(`Public form created! Share this link: ${response.data.public_url}`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError("Failed to create public form");
      console.error("Error creating public form:", err);
    } finally {
      setSaving(false);
    }
  }, [api, documentId, saveDocument]);

  const handleDropOnPage = useCallback(
    (pageNumber, offset, item) => {
      console.log("Field dropped on page:", pageNumber, "offset:", offset, "item:", item);
      
      if (item && item.id && item._move) {
        console.log("Moving existing field:", item.id);
        setFields((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, x: offset.x, y: offset.y, page: pageNumber } : f))
        );
        return;
      }
      const x = offset.x;
      const y = offset.y;
      const newField = {
        id: `${Date.now()}-${Math.random()}`,
        type: item.type,
        label: item.label,
        page: pageNumber,
        x,
        y,
        width: 140,
        height: 28,
        recipientId: activeRecipientId,
      };
      console.log("Creating new field:", newField);
      setFields((prev) => [...prev, newField]);
    },
    [activeRecipientId]
  );

  const removeField = useCallback((id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
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
            fileUrl={fileUrl}
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

          {/* Document Type Indicator */}
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={documentType === 'self-sign' ? 'Self Sign' : documentType === 'multi-signer' ? 'Multi Signer' : 'Public Form'} 
              color={documentType === 'self-sign' ? 'primary' : documentType === 'multi-signer' ? 'secondary' : 'success'}
              size="small"
            />
          </Box>

          {documentType === 'multi-signer' && (
            <ContactsPanel
              api={api}
              selectedContacts={selectedContacts}
              onSelectContact={(contact) =>
                setSelectedContacts((prev) => (prev.find((c) => c.id === contact.id) ? prev : [...prev, contact]))
              }
              onRemoveSelectedContact={(id) => setSelectedContacts((prev) => prev.filter((c) => c.id !== id))}
            />
          )}
          {documentType === 'multi-signer' && <Divider sx={{ my: 2 }} />}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Widgets
            </Typography>
            {loadingWidgets ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Stack spacing={1}>
                {widgets.map((widget) => (
                  <DraggablePaletteItem key={widget.id} label={widget.label} type={widget.widget_type} widget={widget} />
                ))}
              </Stack>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          
          {/* Action Buttons */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Actions
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                onClick={handleSaveOnly}
                disabled={saving}
                fullWidth
                startIcon={saving ? <CircularProgress size={16} /> : null}
              >
                {saving ? "Saving..." : "Save Only"}
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAndDownload}
                disabled={saving || fields.length === 0}
                fullWidth
                startIcon={saving ? <CircularProgress size={16} /> : null}
              >
                {saving ? "Processing..." : "Save & Download"}
              </Button>
              
              {documentType === 'multi-signer' && (
                <Button
                  variant="outlined"
                  onClick={handleSendForSigning}
                  disabled={saving || selectedContacts.length === 0}
                  fullWidth
                  startIcon={saving ? <CircularProgress size={16} /> : null}
                >
                  {saving ? "Sending..." : "Send for Signing"}
                </Button>
              )}
              
              {documentType === 'public-form' && (
                <Button
                  variant="outlined"
                  onClick={handleCreatePublicForm}
                  disabled={saving}
                  fullWidth
                  startIcon={saving ? <CircularProgress size={16} /> : null}
                >
                  {saving ? "Creating..." : "Create Public Form"}
                </Button>
              )}
            </Stack>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Drag widgets onto the page. Columns are sticky while you scroll.
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
          <RadioGroup
            value={fields.find((f) => f.id === selectedId)?.recipientId || "r1"}
            onChange={(e) =>
              setFields((prev) => prev.map((f) => (f.id === selectedId ? { ...f, recipientId: e.target.value } : f)))
            }
          >
            {recipients.map((r) => (
              <FormControlLabel key={r.id} value={r.id} control={<Radio size="small" />} label={`Assign to: ${r.name}`} />
            ))}
          </RadioGroup>
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
