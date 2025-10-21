import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Visibility,
  Download,
  ArrowBack,
  Settings,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../api/axios';

const SubmissionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useApi();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [publicFormConfig, setPublicFormConfig] = useState({
    required_fields: {
      name: false,
      email: false,
      phone: false,
    }
  });

  useEffect(() => {
    loadDocumentAndSubmissions();
  }, [id]);

  const loadDocumentAndSubmissions = async () => {
    try {
      setLoading(true);
      const [docResponse, subsResponse] = await Promise.all([
        api.get(`documents/${id}/`),
        api.get(`documents/${id}/submissions/`)
      ]);
      
      setDocument(docResponse.data);
      setSubmissions(subsResponse.data || []);
      
      // Load existing public form config
      if (docResponse.data.public_form_config) {
        setPublicFormConfig(docResponse.data.public_form_config);
      } else {
        // Initialize with default config if none exists
        setPublicFormConfig({
          required_fields: {
            name: false,
            email: false,
            phone: false,
          }
        });
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSave = async () => {
    try {
      await api.patch(`documents/${id}/`, {
        public_form_config: publicFormConfig
      });
      setConfigDialogOpen(false);
      alert('Configuration saved successfully');
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Failed to save configuration');
    }
  };

  const handlePreview = (submission) => {
    // TODO: Implement preview functionality
    console.log('Preview submission:', submission);
    alert('Preview functionality coming soon');
  };

  const handleDownload = (submission) => {
    // TODO: Implement download functionality
    console.log('Download submission:', submission);
    alert('Download functionality coming soon');
  };

  const getFieldColumns = () => {
    if (!document || !document.fields || document.fields.length === 0) {
      return [];
    }
    
    const allFields = [];
    document.fields.forEach(pageData => {
      pageData.pos.forEach(field => {
        if (!allFields.find(f => f.key === field.key)) {
          allFields.push(field);
        }
      });
    });
    
    return allFields;
  };

  const getFieldValue = (submission, fieldKey) => {
    const fieldData = submission.field_data || {};
    const pageData = Object.values(fieldData).find(page => 
      page.some(field => field.key === fieldKey)
    );
    
    if (pageData) {
      const field = pageData.find(field => field.key === fieldKey);
      return field ? (field.value || field.response || '') : '';
    }
    
    return '';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const fieldColumns = getFieldColumns();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Submissions for "{document?.title}"
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setConfigDialogOpen(true)}
        >
          Configure Required Fields
        </Button>
      </Box>

      {submissions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No submissions yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your public form link to start receiving submissions
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                {fieldColumns.map(field => (
                  <TableCell key={field.key}>{field.label || field.type}</TableCell>
                ))}
                <TableCell>Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {submission.submitter_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{submission.submitter_email || '-'}</TableCell>
                  <TableCell>{submission.submitter_phone || '-'}</TableCell>
                  {fieldColumns.map(field => (
                    <TableCell key={field.key}>
                      {getFieldValue(submission, field.key) || '-'}
                    </TableCell>
                  ))}
                  <TableCell>
                    {new Date(submission.submitted_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(submission)}
                        title="Preview"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(submission)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

export default SubmissionsPage;
