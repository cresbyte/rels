import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Briefcase,
    Building,
    Calendar,
    CloudUpload,
    Edit,
    Mail,
    Save,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../../api/axios";

function OrganizationSettings() {
  const [organization, setOrganization] = useState({
    id: null,
    name: "",
    description: "",
    logo: null,
    created_at: "",
    team_members: [],
  });

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [newLogo, setNewLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Team member management
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "support",
    password: "tempPassword123", // Default temporary password
  });

  useEffect(() => {
    fetchOrganizationData();
    fetchCurrentUser();
  }, []);

  const fetchOrganizationData = async () => {
    setLoading(true);
    setError("");
    try {
      // Get the current user's organization
      const orgResponse = await api.get("/users/me/");
      const organizationId = orgResponse.data.organization;

      // Get detailed organization data
      const detailedOrgResponse = await api.get(
        `/organizations/${organizationId}/`
      );

      // Get team members list
      const teamResponse = await api.get("/users/");

      const orgData = {
        ...detailedOrgResponse.data,
        team_members: teamResponse.data,
      };

      setOrganization(orgData);

      if (orgData.logo) {
        setLogoPreview(orgData.logo);
      }
    } catch (error) {
      console.error("Failed to fetch organization data", error);
      setError("Failed to load organization data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me/");
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Failed to fetch current user data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization({ ...organization, [name]: value });
  };

  const handleLogoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewLogo(file);
      setLogoPreview(URL.createObjectURL(file));

      // Immediately upload the logo without waiting for save button
      await uploadLogo(file);
    }
  };

  const uploadLogo = async (logoFile) => {
    if (!logoFile) return;

    setLogoUploadLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("logo", logoFile);

      await api.patch(`/organizations/${organization.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show temporary success message for logo upload
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to upload logo", error);
      setError("Failed to upload logo. Please try again.");
    } finally {
      setLogoUploadLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSaveLoading(true);
    setSuccess(false);
    setError("");

    try {
      const data = {
        name: organization.name,
        description: organization.description || "",
      };

      await api.patch(`/organizations/${organization.id}/`, data);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to update organization", error);
      setError("Failed to update organization. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Team member management functions
  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
    setNewMember({
      email: "",
      first_name: "",
      last_name: "",
      role: "support",
      password: "tempPassword123",
    });
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleInviteMember = async () => {
    try {
      const response = await api.post("/users/", newMember);

      // Update the team members list
      setOrganization({
        ...organization,
        team_members: [...organization.team_members, response.data],
      });

      handleCloseInviteDialog();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to invite team member", error);
      setError("Failed to invite team member. Please try again.");
    }
  };

  const handleOpenEditDialog = (member) => {
    setSelectedMember(member);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedMember(null);
  };

  const handleEditMemberChange = (e) => {
    const { name, value } = e.target;
    setSelectedMember({ ...selectedMember, [name]: value });
  };

  const handleUpdateMember = async () => {
    try {
      await api.patch(`/users/${selectedMember.id}/`, {
        first_name: selectedMember.first_name,
        last_name: selectedMember.last_name,
        role: selectedMember.role,
      });

      // Update the team members list
      setOrganization({
        ...organization,
        team_members: organization.team_members.map((member) =>
          member.id === selectedMember.id ? selectedMember : member
        ),
      });

      handleCloseEditDialog();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to update team member", error);
      setError("Failed to update team member. Please try again.");
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      await api.delete(`/users/${memberId}/`);

      // Update the team members list
      setOrganization({
        ...organization,
        team_members: organization.team_members.filter(
          (member) => member.id !== memberId
        ),
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to delete team member", error);
      setError("Failed to delete team member. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Check if current user is an owner/admin
  const isOwner = currentUser && currentUser.role === "owner";

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ mt: 8, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Organization Profile
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Organization updated successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Logo & Quick Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
              }}
            >
              <Box sx={{ position: "relative", mb: 3 }}>
                <Avatar
                  src={logoPreview}
                  alt={organization.name}
                  variant="rounded"
                  sx={{
                    width: 150,
                    height: 150,
                    boxShadow: 1,
                    fontSize: 64,
                    bgcolor: "primary.main",
                  }}
                >
                  {!logoPreview && organization.name && <Building size={64} />}
                </Avatar>
                {isOwner && (
                  <Tooltip title="Change Logo">
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                        "&:hover": {
                          bgcolor: "background.paper",
                        },
                      }}
                      disabled={logoUploadLoading}
                    >
                      {logoUploadLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <>
                          <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={handleLogoChange}
                          />
                          <Edit size={20} />
                        </>
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Typography
                variant="h5"
                fontWeight="medium"
                align="center"
                gutterBottom
              >
                {organization.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {`Since ${formatDate(organization.created_at)}`}
              </Typography>

              {isOwner && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={
                    logoUploadLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloudUpload />
                    )
                  }
                  fullWidth
                  disabled={logoUploadLoading}
                >
                  Upload New Logo
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleLogoChange}
                  />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Organization Stats Card */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Organization Stats
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Users size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  <strong>Team Size:</strong>{" "}
                  {organization.team_members?.length || 0} members
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Calendar size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  <strong>Established:</strong>{" "}
                  {formatDate(organization.created_at)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Briefcase size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  <strong>Projects:</strong>{" "}
                  {organization.team_members?.length * 2 || 0} active
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Organization Details */}
        <Grid size={{ xs: 12, sm: 8 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Organization Details
                </Typography>
                {isOwner && (
                  <Button
                    variant="contained"
                    startIcon={
                      saveLoading ? <CircularProgress size={20} /> : <Save />
                    }
                    onClick={handleSubmit}
                    disabled={saveLoading}
                  >
                    Save Changes
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="name"
                    label="Organization Name"
                    value={organization.name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    disabled={!isOwner}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="description"
                    label="Description"
                    value={organization.description || ""}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    disabled={!isOwner}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Team Members Section */}
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Team Members
                </Typography>
                {isOwner && (
                  <Button
                    variant="outlined"
                    startIcon={<UserPlus />}
                    onClick={handleOpenInviteDialog}
                  >
                    Invite Member
                  </Button>
                )}
              </Box>

              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {organization.team_members &&
                  organization.team_members.map((member, index) => (
                    <React.Fragment key={member.id || index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            src={member.profile_pic}
                            alt={`${member.first_name} ${member.last_name}`}
                          >
                            {member.first_name?.[0]}
                            {member.last_name?.[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {`${member.first_name} ${member.last_name}`}
                              {member.id === currentUser?.id && (
                                <Chip
                                  label="You"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mt: 0.5,
                                  }}
                                >
                                  <Mail size={14} style={{ marginRight: 4 }} />
                                  {member.email}
                                </Box>
                              </Typography>
                              <Chip
                                label={member.role}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 1, textTransform: "capitalize" }}
                              />
                            </Box>
                          }
                        />
                        {isOwner && member.id !== currentUser?.id && (
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={() => handleOpenEditDialog(member)}
                              sx={{ mr: 1 }}
                            >
                              <Edit size={18} />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteMember(member.id)}
                              color="error"
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                      {index < organization.team_members.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}

                {(!organization.team_members ||
                  organization.team_members.length === 0) && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 3 }}
                  >
                    No team members found.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Invite New Member Dialog */}
      <Dialog
        open={openInviteDialog}
        onClose={handleCloseInviteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add a new team member to your organization. They will receive an
            email with login instructions.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="first_name"
                label="First Name"
                value={newMember.first_name}
                onChange={handleNewMemberChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="last_name"
                label="Last Name"
                value={newMember.last_name}
                onChange={handleNewMemberChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={newMember.email}
                onChange={handleNewMemberChange}
                fullWidth
                required
                margin="dense"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                name="role"
                label="Role"
                value={newMember.role}
                onChange={handleNewMemberChange}
                fullWidth
                margin="dense"
              >
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="accounts">Accounts</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Cancel</Button>
          <Button
            onClick={handleInviteMember}
            variant="contained"
            disabled={
              !newMember.email || !newMember.first_name || !newMember.last_name
            }
          >
            Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Team Member</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="first_name"
                  label="First Name"
                  value={selectedMember.first_name}
                  onChange={handleEditMemberChange}
                  fullWidth
                  required
                  margin="dense"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="last_name"
                  label="Last Name"
                  value={selectedMember.last_name}
                  onChange={handleEditMemberChange}
                  fullWidth
                  required
                  margin="dense"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="email"
                  label="Email Address"
                  value={selectedMember.email}
                  disabled // Email cannot be changed
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  name="role"
                  label="Role"
                  value={selectedMember.role}
                  onChange={handleEditMemberChange}
                  fullWidth
                  margin="dense"
                >
                  <MenuItem value="support">Support</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="accounts">Accounts</MenuItem>
                  {isOwner && <MenuItem value="owner">Owner</MenuItem>}
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateMember} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OrganizationSettings;
