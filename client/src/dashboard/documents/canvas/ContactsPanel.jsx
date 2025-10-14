import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

export default function ContactsPanel({ api, selectedContacts, onSelectContact, onRemoveSelectedContact }) {
  const [contacts, setContacts] = useState([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", company: "" });
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [error, setError] = useState(null);

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
  }, [api]);

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
  }, [api, newContact]);

  const selectContact = useCallback((contact) => {
    onSelectContact?.(contact);
  }, [onSelectContact]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <Box sx={{ mb: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle2">Contacts</Typography>
          <IconButton size="small" onClick={() => setContactModalOpen(true)} variant="contained" color="primary">
            <AddIcon />
          </IconButton>
        </Box>

        {selectedContacts.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <Stack spacing={1}>
              {selectedContacts.map((contact, index) => (
                <Chip
                  key={index}
                  label={`${contact.name} (${contact.email})`}
                  onDelete={() => onRemoveSelectedContact?.(contact.id)}
                  deleteIcon={<DeleteIcon />}
                  size="small"
                  sx={{ justifyContent: "space-between" }}
                  avatar={<Avatar>{contact?.name?.charAt(0)}</Avatar>}
                />
              ))}
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mb: 2 }}>
            No contacts selected. Click + to add.
          </Typography>
        )}
      </Box>

      <Dialog open={contactModalOpen} onClose={() => setContactModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                size="small"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                size="small"
              />
              <TextField
                fullWidth
                label="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                size="small"
              />
              <TextField
                fullWidth
                label="Company"
                value={newContact.company}
                onChange={(e) => setNewContact((prev) => ({ ...prev, company: e.target.value }))}
                size="small"
              />
              <Button
                variant="contained"
                onClick={addContact}
                disabled={loadingContacts || !newContact.name || !newContact.email}
                startIcon={loadingContacts ? <CircularProgress size={16} /> : <AddIcon />}
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
                      bgcolor: selectedContacts.find((c) => c.id === contact.id) ? "action.selected" : "transparent",
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemText
                      primary={contact.name}
                      secondary={`${contact.email}${contact.company ? ` • ${contact.company}` : ""}`}
                    />
                  </ListItem>
                ))}
                {contacts.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No contacts found" secondary="Add a new contact above" />
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
    </Box>
  );
}


