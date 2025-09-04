import React from "react";
import { Controller } from "react-hook-form";

import { Grid, TextField } from "@mui/material";

interface EMIProps {
  control: any;
  errors: any;
}

const EMI: React.FC<EMIProps> = ({ control, errors }) => {
    const j =""
  return (
    <Grid container spacing={2}>
      {/* EMI Number */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="emiNo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="EMI No"
              type="number"
              fullWidth
              error={!!errors.emiNo}
              helperText={errors.emiNo?.message}
            />
          )}
        />
      </Grid>

      {/* Date */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.message}
            />
          )}
        />
      </Grid>

      {/* EMI Amount */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="emiAmt"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="EMI Amount"
              type="number"
              fullWidth
              error={!!errors.emiAmt}
              helperText={errors.emiAmt?.message}
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
          name="paidAmt"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Paid Amount"
              type="number"
              fullWidth
              error={!!errors.paidAmt}
              helperText={errors.paidAmt?.message}
            />
          )}
        />
      </Grid>

      {/* JPD */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="jpd"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="JPD"
              fullWidth
              error={!!errors.jpd}
              helperText={errors.jpd?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default EMI;
