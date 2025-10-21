import React, { useEffect, useState } from "react";
import { CameraAlt } from "@mui/icons-material";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { getUserProfile, updateUserProfile, reSetPassword } from "src/utils/api.auth";
import { fileUpload } from "src/utils/api.service";
import toast from "react-hot-toast";

const ProfileForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "https://source.unsplash.com/random/200x200/?portrait",
  });

  const [uploading, setUploading] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [resetLoading, setResetLoading] = useState(false);

  // Handle input field changes
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handlePasswordChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [field]: e.target.value });
  };

  // Fetch user profile data
  const getUserData = async () => {
    try {
      const response = await getUserProfile();
      if (response?.data) {
        const user = response.data.data;
        setUserData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          imageUrl: user.imageUrl || "https://source.unsplash.com/random/200x200/?portrait",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Handle profile image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fileUpload(formData);
      if (response?.data) {
        setUserData((prev) => ({
          ...prev,
          imageUrl: response.data.data[0],
        }));
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  // Handle profile save
  const handleSave = async () => {
    try {
      const user = await updateUserProfile(userData);
      if (user?.data) {
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.");
    }
  };

  // Handle reset password submission
  const handlePasswordSubmit = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    setResetLoading(true);
    try {
      const response = await reSetPassword(passwordData);
      if (response?.data) {
        toast.success("Password updated successfully.");
        setOpenResetDialog(false);
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        toast.error("Password reset failed.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Section: Profile & Upload */}
          <Grid size={{ xs: 12, sm:4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                <Avatar src={userData.imageUrl} sx={{ width: 120, height: 120, mb: 1 }} />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-picture-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile-picture-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      <CameraAlt fontSize="small" />
                    )}
                  </IconButton>
                </label>
              </Box>
              <Typography variant="h6">{userData.name || "User Name"}</Typography>
            </Box>
          </Grid>

          {/* Right Section: Form Fields */}
          <Grid   size={{xs:12, sm:8}}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={userData.name}
                  onChange={handleChange("name")}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userData.email}
                  onChange={handleChange("email")}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={userData.phone}
                  onChange={handleChange("phone")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2 }}
            onClick={() => setOpenResetDialog(true)}
          >
            Reset Password
          </Button>
          <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2 }}
            onClick={() => getUserData()}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      {/* Reset Password Dialog */}
      <Dialog open={openResetDialog} onClose={() => setOpenResetDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            margin="dense"
            label="Old Password"
            type="password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange("oldPassword")}
          />
          <TextField
            fullWidth
            margin="dense"
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange("newPassword")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePasswordSubmit}
            disabled={resetLoading}
          >
            {resetLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfileForm;
