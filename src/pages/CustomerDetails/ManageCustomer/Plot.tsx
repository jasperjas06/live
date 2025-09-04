import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

import { Grid, TextField, Button, Box } from "@mui/material";

interface PlotProps {
  control: Control<any>;
  errors: FieldErrors<any>;
//   handleCalculateTotal: () => void;
}

const Plot: React.FC<PlotProps> = ({ control, errors }) => {
    const l = "Plot Component Rendered";
  return (
    <div>
      <Grid container spacing={2}>
        {/* Guide Rate / Sq. Ft */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="guideRateSqFt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Guide Rate / Sq. Ft"
                fullWidth
                error={!!errors?.guideRateSqFt}
                // sage}
                inputProps={{ min: 0, step: "any" }}
              />
            )}
          />
        </Grid>

        {/* Guide Land Value */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="guideLandValue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Guide Land Value"
                fullWidth
                error={!!errors?.guideLandValue}
                // ssage}
                inputProps={{ min: 0, step: "any" }}
              />
            )}
          />
        </Grid>

        {/* Land Value */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="landValue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Land Value"
                fullWidth
                error={!!errors?.landValue}
                // }
                inputProps={{ min: 0, step: "any" }}
              />
            )}
          />
        </Grid>

        {/* Reg Value */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="regValue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Reg Value"
                fullWidth
                error={!!errors?.regValue}
                // 
                inputProps={{ min: 0, step: "any" }}
              />
            )}
          />
        </Grid>

        {/* Additional Charges */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="additionalCharges"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Add. Chg."
                fullWidth
                error={!!errors?.additionalCharges}
                // .message}
                inputProps={{ min: 0, step: "any" }}
              />
            )}
          />
        </Grid>

        {/* Total Value */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="totalValue"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Total Value"
                fullWidth
                error={!!errors?.totalValue}
                // e}
                inputProps={{ min: 0, step: "any" }}
              />
            )}
          />
        </Grid>

       
      </Grid>
    </div>
  );
};

export default Plot;
