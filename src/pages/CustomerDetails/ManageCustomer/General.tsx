import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";

import { fileUpload } from "src/utils/api.service";

interface GeneralProps {
  marketer?: { label: string; value: string; percentage: string | number }[];
  saleType: string;
  setSaleType: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void | Promise<void>;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const General: React.FC<GeneralProps> = ({
  marketer,
  saleType,
  setSaleType,
  handleNext,
  setTabIndex,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext(); // ✅ get control & errors here
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [uploadError, setUploadError] = useState<{ [key: string]: string }>({});
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({});

  // COMMENTED OUT - Auto-fill percentage logic - Can be restored in future
  // useEffect(() => {
  //   const currentMarketerValue = control._formValues?.general?.marketer;
  //
  //   if (currentMarketerValue && marketer) {
  //     const selectedMarketer = marketer.find(
  //       (m) => m.value === currentMarketerValue
  //     );
  //
  //     if (selectedMarketer?.percentage) {
  //       const percentageValue = Number(
  //         (selectedMarketer.percentage as string).replace("%", "")
  //       );
  //       setValue("general.percentage", percentageValue, {
  //         shouldValidate: false,
  //         shouldDirty: false,
  //       });
  //     }
  //   }
  // }, [marketer]); // Run when marketer data is available

  const handleFileUpload = async (field: any, file: File, name: string) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [name]: true }));
    setUploadError((prev) => ({ ...prev, [name]: "" }));
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fileUpload(formData);
      const uploadedUrl = res.data.data[0];
      field.onChange(uploadedUrl);
      setFileNames((prev) => ({ ...prev, [name]: file.name }));
      setUploadedUrls((prev) => ({ ...prev, [name]: uploadedUrl }));
    } catch (err: any) {
      setUploadError((prev) => ({
        ...prev,
        [name]: "Upload failed. Try again.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleRemoveFile = (field: any, name: string) => {
    field.onChange("");
    setFileNames((prev) => ({ ...prev, [name]: "" }));
    setUploadedUrls((prev) => ({ ...prev, [name]: "" }));
    setUploadError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleViewFile = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* COMMENTED OUT - Marketer field - Can be restored in future */}
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.marketer"
            control={control}
            rules={{ required: "Marketer is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!get(errors, "general.marketer")}>
                <InputLabel>Marketer</InputLabel>
                <Select
                  {...field}
                  label="Marketer"
                  onChange={(e) => {
                    field.onChange(e); // Update marketer field

                    // ✅ ADD THIS - Auto-fill percentage when marketer changes
                    const selectedMarketer = (marketer ?? []).find(
                      (m) => m.value === e.target.value
                    );

                    if (selectedMarketer?.percentage) {
                      const percentageValue = Number(
                        (selectedMarketer.percentage as string).replace("%", "")
                      );
                      console.log("Setting percentage to:", percentageValue); // Should now show: 12
                      setValue("general.percentage", percentageValue, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                >
                  {marketer?.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
                {get(errors, "general.marketer") && (
                  <Typography color="error" variant="caption">
                    {get(errors, "general.marketer")?.message as string}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid> */}
        {/* Sale Deed Doc */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.saleDeedDoc"
            control={control}
            render={({ field }) => (
              <>
                {!fileNames.saleDeedDoc ? (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={uploading.saleDeedDoc}
                  >
                    {uploading.saleDeedDoc
                      ? "Uploading..."
                      : "Upload Sale Deed Doc (PDF)"}
                    <input
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={(e) =>
                        e.target.files &&
                        handleFileUpload(field, e.target.files[0], "saleDeedDoc")
                      }
                    />
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fileNames.saleDeedDoc}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewFile(uploadedUrls.saleDeedDoc || field.value)}
                      title="View Document"
                    >
                      <Icon icon="mdi:eye" width={20} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(field, "saleDeedDoc")}
                      title="Remove Document"
                    >
                      <Icon icon="mdi:close" width={20} />
                    </IconButton>
                  </Stack>
                )}
                {uploading.saleDeedDoc && <LinearProgress />}
                {uploadError.saleDeedDoc && (
                  <Typography color="error" variant="caption">
                    {uploadError.saleDeedDoc}
                  </Typography>
                )}
              </>
            )}
          />
        </Grid>
        {/* COMMENTED OUT - Percentage field - Can be restored in future */}
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          {" "}
          <Controller
            name="general.percentage"
            control={control}
            defaultValue="" // ✅ Add this to prevent undefined
            rules={{
              required: "Percentage is required",
              min: { value: 0, message: "Percentage must be at least 0" },
              max: { value: 100, message: "Percentage cannot exceed 100" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Percentage"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
                error={!!get(errors, "general.percentage")}
                helperText={
                  get(errors, "general.percentage")?.message as string
                }
              />
            )}
          />
        </Grid>{" "} */}
        {/* Payment Terms */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.paymentTerms"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Payment Terms"
                fullWidth
                error={!!get(errors, 'general.paymentTerms')}
                helperText={get(errors, 'general.paymentTerms')?.message as string}
              />
            )}
          />
        </Grid>
        {/* EMI Amount */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.emiAmount"
            control={control}
            rules={{ required: "EMI Amount is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="EMI Amount"
                fullWidth
                required
                error={!!get(errors, 'general.emiAmount')}
                helperText={get(errors, 'general.emiAmount')?.message as string}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        {/* No. of Installments */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.noOfInstallments"
            control={control}
            rules={{ required: "No. of Installments is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="No. of Installments"
                fullWidth
                required
                error={!!get(errors, 'general.noOfInstallments')}
                helperText={get(errors, 'general.noOfInstallments')?.message as string}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.motherDoc"
            control={control}
            render={({ field }) => (
              <>
                {!fileNames.motherDoc ? (
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={uploading.motherDoc}
                  >
                    {uploading.motherDoc
                      ? "Uploading..."
                      : "Upload Mother Doc (PDF)"}
                    <input
                      type="file"
                      accept="application/pdf"
                      hidden
                      onChange={(e) =>
                        e.target.files &&
                        handleFileUpload(field, e.target.files[0], "motherDoc")
                      }
                    />
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fileNames.motherDoc}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewFile(uploadedUrls.motherDoc || field.value)}
                      title="View Document"
                    >
                      <Icon icon="mdi:eye" width={20} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(field, "motherDoc")}
                      title="Remove Document"
                    >
                      <Icon icon="mdi:close" width={20} />
                    </IconButton>
                  </Stack>
                )}
                {uploading.motherDoc && <LinearProgress />}
                {uploadError.motherDoc && (
                  <Typography color="error" variant="caption">
                    {uploadError.motherDoc}
                  </Typography>
                )}
              </>
            )}
          />
        </Grid>
        {/* Status */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!get(errors, 'general.status')}>
                <InputLabel>Status</InputLabel>
                <Select {...field} label="Status">
                  <MenuItem value="Enquired">Enquired</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                  <MenuItem value="Vacant">Vacant</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.loan"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!get(errors, 'general.loan')}>
                <InputLabel>Loan</InputLabel>
                <Select {...field} label="Loan">
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        {/* Offered */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.offered"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!get(errors, 'general.offered')}>
                <InputLabel>Offered</InputLabel>
                <Select {...field} label="Offered">
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        {/* Sale Type */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.saleType"
            control={control}
            rules={{ required: "Sale Type is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!get(errors, "general.saleType")} required>
                <InputLabel>Sale Type</InputLabel>
                <Select
                  {...field}
                  label="Sale Type"
                  onChange={(e) => {
                    field.onChange(e);
                    setSaleType(e.target.value);
                  }}
                >
                  <MenuItem value="Plot">Plot</MenuItem>
                  <MenuItem value="Flat">Flat</MenuItem>
                  <MenuItem value="Villa">Villa</MenuItem>
                </Select>
                {get(errors, "general.saleType") && (
                  <Typography color="error" variant="caption">
                    {get(errors, "general.saleType")?.message as string}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Grid>
        {/* Edit / Delete Reason */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.reason"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Edit / Delete Reason"
                fullWidth
                error={!!get(errors, 'general.reason')}
                helperText={get(errors, 'general.reason')?.message as string}
              />
            )}
          />
        </Grid>
        {/* Next Button */}
        <Grid size={{ xs: 12 }}>
          <Box mt={2}>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default General;
