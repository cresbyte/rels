import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import AddSign from '../../signatures/AddSign';

const FieldInteractionDialog = ({
  open,
  field,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState('');
  const [showAddSign, setShowAddSign] = useState(false);

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
    onClose();
  };

  const handleSignatureSave = (signatureData) => {
    // signatureData contains: { name, image, type, font?, color? }
    // We use the image (dataURL) as the signature response
    onSave(signatureData.image);
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
