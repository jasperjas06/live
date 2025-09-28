import * as yup from "yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { Grid, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";

interface FlatProps {
  control: any;
  errors: any;
}

export type FlatFormData = {
  block: string;
  floor: string;
  bedRoom: number;
  udsSqft: number;
  guideRateSqft: number;
  propertyTax: number;
  carPark: string;
  onBookingPercent: number;
  lintelPercent: number;
  roofPercent: number;
  plasterPercent: number;
  flooringPercent: number;
  landValue: number;
  landRegValue: number;
  constCost: number;
  constRegValue: number;
  carParkCost: number;
  ebDeposit: number;
  paymentTerm: string;
  sewageWaterTax: number;
  gst: number;
  corpusFund: number;
  additionalCharges: number;
  totalValue: number;
};


export const flatSchema = yup.object({
  block: yup.string().required("Block is required"),
  floor: yup.string().required("Floor is required"),
  bedRoom: yup.number().required("Bedroom count is required").min(1),
  udsSqft: yup.number().required("UDS Sqft is required").positive(),
  guideRateSqft: yup.number().required("Guide rate per sqft is required"),
  propertyTax: yup.number().required("Property tax is required"),
  carPark: yup.string().required("Car park is required"),
  onBookingPercent: yup.number().required().min(0).max(100),
  lintelPercent: yup.number().required().min(0).max(100),
  roofPercent: yup.number().required().min(0).max(100),
  plasterPercent: yup.number().required().min(0).max(100),
  flooringPercent: yup.number().required().min(0).max(100),
  landValue: yup.number().required(),
  landRegValue: yup.number().required(),
  constCost: yup.number().required(),
  constRegValue: yup.number().required(),
  carParkCost: yup.number().required(),
  ebDeposit: yup.number().required(),
  paymentTerm: yup.string().required(),
  sewageWaterTax: yup.number().required(),
  gst: yup.number().required(),
  corpusFund: yup.number().required(),
  additionalCharges: yup.number().required(),
  totalValue: yup.number().required(),
});

const defaultFlatValues: FlatFormData = {
  block: "Block An",
  floor: "1",
  bedRoom: 0,
  udsSqft: 0,
  guideRateSqft: 0,
  propertyTax: 0,
  carPark: "",
  onBookingPercent: 0,
  lintelPercent: 0,
  roofPercent: 0,
  plasterPercent: 0,
  flooringPercent: 0,
  landValue: 0,
  landRegValue: 0,
  constCost: 0,
  constRegValue: 0,
  carParkCost: 0,
  ebDeposit: 0,
  paymentTerm: "",
  sewageWaterTax: 0,
  gst: 0,
  corpusFund: 0,
  additionalCharges: 0,
  totalValue: 0,
};


const Flat: React.FC<FlatProps> = ({ control, errors }) => {

//   const {
//   control,
//   handleSubmit,
//   formState: { errors },
//   reset,
// } = useForm<FlatFormData>({
//   resolver: yupResolver(flatSchema),
//   defaultValues: defaultFlatValues,
// });
    const g = ""
  return (
    
    <Grid container spacing={2}>
      {/* Flat */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="flat.flat"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Flat"
              fullWidth
              error={!!errors.flat}
              helperText={errors.flat?.message}
            />
          )}
        />
      </Grid>
      {/* Block */}
      <Grid size={{ xs: 12, sm: 6, }}>
        <Controller
          name="flat.block"
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
          name="flat.floor"
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
          name="flat.bedRoom"
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
          name="flat.udsSqft"
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
          name="flat.guideRate"
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
          name="flat.propertyTax"
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
          name="flat.carPark"
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
          name="flat.onBooking"
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
          name="flat.lintel"
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
          name="flat.roof"
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
          name="flat.plastering"
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
          name="flat.flooring"
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
          name="flat.landValue"
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
          name="flat.landRegValue"
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
          name="flat.constructionCost"
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
          name="flat.constructionRegValue"
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
          name="flat.carParkCost"
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
          name="flat.ebDeposit"
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
          name="flat.paymentTerm"
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
          name="flat.sewageWaterTax"
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
          name="flat.gst"
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
          name="flat.corpusFund"
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
          name="flat.additionalCharges"
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
          name="flat.totalValue"
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
