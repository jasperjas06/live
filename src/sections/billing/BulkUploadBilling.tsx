import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import { bulkEditBillingData } from "src/utils/api.service";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";

export default function BulkUploadBilling() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle Drag & Drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };

  // Handle Normal File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Check if it's an excel/csv file
    const validExtensions = [".xls", ".xlsx", ".csv"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    // Looser mime-type checks for windows since sometimes excel mimes are weird, checking extension is safer
    if (!validExtensions.includes(fileExtension)) {
      toast.error(
        "Please upload a valid Excel or CSV file (.xls, .xlsx, .csv)",
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setOpenDialog(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await bulkEditBillingData(formData);

      if (response.status === 200) {
        toast.success(response.message || "File uploaded successfully!");
        setFile(null); // Clear file on success
        if (fileInputRef.current) fileInputRef.current.value = "";
        // navigate('/billing') // Optionally navigate back
      } else {
        toast.error(response.message || "Failed to upload file");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <IconButton sx={{ mr: 2 }} onClick={() => navigate(-1)}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
        <Typography variant="h4">Bulk Edit Billing</Typography>
      </Box>

      <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ mb: 1, color: "primary.main", fontWeight: "bold" }}
          >
            Upload Excel File
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            Upload your Excel file to edit data.
          </Typography>

          {!file ? (
            <Box
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : "divider",
                borderRadius: 2,
                p: { xs: 4, md: 8 },
                bgcolor: isDragActive ? "action.hover" : "background.paper",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
              }}
              onClick={handleBrowseClick}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Icon
                  icon="vscode-icons:file-type-excel"
                  width={64}
                  height={64}
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Drag &amp; Drop your file here or
              </Typography>

              <Button variant="contained" color="primary">
                Browse File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />
            </Box>
          ) : (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "background.neutral",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Icon
                  icon="vscode-icons:file-type-excel"
                  width={40}
                  height={40}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  noWrap
                  sx={{ maxWidth: 300 }}
                >
                  {file.name}
                </Typography>
              </Box>
              <IconButton onClick={handleRemoveFile} color="error" size="small">
                <Iconify icon="mingcute:close-line" />
              </IconButton>
            </Box>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 5 }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleUploadClick}
              disabled={!file || isUploading}
              startIcon={
                isUploading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{ minWidth: 120 }}
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                handleRemoveFile(); // if they cancel overall operation
                navigate(-1);
              }}
              disabled={isUploading}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Upload</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By uploading this, all the billing data&apos;s date will be changed
            for the items that are present in the Excel file. Are you sure you
            want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpload}
            variant="contained"
            color="primary"
            autoFocus
          >
            Confirm &amp; Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
