import React, { useState } from "react";

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
} from "@mui/material";


const ProfileForm = () => {
  const [userData, setUserData] = useState({
    name: "User name",
    email: "mi@xpaytech.co",
    phone: "+20-01274318900",
    address: "285 N Broad St, Elizabeth, NJ 07208, USA",
    profilePic: "https://source.unsplash.com/random/200x200/?portrait",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUserData({
        ...userData,
        profilePic: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Section: Profile & Uploads */}
          <Grid size={{ xs: 12 , sm:4}}>
            <Box sx={{ textAlign: "center" }}>
              {/* Profile Picture */}
              <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                <Avatar
                  src={userData.profilePic}
                  sx={{ width: 120, height: 120, mb: 1 }}
                />
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
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                </label>
              </Box>

              {/* Upload boxes */}
              <Grid container spacing={2} justifyContent="center">
                <Grid >
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: "grey.400",
                      borderRadius: 2,
                      width: 80,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    LOGO
                  </Box>
                </Grid>
                <Grid >
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: "grey.400",
                      borderRadius: 2,
                      width: 140,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "text.secondary",
                      textAlign: "center",
                      px: 1,
                    }}
                  >
                    VENDOR DOCUMENTS
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Section: Form Fields */}
          <Grid size={{ xs: 12, sm:8 }} >
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
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address"
                  value={userData.address}
                  onChange={handleChange("address")}
                  multiline
                  minRows={2}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
          <Button variant="contained" sx={{ borderRadius: 2 }}>
            Save
          </Button>
          <Button variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileForm;
