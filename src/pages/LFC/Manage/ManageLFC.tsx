/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
  styled,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));


export const lfcSchema = yup.object({
  customerName: yup.string().required('Customer name is required'),
  customerId: yup.string().required('Customer ID is required'),
  pl: yup.string().required('PL is required'),
  introductionName: yup.string().required('Introducer name is required'),
  totalPayments: yup.object({
    ent: yup.number().required(),
    fustral: yup.number().required(),
    payout: yup.number().required(),
  }).required(),
  landDetails: yup.object({
    sayFe: yup.string().required(),
    sayTask: yup.string().required(),
    plotNo: yup.string().required(),
  }).required(),
  needHos: yup.boolean().required(),
  registration: yup.mixed<'open' | 'closed'>().oneOf(['open', 'closed']).required(),
  conversion: yup.boolean().required(),
  conversionCustomerId: yup.string().required(),
});

export interface LFCFormData {
  customerName: string ;
  customerId: string;
  pl: string;
  introductionName: string;
  totalPayments: {
    ent: number;
    fustral: number;
    payout: number;
  };
  landDetails: {
    sayFe: string;
    sayTask: string;
    plotNo: string;
  };
  needHos: boolean;
  registration: 'open' | 'closed';
  conversion: boolean;
  conversionCustomerId: string;
}

const LFCForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LFCFormData>({
    resolver: yupResolver(lfcSchema),
    defaultValues: {
      customerName: '',
      customerId: '',
      pl: '',
      introductionName: '',
      totalPayments: {
        ent: 0,
        fustral: 0,
        payout: 0,
      },
      landDetails: {
        sayFe: '',
        sayTask: '',
        plotNo: '',
      },
      needHos: false,
      registration: 'open',
      conversion: false,
      conversionCustomerId: '',
    },
  });

  const conversion = watch('conversion');

  const onSubmit = (data: LFCFormData) => {
    console.log('Submitted:', data);
    alert('LFC Form Submitted');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        LFC Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Basic Customer Information */}
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Customer Name"
                  {...register('customerName')}
                  error={!!errors.customerName}
                  helperText={errors.customerName?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Customer ID"
                  {...register('customerId')}
                  error={!!errors.customerId}
                  helperText={errors.customerId?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="PL"
                  {...register('pl')}
                  error={!!errors.pl}
                  helperText={errors.pl?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Introduction Name"
                  {...register('introductionName')}
                  error={!!errors.introductionName}
                  helperText={errors.introductionName?.message}
                  fullWidth
                />
              </Grid>

              {/* Total Payments Section */}
              <Grid size={{ xs: 12,}}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Total Payments for Usports
                </Typography>
              </Grid>

              <Grid size={{ xs: 4, sm: 6 }}>
                <TextField
                  label="E NT"
                  {...register('totalPayments.ent')}
                  error={!!errors.totalPayments?.ent}
                  helperText={errors.totalPayments?.ent?.message}
                  fullWidth
                  type="number"
                />
              </Grid>

              <Grid size={{ xs: 4, sm: 6 }}>
                <TextField
                  label="Fustral"
                  {...register('totalPayments.fustral')}
                  error={!!errors.totalPayments?.fustral}
                  helperText={errors.totalPayments?.fustral?.message}
                  fullWidth
                  type="number"
                />
              </Grid>

              <Grid size={{ xs: 4, sm: 6 }}>
                <TextField
                  label="Payout"
                  {...register('totalPayments.payout')}
                  error={!!errors.totalPayments?.payout}
                  helperText={errors.totalPayments?.payout?.message}
                  fullWidth
                  type="number"
                />
              </Grid>

              {/* LAND Details Section */}
              <Grid size={{ xs: 12,}}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  LAND Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 4, sm: 6 }}>
                <TextField
                  label="Say.FE"
                  {...register('landDetails.sayFe')}
                  error={!!errors.landDetails?.sayFe}
                  helperText={errors.landDetails?.sayFe?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 4, sm: 6 }}>
                <TextField
                  label="Say.task"
                  {...register('landDetails.sayTask')}
                  error={!!errors.landDetails?.sayTask}
                  helperText={errors.landDetails?.sayTask?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 4, sm: 6 }}>
                <TextField
                  label="Plot No"
                  {...register('landDetails.plotNo')}
                  error={!!errors.landDetails?.plotNo}
                  helperText={errors.landDetails?.plotNo?.message}
                  fullWidth
                />
              </Grid>

              {/* HOS Selection */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Do you need HOS?</FormLabel>
                  <Controller
                    name="needHos"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.needHos && (
                    <Typography color="error" variant="caption">
                      {errors.needHos.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Registration Status */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Registration</FormLabel>
                  <Controller
                    name="registration"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="open"
                          control={<Radio />}
                          label="Booking opens"
                        />
                        <FormControlLabel
                          value="closed"
                          control={<Radio />}
                          label="Closed"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.registration && (
                    <Typography color="error" variant="caption">
                      {errors.registration.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Conversion Section */}
              <Grid size={{ xs: 12,}}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Conversion</FormLabel>
                  <Controller
                    name="conversion"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.conversion && (
                    <Typography color="error" variant="caption">
                      {errors.conversion.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Conditional Customer ID for Conversion */}
              {conversion && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Customer ID"
                    {...register('conversionCustomerId')}
                    error={!!errors.conversionCustomerId}
                    helperText={errors.conversionCustomerId?.message}
                    fullWidth
                  />
                </Grid>
              )}

              <Grid size={{ xs: 12,}}>
                <Divider sx={{ my: 2 }} />
                <Button variant="contained" size="large" color="primary" fullWidth type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default LFCForm;