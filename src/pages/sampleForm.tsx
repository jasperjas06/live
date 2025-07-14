
/* eslint-disable react/jsx-no-undef */
/* eslint-disable perfectionist/sort-imports */
import React from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Card,
  CardContent,
  Divider,
  styled,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from 'src/validation/sample';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

// ✅ Fixed to properly match Yup schema
export interface FormData {
  name: string;
  customerId: string;
  phoneNumber: string;
  introducer: string;          // Optional because it's marked as notRequired
  totalPayment: number;
  emi: number;
  initialPayment: number;
  conversion: string;
  mod: boolean;                // Optional because it's marked as notRequired
}

const SavingsSchemeForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      customerId: '',
      phoneNumber: '',
      introducer: '',
      totalPayment: 0,
      emi: 0,
      initialPayment: 0,
      conversion: '',
      mod: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data);
    alert('Form Submitted');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        NVT Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Customer Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                  label="Phone Number"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Introducer Name "
                  {...register('introducer')}
                  fullWidth
                  
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Total Payment (16 months)"
                  {...register('totalPayment')}
                  error={!!errors.totalPayment}
                  helperText={errors.totalPayment?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Initial Payment"
                  {...register('initialPayment')}
                  error={!!errors.initialPayment}
                  helperText={errors.initialPayment?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="EMI"
                  {...register('emi')}
                  error={!!errors.emi}
                  helperText={errors.emi?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormLabel component="legend" sx={{ display: 'block', mb: 1 }}>
                  Conversion
                </FormLabel>
                <Controller
                  name="conversion"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
                {errors.conversion && (
                  <Typography variant="caption" color="error">
                    {errors.conversion.message}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="mod"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value || false} />}
                      label="Do you need MOD?"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Button onClick={()=>console.log(errors)} variant="contained" size="large" color="primary" fullWidth type="submit">
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

export default SavingsSchemeForm;