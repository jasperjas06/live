import React from "react";
import { Controller } from "react-hook-form";

import { Grid, TextField } from "@mui/material";

interface FlatProps {
  control: any;
  errors: any;
}

const Flat: React.FC<FlatProps> = ({ control, errors }) => {
    const g = ""
  return (
    <Grid container spacing={2}>
      {/* Block */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="block"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Block"
              fullWidth
              error={!!errors.block}
              helperText={errors.block?.message}
            />
          )}
        />
      </Grid>

      {/* Floor */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="floor"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Floor"
              fullWidth
              error={!!errors.floor}
              helperText={errors.floor?.message}
            />
          )}
        />
      </Grid>

      {/* Bed Room */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="bedRoom"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Bed Room"
              type="number"
              fullWidth
              error={!!errors.bedRoom}
              helperText={errors.bedRoom?.message}
            />
          )}
        />
      </Grid>

      {/* UDS Sqft */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="udsSqft"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="UDS Sqft"
              type="number"
              fullWidth
              error={!!errors.udsSqft}
              helperText={errors.udsSqft?.message}
            />
          )}
        />
      </Grid>

      {/* Guide Rate/Sq. Ft */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="guideRate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Guide Rate/Sq. Ft"
              type="number"
              fullWidth
              error={!!errors.guideRate}
              helperText={errors.guideRate?.message}
            />
          )}
        />
      </Grid>

      {/* Property Tax */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="propertyTax"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Property Tax"
              type="number"
              fullWidth
              error={!!errors.propertyTax}
              helperText={errors.propertyTax?.message}
            />
          )}
        />
      </Grid>

      {/* Car Park */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="carPark"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Car Park"
              type="number"
              fullWidth
              error={!!errors.carPark}
              helperText={errors.carPark?.message}
            />
          )}
        />
      </Grid>

      {/* On Booking % */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="onBooking"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="On Booking %"
              type="number"
              fullWidth
              error={!!errors.onBooking}
              helperText={errors.onBooking?.message}
            />
          )}
        />
      </Grid>

      {/* Lintel % */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="lintel"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Lintel %"
              type="number"
              fullWidth
              error={!!errors.lintel}
              helperText={errors.lintel?.message}
            />
          )}
        />
      </Grid>

      {/* Roof % */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="roof"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Roof %"
              type="number"
              fullWidth
              error={!!errors.roof}
              helperText={errors.roof?.message}
            />
          )}
        />
      </Grid>

      {/* In/Out Plastering % */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="plastering"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="In/Out Plastering %"
              type="number"
              fullWidth
              error={!!errors.plastering}
              helperText={errors.plastering?.message}
            />
          )}
        />
      </Grid>

      {/* Flooring % */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="flooring"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Flooring %"
              type="number"
              fullWidth
              error={!!errors.flooring}
              helperText={errors.flooring?.message}
            />
          )}
        />
      </Grid>

      {/* Land Value */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="landValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Land Value"
              type="number"
              fullWidth
              error={!!errors.landValue}
              helperText={errors.landValue?.message}
            />
          )}
        />
      </Grid>

      {/* Land Reg Value */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="landRegValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Land Reg Value"
              type="number"
              fullWidth
              error={!!errors.landRegValue}
              helperText={errors.landRegValue?.message}
            />
          )}
        />
      </Grid>

      {/* Const. Cost */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="constructionCost"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Construction Cost"
              type="number"
              fullWidth
              error={!!errors.constructionCost}
              helperText={errors.constructionCost?.message}
            />
          )}
        />
      </Grid>

      {/* Construction Reg Value */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="constructionRegValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Construction Reg Value"
              type="number"
              fullWidth
              error={!!errors.constructionRegValue}
              helperText={errors.constructionRegValue?.message}
            />
          )}
        />
      </Grid>

      {/* CarPark Cost */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="carParkCost"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Car Park Cost"
              type="number"
              fullWidth
              error={!!errors.carParkCost}
              helperText={errors.carParkCost?.message}
            />
          )}
        />
      </Grid>

      {/* EB Deposit */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="ebDeposit"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="EB Deposit"
              type="number"
              fullWidth
              error={!!errors.ebDeposit}
              helperText={errors.ebDeposit?.message}
            />
          )}
        />
      </Grid>

      {/* Payment Term */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="paymentTerm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Payment Term"
              fullWidth
              error={!!errors.paymentTerm}
              helperText={errors.paymentTerm?.message}
            />
          )}
        />
      </Grid>

      {/* Sewage Water Tax */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="sewageWaterTax"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Sewage Water Tax"
              type="number"
              fullWidth
              error={!!errors.sewageWaterTax}
              helperText={errors.sewageWaterTax?.message}
            />
          )}
        />
      </Grid>

      {/* GST */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="gst"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="GST"
              type="number"
              fullWidth
              error={!!errors.gst}
              helperText={errors.gst?.message}
            />
          )}
        />
      </Grid>

      {/* Corpus Fund */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="corpusFund"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Corpus Fund"
              type="number"
              fullWidth
              error={!!errors.corpusFund}
              helperText={errors.corpusFund?.message}
            />
          )}
        />
      </Grid>

      {/* Add. Chg. */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="additionalCharges"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Additional Charges"
              type="number"
              fullWidth
              error={!!errors.additionalCharges}
              helperText={errors.additionalCharges?.message}
            />
          )}
        />
      </Grid>

      {/* Total Value */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="totalValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Total Value"
              type="number"
              fullWidth
              error={!!errors.totalValue}
              helperText={errors.totalValue?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default Flat;
