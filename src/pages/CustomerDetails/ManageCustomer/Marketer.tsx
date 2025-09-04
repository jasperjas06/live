import React from "react";
import { Controller } from "react-hook-form";

import { Grid, TextField } from "@mui/material";

interface MarketerProps {
  control: any;
  errors: any;
}

const Marketer: React.FC<MarketerProps> = ({ control, errors }) => {
    const m = "Marketer Component Rendered";
  return (
    <Grid container spacing={2}>
      {/* EMI (Installment Number) */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="emiNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="EMI (Installment Number)"
              type="number"
              fullWidth
              error={!!errors.emiNumber}
              helperText={errors.emiNumber?.message}
            />
          )}
        />
      </Grid>

      {/* Paid Date */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="paidDate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Paid Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.paidDate}
              helperText={errors.paidDate?.message}
            />
          )}
        />
      </Grid>

      {/* Paid Amount */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="paidAmount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Paid Amount"
              type="number"
              fullWidth
              error={!!errors.paidAmount}
              helperText={errors.paidAmount?.message}
            />
          )}
        />
      </Grid>

      {/* Marketer Name */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="marketerName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Marketer (Who brought the customer)"
              fullWidth
              error={!!errors.marketerName}
              helperText={errors.marketerName?.message}
            />
          )}
        />
      </Grid>

      {/* Commission Percentage */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="commissionPercentage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Commission %"
              type="number"
              fullWidth
              error={!!errors.commissionPercentage}
              helperText={errors.commissionPercentage?.message}
            />
          )}
        />
      </Grid>

      {/* Commission Amount */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="commissionAmount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Commission Amount"
              type="number"
              fullWidth
              error={!!errors.commissionAmount}
              helperText={errors.commissionAmount?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Marketer;
