import React, { useState } from "react";
import { Controller, useFormContext, get } from "react-hook-form";
import {
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  LinearProgress,
  Box
} from "@mui/material";

import { fileUpload } from "src/utils/api.service";

interface GeneralProps {
  marketer?: { label: string; value: string }[];
  saleType: string;
  setSaleType: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void | Promise<void>;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const General: React.FC<GeneralProps> = ({ marketer, saleType, setSaleType, handleNext, setTabIndex }) => {
  const { control, formState: { errors } } = useFormContext(); // ✅ get control & errors here
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [uploadError, setUploadError] = useState<{ [key: string]: string }>({});

  const handleFileUpload = async (field: any, file: File, name: string) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [name]: true }));
    setUploadError(prev => ({ ...prev, [name]: "" }));
    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await fileUpload(formData);
      field.onChange(res.data.data[0]);
      setFileNames(prev => ({ ...prev, [name]: file.name }));
    } catch (err: any) {
      setUploadError(prev => ({ ...prev, [name]: "Upload failed. Try again." }));
    } finally {
      setUploading(prev => ({ ...prev, [name]: false }));
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Marketer */}
        <Grid size={{ xs: 12, sm: 6 }} >
          <Controller
            name="general.marketer"
            control={control}
            rules={{ required: "Marketer is required" }}
            render={({ field }) => (
              <FormControl fullWidth error={!!get(errors, "general.marketer")}>
                <InputLabel>Marketer</InputLabel>
                <Select {...field} label="Marketer">
                  {marketer?.map(m => (
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
        </Grid>

        {/* Sale Deed Doc */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.saleDeedDoc"
            control={control}
            render={({ field }) => (
              <>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={uploading.saleDeedDoc}
                >
                  {uploading.saleDeedDoc
                    ? "Uploading..."
                    : fileNames.saleDeedDoc || "Upload Sale Deed Doc (PDF)"}
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
                error={!!errors.paymentTerms}
              />
            )}
          />
        </Grid>

        {/* EMI Amount */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.emiAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="EMI Amount"
                fullWidth
                error={!!errors.emiAmount}
              />
            )}
          />
        </Grid>

        {/* No. of Installments */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="general.noOfInstallments"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="No. of Installments"
                fullWidth
                error={!!errors.noOfInstallments}
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
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={uploading.motherDoc}
                >
                  {uploading.motherDoc
                    ? "Uploading..."
                    : fileNames.motherDoc || "Upload Mother Doc (PDF)"}
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
              <FormControl fullWidth error={!!errors.status}>
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
              <FormControl fullWidth error={!!errors.loan}>
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
              <FormControl fullWidth error={!!errors.offered}>
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
              <FormControl fullWidth error={!!get(errors, "general.saleType")}>
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
                error={!!errors.reason}
              />
            )}
          />
        </Grid>

        {/* Next Button */}
        <Grid size={{ xs: 12 }} >
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
