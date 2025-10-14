import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useDragLayer, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  DndProvider,
  MouseTransition,
  Preview,
  TouchTransition,
} from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Document, Page, pdfjs } from "react-pdf";
import SignatureCanvas from "react-signature-canvas";
import { useApi } from "../../api/axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const ItemTypes = { FIELD: "FIELD", PLACED_FIELD: "PLACED_FIELD" };

function DraggablePaletteItem({ label, type, widget }) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.FIELD,
      item: { type, label, widget },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [type, label, widget]
  );
  return (
    <Paper
      ref={dragRef}
      elevation={1}
      sx={{ p: 1, opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
    >
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );
}

function DroppedField({ field, onRemove, onSelect, onStartResize }) {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.PLACED_FIELD,
      item: { id: field.id },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [field.id]
  );
  return (
    <Box
      ref={dragRef}
      sx={{
        position: "absolute",
        left: field.x,
        top: field.y,
        px: 1,
        py: 0.5,
        bgcolor: "transparent",
        color: "text.primary",
        borderRadius: 0.5,
        userSelect: "none",
        opacity: isDragging ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid rgba(0,0,0,0.2)",
        width: field.width,
        height: field.height,
        boxSizing: "border-box",
        cursor: "move",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(field.id, e.currentTarget);
      }}
    >
      <Typography variant="caption" sx={{ pointerEvents: "none" }}>
        {field.type === "signature" && field.signatureData ? (
          <img
            src={field.signatureData}
            alt="signature"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
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
        sx={{ ml: 1, minWidth: 0, p: 0.25 }}
        variant="text"
        color="inherit"
      >
        ×
      </Button>
      {/* Resize handle */}
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

function CustomDragLayer() {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));
  if (!isDragging || !currentOffset) return null;
  // Invisible drag layer for natural feel
  return null;
}

export default function PdfCanvas({ fileUrl }) {
    const { api } = useApi();


  const [numPages, setNumPages] = useState(0);
  const [scale] = useState(1.2);
  const containerRef = useRef(null);
  const [fields, setFields] = useState([]);
  // Grid removed per request

  const [recipients] = useState([
    { id: "r1", name: "You" },
    { id: "r2", name: "Signer 2" },
  ]);
  const [activeRecipientId, setActiveRecipientId] = useState("r1");

  // Contact management state
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingWidgets, setLoadingWidgets] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [error, setError] = useState(null);

  // Page refs for scrolling from thumbnails
  const pageRefs = useRef({});
  const scrollToPage = (p) => {
    const el = pageRefs.current[p];
    if (el && el.scrollIntoView)
      el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Selection and popover for field options
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sigOpen, setSigOpen] = useState(false);
  const sigRef = useRef(null);

  // Resize state
  const resizingRef = useRef(null); // { id, startX, startY, startW, startH }

  const onMouseMove = useCallback((e) => {
    const r = resizingRef.current;
    if (!r) return;
    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;
    const newW = Math.max(24, r.startW + dx);
    const newH = Math.max(20, r.startH + dy);
    setFields((prev) =>
      prev.map((f) => (f.id === r.id ? { ...f, width: newW, height: newH } : f))
    );
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
      resizingRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        startW: f.width || 140,
        startH: f.height || 28,
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [fields, onMouseMove, onMouseUp]
  );

  // Fetch contacts from API
  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true);
    setError(null);
    try {
      const response = await api.get("contacts/");
      setContacts(response.data.results);
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error("Error fetching contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  // Fetch widgets from API
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
  }, []);

  // Add new contact
  const addContact = useCallback(async () => {
    if (!newContact.name || !newContact.email) {
      setError("Name and email are required");
      return;
    }

    setLoadingContacts(true);
    try {
      const response = await api.post("contacts/", newContact);
      setContacts((prev) => [...prev, response.data]);
      setNewContact({ name: "", email: "", phone: "", company: "" });
      setContactModalOpen(false);
    } catch (err) {
      setError("Failed to add contact");
      console.error("Error adding contact:", err);
    } finally {
      setLoadingContacts(false);
    }
  }, [newContact]);

  // Select contact for document
  const selectContact = useCallback(
    (contact) => {
      if (!selectedContacts.find((c) => c.id === contact.id)) {
        setSelectedContacts((prev) => [...prev, contact]);
      }
    },
    [selectedContacts]
  );

  // Remove contact from selected list
  const removeSelectedContact = useCallback((contactId) => {
    setSelectedContacts((prev) => prev.filter((c) => c.id !== contactId));
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchContacts();
    fetchWidgets();
  }, [fetchContacts, fetchWidgets]);

  const handleLoadSuccess = useCallback(
    ({ numPages: n }) => setNumPages(n),
    []
  );

  const handleDropOnPage = useCallback(
    (pageNumber, offset, item) => {
      if (item && item.id && item._move) {
        setFields((prev) =>
          prev.map((f) => {
            if (f.id !== item.id) return f;
            const x = f.x + (offset.dx || 0);
            const y = f.y + (offset.dy || 0);
            return { ...f, x, y, page: pageNumber };
          })
        );
        return;
      }
      const x = offset.x;
      const y = offset.y;
      setFields((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          type: item.type,
          label: item.label,
          page: pageNumber,
          x,
          y,
          width: 140,
          height: 28,
          recipientId: activeRecipientId,
        },
      ]);
    },
    [activeRecipientId]
  );

  const removeField = useCallback((id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <DndProvider
      options={{
        backends: [
          { id: "html5", backend: HTML5Backend, transition: MouseTransition },
          {
            id: "touch",
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition,
          },
        ],
      }}
    >
      <Preview>
        {(props) => {
          // Invisible preview for natural dragging
          return null;
        }}
      </Preview>
      <CustomDragLayer />
      <Stack direction="row" spacing={2} sx={{ height: "100%", p: 2 }}>
        {/* Left: thumbnails (sticky) */}
        <Paper
          elevation={1}
          sx={{
            width: 180,
            p: 1,
            flexShrink: 0,
            overflow: "auto",
            maxHeight: "calc(100vh - 24px)",
            position: "sticky",
            top: 12,
            alignSelf: "flex-start",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Pages
          </Typography>
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
              <Box
                key={p}
                onClick={() => scrollToPage(p)}
                sx={{
                  cursor: "pointer",
                  mb: 1,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <Page
                  pageNumber={p}
                  width={140}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Box>
            ))}
          </Document>
        </Paper>

        {/* Center: PDF */}
        <Box ref={containerRef} sx={{ flex: 1, overflow: "auto" }}>
          <Document
            file={fileUrl}
            onLoadSuccess={handleLoadSuccess}
            loading={<Typography sx={{ p: 2 }}>Loading PDF…</Typography>}
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PdfPageDrop
                  key={pageNumber}
                  pageNumber={pageNumber}
                  scale={scale}
                  onDrop={(offset, item) =>
                    handleDropOnPage(pageNumber, offset, item)
                  }
                  setRef={(el) => {
                    if (el) pageRefs.current[pageNumber] = el;
                  }}
                >
                  {fields
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
                    ))}
                </PdfPageDrop>
              )
            )}
          </Document>
        </Box>

        {/* Right: contacts + widgets (sticky) */}
        <Paper
          elevation={1}
          sx={{
            width: 260,
            p: 2,
            flexShrink: 0,
            position: "sticky",
            top: 12,
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 24px)",
            overflow: "auto",
          }}
        >
          {/* Error display */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Contacts Section */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Contacts</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setContactModalOpen(true)}
                variant="outlined"
              >
                Add Contact
              </Button>
            </Box>

            {/* Selected Contacts */}
            {selectedContacts.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  Selected Contacts:
                </Typography>
                <Stack spacing={1}>
                  {selectedContacts.map((contact) => (
                    <Chip
                      key={contact.id}
                      label={`${contact.name} (${contact.email})`}
                      onDelete={() => removeSelectedContact(contact.id)}
                      deleteIcon={<DeleteIcon />}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Widgets Section */}
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
                  <DraggablePaletteItem
                    key={widget.id}
                    label={widget.label}
                    type={widget.widget_type}
                    widget={widget}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Drag widgets onto the page. Columns are sticky while you scroll.
          </Typography>
        </Paper>
      </Stack>

      {/* Field popover */}
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
            value={
              fields.find((f) => f.id === selectedId)?.recipientId ||
              activeRecipientId
            }
            onChange={(e) =>
              setFields((prev) =>
                prev.map((f) =>
                  f.id === selectedId
                    ? { ...f, recipientId: e.target.value }
                    : f
                )
              )
            }
          >
            {recipients.map((r) => (
              <FormControlLabel
                key={r.id}
                value={r.id}
                control={<Radio size="small" />}
                label={`Assign to: ${r.name}`}
              />
            ))}
          </RadioGroup>
          {/* Type-specific editors */}
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
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f) =>
                        f.id === selectedId
                          ? { ...f, value: e.target.value }
                          : f
                      )
                    )
                  }
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
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f) =>
                        f.id === selectedId
                          ? { ...f, value: e.target.value }
                          : f
                      )
                    )
                  }
                  sx={{ mt: 1 }}
                />
              );
            }
            if (field.type === "signature") {
              return (
                <Button
                  onClick={() => setSigOpen(true)}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Sign…
                </Button>
              );
            }
            return null;
          })()}
          {/* Width/Height controls hidden but values still tracked internally */}
        </Box>
      </Popover>

      {/* Signature modal */}
      <Modal open={sigOpen} onClose={() => setSigOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Draw Signature
          </Typography>
          <SignatureCanvas
            ref={sigRef}
            penColor="#000"
            canvasProps={{
              width: 480,
              height: 180,
              style: { border: "1px solid #ccc" },
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, justifyContent: "flex-end" }}
          >
            <Button onClick={() => sigRef.current?.clear()} size="small">
              Clear
            </Button>
            <Button
              onClick={() => {
                try {
                  const data = sigRef.current?.toDataURL();
                  if (data && selectedId) {
                    setFields((prev) =>
                      prev.map((f) =>
                        f.id === selectedId ? { ...f, signatureData: data } : f
                      )
                    );
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

      {/* Contact Management Modal */}
      <Dialog
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Manage Contacts
            <IconButton onClick={() => setContactModalOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Add New Contact
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact((prev) => ({ ...prev, name: e.target.value }))
                }
                size="small"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact((prev) => ({ ...prev, email: e.target.value }))
                }
                size="small"
              />
              <TextField
                fullWidth
                label="Phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact((prev) => ({ ...prev, phone: e.target.value }))
                }
                size="small"
              />
              <TextField
                fullWidth
                label="Company"
                value={newContact.company}
                onChange={(e) =>
                  setNewContact((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                size="small"
              />
              <Button
                variant="contained"
                onClick={addContact}
                disabled={
                  loadingContacts || !newContact.name || !newContact.email
                }
                startIcon={
                  loadingContacts ? <CircularProgress size={16} /> : <AddIcon />
                }
              >
                {loadingContacts ? "Adding..." : "Add Contact"}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Select Contacts
            </Typography>
            {loadingContacts ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List sx={{ maxHeight: 300, overflow: "auto" }}>
                {contacts.map((contact) => (
                  <ListItem
                    key={contact.id}
                    button
                    onClick={() => selectContact(contact)}
                    sx={{
                      bgcolor: selectedContacts.find((c) => c.id === contact.id)
                        ? "action.selected"
                        : "transparent",
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemText
                      primary={contact.name}
                      secondary={`${contact.email}${
                        contact.company ? ` • ${contact.company}` : ""
                      }`}
                    />
                  </ListItem>
                ))}
                {contacts.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No contacts found"
                      secondary="Add a new contact above"
                    />
                  </ListItem>
                )}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
}

function PdfPageDrop({ pageNumber, scale, children, onDrop, setRef }) {
  const pageRef = useRef(null);
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: [ItemTypes.FIELD, ItemTypes.PLACED_FIELD],
      drop: (item, monitor) => {
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();
        // When moving an existing field, use delta for smooth behavior
        const diff = monitor.getDifferenceFromInitialOffset();
        if (item && item.id && diff) {
          onDrop({ dx: diff.x, dy: diff.y, rect }, { ...item, _move: true });
          return;
        }
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const x = clientOffset.x - rect.left;
        const y = clientOffset.y - rect.top;
        onDrop({ x, y }, item);
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [onDrop]
  );

  dropRef(pageRef);
  useEffect(() => {
    if (setRef) setRef(pageRef.current);
  }, [setRef]);

  return (
    <Box sx={{ position: "relative", display: "inline-block", m: 2 }}>
      <Box
        ref={pageRef}
        sx={{
          position: "relative",
          outline: isOver ? "2px dashed #1976d2" : "none",
        }}
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
        <Box sx={{ position: "absolute", inset: 0 }}>{children}</Box>
      </Box>
    </Box>
  );
}

// Resize logic bound at component level
function startResize(id, e) {
  // This placeholder is replaced during wiring in parent via prop
}
