import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/auth/AuthContext";
import "../../../utils/pdfWorker";
import FieldInteractionDialog from "./FieldInteractionDialog";
import PageThumbnails from "./PageThumbnails";
import PDFCanvas from "./PDFCanvas";
import RecipientManager from "./RecipientManager";
import RecipientSelector from "./RecipientSelector";
import WidgetsPalette from "./WidgetsPalette";

const PDFEditor = ({ fileURL }) => {
  const { user: authUser } = useAuth();
  const [pdfFile, setPdfFile] = useState(fileURL);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [fieldsWithPages, setFieldsWithPages] = useState([]);
  const [selectedFieldKey, setSelectedFieldKey] = useState(null);
  const [recipients, setRecipients] = useState([]); // Will be initialized with current user
  const [draggedWidgetType, setDraggedWidgetType] = useState(null);
  const [recipientSelectorOpen, setRecipientSelectorOpen] = useState(false);
  const [pendingField, setPendingField] = useState(null);
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // ✅ Initialize recipients with current user on first load
  useEffect(() => {
    if (authUser?.email) {
      const currentUserRecipient = {
        id: "recipient-current-user",
        name:
          `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim() ||
          authUser.email,
        email: authUser.email,
        role: "Signer",
        fieldsAssigned: [],
        isCurrentUser: true,
      };
      setRecipients([currentUserRecipient]);
    } else {
      setRecipients([]);
    }
  }, [authUser?.email]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setPdfFile(fileURL);
      setCurrentPage(1);
      setFieldsWithPages([]);
      setNumPages(0);
    }
  };

  const handleFieldAdd = (field) => {
    setPendingField(field);
    setRecipientSelectorOpen(true);
  };

  const handleRecipientSelect = (recipientId) => {
    if (pendingField) {
      const fieldWithPage = {
        ...pendingField,
        recipientId,
        pageNumber: currentPage,
      };
      setFieldsWithPages([...fieldsWithPages, fieldWithPage]);
      setSelectedFieldKey(pendingField.key);
      setPendingField(null);
    }
  };

  const handleFieldValueSave = (value) => {
    if (activeField) {
      handleFieldChange(activeField.key, { response: value });
      setActiveField(null);
    }
  };

  const handleFieldChange = (key, newAttrs) => {
    setFieldsWithPages(
      fieldsWithPages.map((field) =>
        field.key === key ? { ...field, ...newAttrs } : field
      )
    );
  };

  const handleFieldDelete = (key) => {
    setFieldsWithPages(fieldsWithPages.filter((field) => field.key !== key));
    setSelectedFieldKey(null);
  };

  const handleFieldClick = (field) => {
    if (authUser && field.recipientId === `recipient-current-user`) {
      setActiveField(field);
      setInteractionDialogOpen(true);
    }
  };

  const handleAddRecipient = (recipient) => {
    // Prevent duplicate current user
    if (recipient.isCurrentUser) return;
    setRecipients((prev) => [...prev, recipient]);
  };

  const handleRemoveRecipient = (id) => {
    // Prevent removal of current user
    if (id === "recipient-current-user") return;
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleFinish = () => {
    const placeholdersByPage = {};

    fieldsWithPages.forEach((field) => {
      const page = field.pageNumber;
      if (!placeholdersByPage[page]) {
        placeholdersByPage[page] = [];
      }
      const { pageNumber, ...fieldWithoutPage } = field;
      placeholdersByPage[page].push(fieldWithoutPage);
    });

    const placeholders = Object.entries(placeholdersByPage).map(
      ([pageNum, pos]) => ({
        pageNumber: parseInt(pageNum),
        pos,
      })
    );

    const output = {
      Placeholders: placeholders,
      Recipients: recipients,
    };

    console.log("=== PDF EDITOR OUTPUT ===");
    console.log(JSON.stringify(output, null, 2));
    console.log("========================");

    alert(
      "Data logged to console! Open the browser console (F12) to see the output."
    );
  };

  const currentPageFields = fieldsWithPages.filter(
    (field) => field.pageNumber === currentPage
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        {pdfFile && numPages > 0 && (
          <Box sx={{ width: 200, flexShrink: 0 }}>
            <PageThumbnails
              pdfFile={pdfFile}
              numPages={numPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Box>
        )}

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {pdfFile ? (
            <PDFCanvas
              pdfFile={pdfFile}
              currentPage={currentPage}
              fields={currentPageFields}
              selectedFieldKey={selectedFieldKey}
              onFieldSelect={setSelectedFieldKey}
              onFieldChange={handleFieldChange}
              onFieldDelete={handleFieldDelete}
              onFieldAdd={handleFieldAdd}
              onDocumentLoad={onDocumentLoadSuccess}
              currentUserId={authUser ? `recipient-current-user` : null}
              onFieldClick={handleFieldClick}
            />
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f9fafb",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <CloudUpload sx={{ fontSize: 80, color: "#9ca3af", mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  Upload a PDF to Get Started
                </Typography>
                <Typography variant="body1" sx={{ color: "#6b7280" }}>
                  Click the "Upload PDF" button in the header
                </Typography>
              </div>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            p: 2,
            gap: 2,
          }}
        >
          <RecipientManager
            recipients={recipients}
            onAddRecipient={handleAddRecipient}
            onRemoveRecipient={handleRemoveRecipient}
          />
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <WidgetsPalette onDragStart={setDraggedWidgetType} />
          </Box>

          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            sx={{
              bgcolor: "#8b5cf6",
              "&:hover": { bgcolor: "#7c3aed" },
            }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileUpload}
            />
          </Button>
          <Button
            variant="contained"
            onClick={handleFinish}
            disabled={!pdfFile || fieldsWithPages.length === 0}
            sx={{
              bgcolor: "white",
              color: "#3b82f6",
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            Finish & Log Data
          </Button>
        </Box>
      </Box>

      <RecipientSelector
        open={recipientSelectorOpen}
        recipients={recipients}
        onClose={() => {
          setRecipientSelectorOpen(false);
          setPendingField(null);
        }}
        onSelect={handleRecipientSelect}
      />

      <FieldInteractionDialog
        open={interactionDialogOpen}
        field={activeField}
        onClose={() => {
          setInteractionDialogOpen(false);
          setActiveField(null);
        }}
        onSave={handleFieldValueSave}
      />
    </Box>
  );
};

export default PDFEditor;
