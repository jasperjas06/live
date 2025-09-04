import axios from "axios";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller, FieldErrors, Control } from "react-hook-form";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";

interface PlotProps {
  control: Control<any>;
  errors: FieldErrors<any>;
//   handleCalculateTotal: () => void;
}

const General: React.FC<PlotProps> = ({control,errors}) => {
  const i=""
  return (
<div>
      <Grid container spacing={2}>
        {/* Marketer Dropdown */}
        <Grid size={{ xs: 12, sm: 6, }}>
          <Controller
            name="marketer"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.marketer}>
                <InputLabel>Marketer Name</InputLabel>
                <Select {...field} label="Marketer Name">
                  {/* {marketers?.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Sale Deed Doc */}
        <Grid size={{ xs: 12, sm: 6, }}>
          <Controller
            name="saleDeed"
            control={control}
            render={({ field }) => (
              <>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Sale Deed Doc (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </Button>
              </>
            )}
          />
        </Grid>

        {/* Payment Terms */}
        <Grid size={{ xs: 12, sm: 6, }}>
          <Controller
            name="paymentTerms"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Payment Terms"
                fullWidth
                error={!!errors.paymentTerms}
                // helperText={errors.paymentTerms?.message}
              />
            )}
          />
        </Grid>

        {/* EMI Amount */}
        <Grid size={{ xs: 12, sm: 6, }}>
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
                // helperText={errors.emiAmount?.message}
              />
            )}
          />
        </Grid>

        {/* No. of Installments */}
        <Grid size={{ xs: 12, sm: 6, }}>
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
                // helperText={errors.installments?.message}
              />
            )}
          />
        </Grid>

        {/* Mother Doc */}
        <Grid size={{ xs: 12, sm: 6, }}>
          <Controller
            name="motherDoc"
            control={control}
            render={({ field }) => (
              <>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Mother Doc (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </Button>
                {/* {errors.motherDoc && (
                  <Typography color="error" variant="caption">
                    {errors.motherDoc.message}
                  </Typography>
                )} */}
              </>
            )}
          />
        </Grid>

        {/* Status */}
        <Grid size={{ xs: 12, sm: 6, }}>
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
                {/* <FormHelperText>{errors.status?.message}</FormHelperText> */}
              </FormControl>
            )}
          />
        </Grid>

        {/* Loan */}
        <Grid size={{ xs: 12, sm: 6, }}>
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
                {/* <FormHelperText>{errors.loan?.message}</FormHelperText> */}
              </FormControl>
            )}
          />
        </Grid>

        {/* Offered */}
        <Grid size={{ xs: 12, sm: 6, }}>
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
                {/* <FormHelperText>{errors.offered?.message}</FormHelperText> */}
              </FormControl>
            )}
          />
        </Grid>

        {/* Edit / Delete Reason */}
        <Grid size={{ xs: 12, sm: 6, }}>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Edit / Delete Reason"
                fullWidth
                error={!!errors.reason}
                // helperText={errors.reason?.message}
              />
            )}
          />
        </Grid>

        
      </Grid>
    </div>
  );
};

export default General;
