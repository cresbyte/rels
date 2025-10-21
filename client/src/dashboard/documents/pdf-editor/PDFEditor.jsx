import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/auth/AuthContext";
import { useApi } from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../../utils/pdfWorker";
import FieldInteractionDialog from "./FieldInteractionDialog";
import PageThumbnails from "./PageThumbnails";
import PDFCanvas from "./PDFCanvas";
import RecipientManager from "./RecipientManager";
import RecipientSelector from "./RecipientSelector";
import WidgetsPalette from "./WidgetsPalette";

const PDFEditor = ({ fileURL, documentId: propDocumentId, isPublic = false, publicToken = null }) => {
  const { user: authUser } = useAuth();
  const { api } = useApi();
  const { id: urlDocumentId } = useParams();
  const navigate = useNavigate();
  const documentId = propDocumentId || urlDocumentId;
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [documentScenario, setDocumentScenario] = useState('self');
  const [publicSubmitLoading, setPublicSubmitLoading] = useState(false);
  const [publicSubmitError, setPublicSubmitError] = useState(null);
  const [submitterInfo, setSubmitterInfo] = useState({ name: '', email: '', phone: '' });
  const [publicInfo, setPublicInfo] = useState({ url: '', token: '' });
  const [submissions, setSubmissions] = useState([]);
  const [submissionsOpen, setSubmissionsOpen] = useState(false);
  const [subsLoading, setSubsLoading] = useState(false);
  const [publicFormConfig, setPublicFormConfig] = useState({
    required_fields: {
      name: false,
      email: false,
      phone: false,
    }
  });
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  // Load document data from backend
  useEffect(() => {
    const loadDocumentData = async () => {
      if (isPublic) {
        if (!publicToken) return;
        try {
          setLoading(true);
          const response = await api.get(`documents/public-forms/${publicToken}/`);
          const document = response.data;
          setDocumentScenario('template');
          if (document.fields && document.fields.length > 0) {
            const fieldsWithPages = [];
            document.fields.forEach(pageData => {
              pageData.pos.forEach(field => {
                fieldsWithPages.push({
                  ...field,
                  pageNumber: pageData.pageNumber
                });
              });
            });
            setFieldsWithPages(fieldsWithPages);
          }
        } catch (error) {
          console.error('Error loading public form:', error);
        } finally {
          setLoading(false);
        }
        return;
      }
      if (!documentId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`documents/${documentId}/`);
        const document = response.data;
        
        // Set document scenario
        setDocumentScenario(document.scenario || 'self');
        
        // Load public form config if exists
        if (document.public_form_config) {
          setPublicFormConfig(document.public_form_config);
        }
        
        // Set recipients from backend
        if (document.recipients) {
          setRecipients(document.recipients);
        } else {
          // Fallback to current user if no recipients
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
          }
        }
        
        // Set fields from backend
        if (document.fields && document.fields.length > 0) {
          const fieldsWithPages = [];
          document.fields.forEach(pageData => {
            pageData.pos.forEach(field => {
              fieldsWithPages.push({
                ...field,
                pageNumber: pageData.pageNumber
              });
            });
          });
          setFieldsWithPages(fieldsWithPages);
        }
      } catch (error) {
        console.error('Error loading document data:', error);
        // Fallback to current user initialization
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
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadDocumentData();
  }, [documentId, api, authUser?.email, isPublic, publicToken]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };


  const handleFieldAdd = (field) => {
    // For self-signing and public templates, automatically assign to current user
    if (documentScenario === 'self' || documentScenario === 'template') {
      const fieldWithPage = {
        ...field,
        recipientId: "recipient-current-user",
        pageNumber: currentPage,
      };
      setFieldsWithPages([...fieldsWithPages, fieldWithPage]);
      setSelectedFieldKey(field.key);
    } else {
      // For request signatures, show recipient selector
      setPendingField(field);
      setRecipientSelectorOpen(true);
    }
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

  const handleFieldValueSave = async (value) => {
    if (activeField) {
      try {
        // Update local state first
        handleFieldChange(activeField.key, { response: value });
        
        // Try to save to backend - this will work for both existing and new fields
        if (documentId) {
          try {
            await api.post(`documents/${documentId}/update_field_value_or_create/`, {
              field_id: activeField.key,
              value: value
            });
          } catch (error) {
            // If there's an error, just log it - the field will be saved when user clicks "Save Document Fields"
            console.log('Field value saved locally, will be persisted when document is saved');
          }
        }
        
        setActiveField(null);
      } catch (error) {
        console.error('Error saving field value:', error);
        setActiveField(null);
      }
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
    // For self-signing and public templates, allow current user to fill any field
    // For request signatures, only allow if field is assigned to current user
    const canFillField = documentScenario === 'self' || 
                        documentScenario === 'template' || 
                        (authUser && field.recipientId === `recipient-current-user`);
    
    if (canFillField) {
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

  const handleFinish = async () => {
    if (!documentId) {
      if (isPublic) {
        try {
          setPublicSubmitLoading(true);
          setPublicSubmitError(null);
          const placeholdersByPage = {};
          fieldsWithPages.forEach((field) => {
            const page = field.pageNumber;
            if (!placeholdersByPage[page]) {
              placeholdersByPage[page] = [];
            }
            const { pageNumber, ...fieldWithoutPage } = field;
            placeholdersByPage[page].push(fieldWithoutPage);
          });
          const payload = {
            name: submitterInfo.name || 'Anonymous',
            email: submitterInfo.email || '',
            phone: submitterInfo.phone || '',
            fields: placeholdersByPage,
          };
          await api.post(`documents/public-forms/${publicToken}/submit/`, payload);
          alert('Form submitted successfully');
        } catch (e) {
          console.error('Public submit failed:', e);
          setPublicSubmitError('Failed to submit form');
        } finally {
          setPublicSubmitLoading(false);
        }
        return;
      }
      alert("No document ID available");
      return;
    }

    try {
      setSaving(true);
      
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

      const data = {
        placeholders: placeholders,
        recipients: recipients,
      };

      // Save to backend
      await api.post(`documents/${documentId}/save_fields/`, data);
      
      alert("Document fields saved successfully!");
    } catch (error) {
      console.error('Error saving document fields:', error);
      alert("Error saving document fields. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentPageFields = fieldsWithPages.filter(
    (field) => field.pageNumber === currentPage
  );

  const handleGeneratePublicLink = async () => {
    if (!documentId) return;
    try {
      const resp = await api.post(`documents/${documentId}/create_public_form/`, {
        public_form_config: publicFormConfig
      });
      setPublicInfo({ url: resp.data.public_url, token: resp.data.public_token });
      window.navigator.clipboard?.writeText(resp.data.public_url).catch(() => {});
      alert('Public link generated and copied to clipboard');
    } catch (e) {
      console.error('Failed to generate public link', e);
    }
  };

  const loadSubmissions = async () => {
    if (!documentId) return;
    try {
      setSubsLoading(true);
      const resp = await api.get(`documents/${documentId}/submissions/`);
      setSubmissions(resp.data || []);
    } catch (e) {
      console.error('Failed to load submissions', e);
    } finally {
      setSubsLoading(false);
    }
  };

  const handleConfigSave = async () => {
    try {
      await api.patch(`documents/${documentId}/`, {
        public_form_config: publicFormConfig
      });
      setConfigDialogOpen(false);
      alert('Configuration saved successfully');
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Failed to save configuration');
    }
  };

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
              documentScenario={documentScenario}
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
          {!isPublic && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" onClick={() => setConfigDialogOpen(true)}>
                Configure Required Fields
              </Button>
              <Button variant="contained" onClick={handleGeneratePublicLink}>
                Get Public Link
              </Button>
              {publicInfo.url && (
                <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>{publicInfo.url}</Typography>
              )}
              <Button 
                variant="outlined" 
                onClick={() => navigate(`/dashboard/documents/${documentId}/submissions`)}
              >
                View All Submissions
              </Button>
            </Box>
          )}
          {documentScenario === 'request' && (
            <RecipientManager
              recipients={recipients}
              onAddRecipient={handleAddRecipient}
              onRemoveRecipient={handleRemoveRecipient}
            />
          )}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {!isPublic && <WidgetsPalette onDragStart={setDraggedWidgetType} />}
          </Box>

      
          {!isPublic ? (
            <Button
              variant="contained"
              onClick={handleFinish}
              disabled={!pdfFile || fieldsWithPages.length === 0 || saving}
            >
              {saving ? "Saving..." : "Save Document Fields"}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">Your Details</Typography>
              <input
                placeholder="Full name"
                value={submitterInfo.name}
                onChange={(e) => setSubmitterInfo({ ...submitterInfo, name: e.target.value })}
                style={{ padding: 8, border: '1px solid #ddd' }}
                required={publicFormConfig.required_fields?.name}
              />
              <input
                placeholder="Email"
                value={submitterInfo.email}
                onChange={(e) => setSubmitterInfo({ ...submitterInfo, email: e.target.value })}
                style={{ padding: 8, border: '1px solid #ddd' }}
                required={publicFormConfig.required_fields?.email}
              />
              <input
                placeholder="Phone"
                value={submitterInfo.phone}
                onChange={(e) => setSubmitterInfo({ ...submitterInfo, phone: e.target.value })}
                style={{ padding: 8, border: '1px solid #ddd' }}
                required={publicFormConfig.required_fields?.phone}
              />
              {publicSubmitError && (
                <Typography variant="caption" color="error">{publicSubmitError}</Typography>
              )}
              <Button
                variant="contained"
                onClick={handleFinish}
                disabled={!pdfFile || fieldsWithPages.length === 0 || publicSubmitLoading}
              >
                {publicSubmitLoading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          )}
         
        </Box>
      </Box>

      {!isPublic && (
      <RecipientSelector
        open={recipientSelectorOpen}
        recipients={recipients}
        onClose={() => {
          setRecipientSelectorOpen(false);
          setPendingField(null);
        }}
        onSelect={handleRecipientSelect}
      />)}

      <FieldInteractionDialog
        open={interactionDialogOpen}
        field={activeField}
        onClose={() => {
          setInteractionDialogOpen(false);
          setActiveField(null);
        }}
        onSave={handleFieldValueSave}
      />

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Required Fields</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select which fields should be required for public form submissions:
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={publicFormConfig.required_fields?.name || false}
                  onChange={(e) => setPublicFormConfig({
                    ...publicFormConfig,
                    required_fields: {
                      ...publicFormConfig.required_fields,
                      name: e.target.checked
                    }
                  })}
                />
              }
              label="Full Name"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={publicFormConfig.required_fields?.email || false}
                  onChange={(e) => setPublicFormConfig({
                    ...publicFormConfig,
                    required_fields: {
                      ...publicFormConfig.required_fields,
                      email: e.target.checked
                    }
                  })}
                />
              }
              label="Email Address"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={publicFormConfig.required_fields?.phone || false}
                  onChange={(e) => setPublicFormConfig({
                    ...publicFormConfig,
                    required_fields: {
                      ...publicFormConfig.required_fields,
                      phone: e.target.checked
                    }
                  })}
                />
              }
              label="Phone Number"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfigSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PDFEditor;
