import axios from "axios";
import * as yup from "yup";
import React, { useState } from "react";
import { useForm, Controller, FieldErrors, Control } from "react-hook-form";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  LinearProgress,
} from "@mui/material";

import { fileUpload } from "src/utils/api.service";

interface PlotProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  marketer?: { label: string; value: string }[];
}

const General: React.FC<PlotProps> = ({ control, errors, marketer }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [uploadError, setUploadError] = useState<{ [key: string]: string }>({});

  // helper to handle uploads
  const handleFileUpload = async (field: any, file: File, name: string) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [name]: true }));
    setUploadError((prev) => ({ ...prev, [name]: "" }));
    try {
      // prepare FormData
      const formData = new FormData();
      formData.append("files", file);

      // send to BE (assuming fileUpload accepts FormData)
      const res = await fileUpload(formData);

      // push backend response (e.g. file URL or id) into RHF state
      field.onChange(res);

      // show file name in UI
      setFileNames((prev) => ({ ...prev, [name]: file.name }));
    } catch (err: any) {
      setUploadError((prev) => ({
        ...prev,
        [name]: "Upload failed. Try again.",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [name]: false }));
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* Marketer Dropdown */}
        <Grid size={{ xs: 12, sm: 6 }}>
  <Controller
    name="marketer"
    control={control}
    render={({ field }) => (
      <FormControl fullWidth error={!!errors.marketer}>
        <InputLabel>Marketer Name</InputLabel>
        <Select {...field} label="Marketer Name">
          {marketer.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
</Grid>

        {/* Sale Deed Doc */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="saleDeed"
            control={control}
            render={({ field }) => (
              <>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={uploading.saleDeed}
                >
                  {uploading.saleDeed
                    ? "Uploading..."
                    : fileNames.saleDeed || "Upload Sale Deed Doc (PDF)"}
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(field, e.target.files[0], "saleDeed")
                    }
                  />
                </Button>
                {uploading.saleDeed && <LinearProgress />}
                {uploadError.saleDeed && (
                  <Typography color="error" variant="caption">
                    {uploadError.saleDeed}
                  </Typography>
                )}
              </>
            )}
          />
        </Grid>

        {/* Payment Terms */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="paymentTerms"
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
            name="emiAmount"
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
            name="installments"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="No. of Installments"
                fullWidth
                error={!!errors.installments}
              />
            )}
          />
        </Grid>

        {/* Mother Doc */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="motherDoc"
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
            name="status"
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

        {/* Loan */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="loan"
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
            name="offered"
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

        {/* Edit / Delete Reason */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="reason"
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
      </Grid>
    </div>
  );
};

export default General;
