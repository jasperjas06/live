/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  styled,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
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

// Yup validation schema
const modSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  headBy: yup.string().required('Head By is required'),
  head: yup.string().required('Head is required'),
  phoneNumber: yup.string()
    .required('Phone Number is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: yup.string().required('Address is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

export interface MODFormData {
  name: string;
  headBy: string;
  head: string;
  phoneNumber: string;
  address: string;
  status: 'active' | 'inactive';
}

const MODForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MODFormData>({
    resolver: yupResolver(modSchema),
    defaultValues: {
      name: '',
      headBy: '',
      head: '',
      phoneNumber: '',
      address: '',
      status: 'active',
    },
  });

  const onSubmit = (data: MODFormData) => {
    console.log('Submitted:', data);
    alert('MOD Form Submitted Successfully!');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        MOD Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Marketer Details Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Marketer Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Head By"
                  {...register('headBy')}
                  error={!!errors.headBy}
                  helperText={errors.headBy?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Head"
                  {...register('head')}
                  error={!!errors.head}
                  helperText={errors.head?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Organization Details Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Organization Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Phone Number"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset" error={!!errors.status}>
                  <FormLabel component="legend">Status</FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="active"
                          control={<Radio color="primary" />}
                          label="Active"
                        />
                        <FormControlLabel
                          value="inactive"
                          control={<Radio color="primary" />}
                          label="Inactive"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.status && (
                    <Typography color="error" variant="caption">
                      {errors.status.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
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

export default MODForm;