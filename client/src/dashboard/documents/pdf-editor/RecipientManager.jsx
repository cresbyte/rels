import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useApi } from "../../../api/axios";
import { useAuth } from "../../../auth/auth/AuthContext";
import AddContact from "../../contacts/AddContact";

const RecipientManager = ({
  recipients: externalRecipients,
  onAddRecipient,
  onRemoveRecipient,
}) => {
  const { api } = useApi();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addContactOpen, setAddContactOpen] = useState(false);

  // ✅ Always ensure current user is included and first
  const enrichedRecipients = useMemo(() => {
    if (!user?.email) {
      return externalRecipients;
    }

    const currentUserRecipient = {
      id: "recipient-current-user",
      name:
        `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email,
      email: user.email,
      role: "Signer",
      fieldsAssigned: [],
      isCurrentUser: true,
    };

    const hasCurrentUser = externalRecipients.some(
      (r) => r.email === user.email
    );

    if (hasCurrentUser) {
      // Ensure current user is first and properly marked
      const others = externalRecipients.filter((r) => r.email !== user.email);
      return [currentUserRecipient, ...others];
    } else {
      // Prepend current user
      return [currentUserRecipient, ...externalRecipients];
    }
  }, [user, externalRecipients]);

  // ✅ Sync missing current user to parent (one-time)
  useEffect(() => {
    if (user?.email) {
      const missingCurrentUser = !externalRecipients.some(
        (r) => r.email === user.email
      );
      if (missingCurrentUser) {
        const currentUser = enrichedRecipients[0];
        onAddRecipient(currentUser);
      }
    }
  }, [user?.email, externalRecipients.length]);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("contacts/");
      setContacts(response.data.results || response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchContacts();
    }
  }, [dialogOpen]);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company &&
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const availableContacts = filteredContacts.filter(
    (contact) =>
      !enrichedRecipients.some((recipient) => recipient.email === contact.email)
  );

  const handleAddContact = (contact) => {
    const newRecipient = {
      id: `recipient-${contact.id}`,
      name: contact.name,
      email: contact.email,
      role: "Signer",
      fieldsAssigned: [],
      contactId: contact.id,
    };
    onAddRecipient(newRecipient);
    setDialogOpen(false);
    setSearchTerm("");
  };

  const handleAddNewContact = async (newContactData) => {
    try {
      const response = await api.post("contacts/", newContactData);
      await fetchContacts();
      return true;
    } catch (err) {
      console.error("Error adding new contact:", err);
      if (err.response?.data) {
        const errors = err.response.data;
        setError(`Email error: ${errors.email?.[0] || "Please try again."}`);
      } else {
        setError("Failed to add contact. Please try again.");
      }
      return false;
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid #e5e7eb",
        bgcolor: "#f9fafb",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recipients
        </Typography>
        <IconButton
          size="small"
          onClick={() => setDialogOpen(true)}
          sx={{
            bgcolor: "#3b82f6",
            color: "white",
            "&:hover": { bgcolor: "#2563eb" },
          }}
        >
          <Add />
        </IconButton>
      </Box>

      <List sx={{ maxHeight: 200, overflowY: "auto" }}>
        {enrichedRecipients.map((recipient) => (
          <ListItem
            key={recipient.id}
            secondaryAction={
              !recipient.isCurrentUser && (
                <IconButton
                  edge="end"
                  onClick={() => onRemoveRecipient(recipient.id)}
                >
                  <Delete />
                </IconButton>
              )
            }
            sx={{
              bgcolor: recipient.isCurrentUser ? "#e3f2fd" : "white",
              mb: 1,
              borderRadius: 1,
              border: recipient.isCurrentUser ? "1px solid #2196f3" : "none",
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: recipient.isCurrentUser ? "#2196f3" : "#3b82f6",
                }}
              >
                {getInitials(recipient.name)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {recipient.name}
                  {recipient.isCurrentUser && (
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: "#2196f3",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      You
                    </Typography>
                  )}
                </Box>
              }
              secondary={recipient.email}
            />
          </ListItem>
        ))}
      </List>

      {/* Contact Selection Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Contact</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton
              onClick={() => setAddContactOpen(true)}
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                "&:hover": { bgcolor: "#2563eb" },
                width: 40,
                height: 40,
                alignSelf: "center",
              }}
              title="Add New Contact"
            >
              <Add />
            </IconButton>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ maxHeight: 300, overflowY: "auto" }}>
              {availableContacts.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  {searchTerm
                    ? "No contacts match your search."
                    : "No contacts available."}
                </Typography>
              ) : (
                availableContacts.map((contact) => (
                  <ListItem
                    key={contact.id}
                    button
                    onClick={() => handleAddContact(contact)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#3b82f6" }}>
                        {getInitials(contact.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                          >
                            {contact.email}
                          </Typography>
                          {contact.company && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
                              {contact.company}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <AddContact
        open={addContactOpen}
        onClose={() => {
          setAddContactOpen(false);
          setError("");
        }}
        onSave={handleAddNewContact}
        error={error}
      />
    </Box>
  );
};

export default RecipientManager;
