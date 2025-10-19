import {
    Box,
    Button,
    Card,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    alpha,
    useTheme
} from "@mui/material";
import {
    Edit,
    Info,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "../../api/axios";
import AddContact from "./AddContact";

// Styled components matching existing style
const StyledCard = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 0,
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.3)
            : alpha(theme.palette.background.paper, 0.4),
        backdropFilter: "blur(8px)",
        boxShadow: "none",
        transition: "all 0.3s ease",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

// Contact table row
const ContactTableRow = ({ contact, onEdit, onDelete, theme }) => {
  return (
    <TableRow
      hover
      sx={{
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
        },
        transition: "background-color 0.2s",
      }}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
       
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {contact.name}
            </Typography>
          
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">{contact.email}</Typography>
        </Box>
      </TableCell>

      <TableCell>
        {contact.phone && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2">{contact.phone}</Typography>
          </Box>
        )}
      </TableCell>

      <TableCell>
        {contact.company && (
          <Typography variant="body2">{contact.company}</Typography>
        )}
      </TableCell>

      <TableCell>
        <Typography variant="body2">
          {new Date(contact.created_at).toLocaleDateString()}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton size="small" onClick={() => onEdit(contact)}>
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(contact.id)}
            sx={{ ml: 1 }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

// Main ContactsTable component
const ContactList = () => {
  const theme = useTheme();
  const { api } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editContact, setEditContact] = useState(null);

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("contacts/");
        console.log(response);
        setContacts(response.data.results);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError("Failed to load contacts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [api]);

  // Filter and paginate contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          (contact.phone && contact.phone.includes(term))
      );
    }

    // Sort by name
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, searchTerm]);

  const paginatedContacts = useMemo(() => {
    return filteredContacts.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredContacts, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddContact = async (newContact) => {
    try {
      setLoading(true);
      
      // Check if email already exists for a new contact
      if (!editContact) {
        const emailExists = contacts.some(
          contact => contact.email.toLowerCase() === newContact.email.toLowerCase()
        );
        
        if (emailExists) {
          setError("A contact with this email already exists.");
          setLoading(false);
          return false; // Return false to indicate validation failed
        }
      } else if (
        // Check if email exists for edited contact (if email was changed)
        editContact.email.toLowerCase() !== newContact.email.toLowerCase() &&
        contacts.some(
          contact => 
            contact.id !== editContact.id && 
            contact.email.toLowerCase() === newContact.email.toLowerCase()
        )
      ) {
        setError("A contact with this email already exists.");
        setLoading(false);
        return false; // Return false to indicate validation failed
      }
      
      let response;

      if (editContact) {
        // Update existing contact
        try {
          response = await api.put(`contacts/${editContact.id}/`, newContact);
          setContacts(
            contacts.map((c) => (c.id === editContact.id ? response.data : c))
          );
          setOpenAddModal(false);
          setEditContact(null);
          return true; // Return true to indicate success
        } catch (err) {
          if (err.response && err.response.data) {
            // Handle validation errors from the server
            const serverErrors = err.response.data;
            if (serverErrors.email) {
              setError(`Email error: ${serverErrors.email[0]}`);
            } else {
              setError("Failed to update contact. Please check your input and try again.");
            }
          } else {
            setError("Failed to update contact. Please try again.");
          }
          return false; // Return false to indicate failure
        }
      } else {
        // Create new contact
        try {
          response = await api.post("contacts/", newContact);
          setContacts([...contacts, response.data]);
          setOpenAddModal(false);
          setEditContact(null);
          return true; // Return true to indicate success
        } catch (err) {
          if (err.response && err.response.data) {
            // Handle validation errors from the server
            const serverErrors = err.response.data;
            if (serverErrors.email) {
              setError(`Email error: ${serverErrors.email[0]}`);
            } else {
              setError("Failed to create contact. Please check your input and try again.");
            }
          } else {
            setError("Failed to create contact. Please try again.");
          }
          return false; // Return false to indicate failure
        }
      }
    } catch (err) {
      console.error("Error saving contact:", err);
      setError("An unexpected error occurred. Please try again.");
      return false; // Return false to indicate failure
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = (contact) => {
    setEditContact(contact);
    setOpenAddModal(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        setLoading(true);
        await api.delete(`contacts/${contactId}/`);
        setContacts(contacts.filter((c) => c.id !== contactId));
      } catch (err) {
        console.error("Error deleting contact:", err);
        setError("Failed to delete contact. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Show loading state
  if (loading && contacts.length === 0) {
    return (
      <Box
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header and Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Contacts
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: {
                width: { xs: "100%", sm: "300px" },
                borderRadius: 0,
                "& fieldset": {
                  borderColor: alpha(theme.palette.text.primary, 0.1),
                },
                "&:hover fieldset": {
                  borderColor: alpha(theme.palette.text.primary, 0.2),
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => {
              setEditContact(null);
              setOpenAddModal(true);
            }}
            sx={{
              textTransform: "none",
              borderRadius: 0,
            }}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* Error message removed from table view */}

      {/* Table */}
      <StyledCard>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "none",
            overflow: "hidden",
            height: "auto",
            minHeight: 400,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "25%" }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "20%" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "15%" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "15%" }}>
                  Company
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "15%" }}>
                  Added On
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, py: 2, width: "10%" }}
                  align="right"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContacts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, height: "100%", border: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Info
                        size={38}
                        style={{
                          color: theme.palette.text.secondary,
                          opacity: 0.5,
                          marginBottom: 12,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        No contacts found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "Add your first contact to get started"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContacts.map((contact) => (
                  <ContactTableRow
                    key={contact.emal}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    theme={theme}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredContacts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: "none",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: "0.875rem",
              },
          }}
        />
      </StyledCard>

      {/* Add/Edit Contact Modal */}
      <AddContact
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setEditContact(null);
          setError("");
        }}
        onSave={handleAddContact}
        contact={editContact}
        error={error}
      />
    </Box>
  );
};

export default ContactList;
