/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  styled,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  // backgroundColor: '#fff',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: 8,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: '2px solid #3f51b5',
  fontWeight: 600,
  color: '#3f51b5',
}));

// Yup validation schema
const customerSchema = yup.object().shape({
  // Step-4 fields
  name: yup.string().required('Name is required'),
  // customerId: yup.string().required('Customer ID is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string()
    .required('Phone is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  
  // Step-2 fields
  marketerName: yup.string().required('Marketer Name is required'),
  paymentTerms: yup.string().required('Payment Terms are required'),
  emiAmount: yup.number()
    .typeError('EMI Amount must be a number')
    .required('EMI Amount is required')
    .positive('EMI Amount must be positive'),
  duration: yup.string().required('Duration is required'),
});

export interface CustomerFormData {
 
  name: string;
  // customerId: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  email: string;

  marketerName: string;
  paymentTerms: string;
  emiAmount: number;
  duration: string;
}

const CustomerForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      name: '',
      // customerId: '',
      address: '',
      phone: '',
      city: '',
      state: '',
      pincode: '',
      email: '',
      marketerName: '',
      paymentTerms: '',
      emiAmount: 0,
      duration: '',
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const onSubmit = (data: CustomerFormData) => {
    console.log('Submitted:', data);
    alert('Customer Form Submitted Successfully!');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        Customer Registration Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step-4 Section */}
            <FormSection>
              <SectionTitle variant="h6"> Customer Information</SectionTitle>
              <Grid container spacing={3}>
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

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Phone"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="City"
                    {...register('city')}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="State"
                    {...register('state')}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Pincode"
                    {...register('pincode')}
                    error={!!errors.pincode}
                    helperText={errors.pincode?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </FormSection>

            {/* Step-2 Section */}
            <FormSection>
              <SectionTitle variant="h6"> Estimate Details</SectionTitle>
              
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                sx={{ mb: 3 }}
              >
                <Tab label="General" />
                <Tab label="EMI" />
                <Tab label="Marketer" />
              </Tabs>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Marketer Name"
                    {...register('marketerName')}
                    error={!!errors.marketerName}
                    helperText={errors.marketerName?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Payment Terms"
                    {...register('paymentTerms')}
                    error={!!errors.paymentTerms}
                    helperText={errors.paymentTerms?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="EMI Amount"
                    {...register('emiAmount')}
                    error={!!errors.emiAmount}
                    helperText={errors.emiAmount?.message}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Duration"
                    {...register('duration')}
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <Divider sx={{ my: 4 }} />
            
            <Grid container justifyContent="flex-end">
              <Grid >
                <Button 
                  variant="contained" 
                  size="large" 
                  color="primary" 
                  type="submit"
                  sx={{ minWidth: 150 }}
                >
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

export default CustomerForm;
