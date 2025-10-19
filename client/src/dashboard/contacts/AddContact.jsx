import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Alert
} from "@mui/material";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const AddContact = ({ open, onClose, onSave, contact, error }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Reset form when modal opens or contact changes
  useEffect(() => {
    if (open) {
      if (contact) {
        // Edit mode - populate form with contact data
        setFormData({
          name: contact.name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          company: contact.company || ""
        });
      } else {
        // Add mode - reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: ""
        });
      }
      setErrors({});
      setServerError("");
    }
  }, [open, contact]);

  // Update serverError when error prop changes
  useEffect(() => {
    if (error) {
      setServerError(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Phone is optional, but validate format if provided
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        pb: 2
      }}>
        <Typography variant="h6" fontWeight={600}>
          {contact ? "Edit Contact" : "Add New Contact"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
            required
            InputProps={{
              sx: { borderRadius: 0 }
            }}
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{
              sx: { borderRadius: 0 }
            }}
          />
          
          <TextField
            fullWidth
            label="Phone Number (optional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              sx: { borderRadius: 0 }
            }}
          />
          
          <TextField
            fullWidth
            label="Company (optional)"
            name="company"
            value={formData.company}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              sx: { borderRadius: 0 }
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <Button 
            onClick={onClose}
            sx={{ 
              textTransform: "none", 
              borderRadius: 0,
              minWidth: 100
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            sx={{ 
              textTransform: "none", 
              borderRadius: 0,
              minWidth: 100
            }}
          >
            {contact ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddContact;