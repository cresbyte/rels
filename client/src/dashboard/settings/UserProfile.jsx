import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit, Save, CloudUpload, KeyRound, ArrowLeft } from "lucide-react";
import { useApi } from "../../api/axios";

function UserProfile() {
  const { api } = useApi();
  const [user, setUser] = useState({
    id: null,
    email: "",
    first_name: "",
    last_name: "",
    profile_picture: null,
    profile_picture_url: null,
  });

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [profilePicLoading, setProfilePicLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showPasswordSection, setShowPasswordSection] = useState(true);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get("accounts/me/");
      console.log(response.data);
      setUser(response.data);

      // Handle profile picture URL correctly
      if (response.data.profile_picture_url) {
        setProfilePicPreview(response.data.profile_picture_url);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));

      // Auto-upload the profile picture immediately
      await uploadProfilePic(file);
    }
  };

  const uploadProfilePic = async (profilePicFile) => {
    if (!profilePicFile) return;

    setProfilePicLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("profile_picture", profilePicFile);

      const response = await api.patch("accounts/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update user state with new data
      if (response.data.profile_picture_url) {
        setUser({ ...user, profile_picture_url: response.data.profile_picture_url });
        setProfilePicPreview(response.data.profile_picture_url);
      }

      // Show temporary success message
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to upload profile picture", error);
      setError("Failed to upload profile picture. Please try again.");
    } finally {
      setProfilePicLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async () => {
    setSaveLoading(true);
    setSuccess(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name);

      // We don't need to handle profile pic here anymore since it's auto-uploaded

      await api.patch("accounts/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await api.post("accounts/change-password/", {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });

      setPasswordSuccess(true);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        setShowPasswordSection(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to change password", error);
      setPasswordError(
        error.response?.data?.detail ||
          "Failed to change password. Please try again."
      );
    }
  };

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
          My Profile
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column - Profile Photo & Quick Actions */}
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
                {console.log("Profile Pic Preview:", profilePicPreview)}
                <Avatar
                  src={profilePicPreview}
                  alt={`${user.first_name} ${user.last_name}`}
                  sx={{
                    width: 150,
                    height: 150,
                    boxShadow: 1,
                    fontSize: 64,
                    bgcolor: "primary.main",
                  }}
                >
                  {!profilePicPreview &&
                    user.first_name &&
                    user.last_name &&
                    `${user.first_name[0]}${user.last_name[0]}`}
                </Avatar>
                <Tooltip title="Change Photo">
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
                    disabled={profilePicLoading}
                  >
                    {profilePicLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <>
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleProfilePicChange}
                        />
                        <Edit size={20} />
                      </>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography
                variant="h5"
                fontWeight="medium"
                align="center"
                gutterBottom
              >
                {`${user.first_name} ${user.last_name}`}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {user.email}
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={
                  profilePicLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloudUpload />
                  )
                }
                fullWidth
                sx={{ mb: 2 }}
                disabled={profilePicLoading}
              >
                Upload New Photo
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleProfilePicChange}
                />
              </Button>

              <Button
                variant="outlined"
                startIcon={<KeyRound />}
                fullWidth
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                {showPasswordSection ? "Hide Password Form" : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Account Information
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Email:</strong> {user.email}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Member since:</strong> {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Profile Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ mb: showPasswordSection ? 3 : 0 }}>
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
                  Personal Information
                </Typography>
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
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="first_name"
                    label="First Name"
                    value={user.first_name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="last_name"
                    label="Last Name"
                    value={user.last_name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="email"
                    label="Email Address"
                    value={user.email}
                    fullWidth
                    variant="outlined"
                    disabled
                    helperText="Email address cannot be changed"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Password Change Section */}
          {showPasswordSection && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Change Password
                </Typography>

                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}

                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Password changed successfully!
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="current_password"
                      label="Current Password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="new_password"
                      label="New Password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      name="confirm_password"
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        onClick={handlePasswordSubmit}
                        sx={{ mt: 1 }}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserProfile;
