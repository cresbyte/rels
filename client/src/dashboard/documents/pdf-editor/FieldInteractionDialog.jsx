import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import AddSign from '../../signatures/AddSign';
import { useApi } from '../../../api/axios';

const FieldInteractionDialog = ({
  open,
  field,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState('');
  const [showAddSign, setShowAddSign] = useState(false);
  const [existingSignatures, setExistingSignatures] = useState([]);
  const [loadingSignatures, setLoadingSignatures] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { api } = useApi();

  const handleSave = () => {
    if (field?.type === 'signature' || field?.type === 'initials') {
      // For signature fields, we'll use the AddSign component
      setShowAddSign(true);
    } else {
      onSave(value);
      setValue('');
      handleClose();
    }
  };

  const handleClose = () => {
    setValue('');
    setShowAddSign(false);
    setSelectedTab(0);
    onClose();
  };

  // Load existing signatures when dialog opens
  useEffect(() => {
    if (open && (field?.type === 'signature' || field?.type === 'initials')) {
      loadExistingSignatures();
    }
  }, [open, field?.type]);

  const loadExistingSignatures = async () => {
    try {
      setLoadingSignatures(true);
      const response = await api.get('signatures/');
      setExistingSignatures(response.data.results || []);
    } catch (error) {
      console.error('Error loading signatures:', error);
      setExistingSignatures([]);
    } finally {
      setLoadingSignatures(false);
    }
  };

  const handleSignatureSave = (signatureData) => {
    // signatureData contains: { name, image, type, font?, color? }
    // We use the image (dataURL) as the signature response
    onSave(signatureData.image);
    handleClose();
  };

  const handleSelectExistingSignature = (signature) => {
    // Use the signature image URL as the signature response
    onSave(signature.image);
    handleClose();
  };

  

  const getTitle = () => {
    if (!field) return '';
    if (field.type === 'signature') return 'Sign Here';
    if (field.type === 'initials') return 'Add Initials';
    return `Enter ${field.type.charAt(0).toUpperCase() + field.type.slice(1)}`;
  };

  const isSignatureField = field?.type === 'signature' || field?.type === 'initials';

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {isSignatureField ? (
              <Box>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
                  <Tab label="Select Existing" />
                  <Tab label="Create New" />
                </Tabs>
                
                {selectedTab === 0 && (
                  <Box>
                    {loadingSignatures ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : existingSignatures.length > 0 ? (
                      <Grid container spacing={2}>
                        {existingSignatures.map((signature) => (
                          <Grid item xs={6} sm={4} key={signature.id}>
                            <Card 
                              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                              onClick={() => handleSelectExistingSignature(signature)}
                            >
                              <CardMedia
                                component="img"
                                height="100"
                                image={signature.image}
                                alt={signature.name}
                                sx={{ objectFit: 'contain' }}
                              />
                              <CardContent sx={{ p: 1 }}>
                                <Typography variant="caption" align="center" display="block">
                                  {signature.name}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No existing signatures found. Create a new one using the "Create New" tab.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                
                {selectedTab === 1 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {field.type === 'signature' ? 'Create your signature' : 'Create your initials'}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      size="large"
                      sx={{ minWidth: 200 }}
                    >
                      Create Signature
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <TextField
                fullWidth
                label={`Enter ${field?.type}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                variant="outlined"
                autoFocus
                type={field?.type === 'number' ? 'number' : field?.type === 'email' ? 'email' : 'text'}
                multiline={field?.type === 'text'}
                rows={field?.type === 'text' ? 3 : 1}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!isSignatureField && (
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!value}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <AddSign
        open={showAddSign}
        onClose={() => setShowAddSign(false)}
        onSave={handleSignatureSave}
      />
    </>
  );
};

export default FieldInteractionDialog;
