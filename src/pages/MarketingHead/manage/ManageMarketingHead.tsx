/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { createMarkinghead, getAMarketingHead, updateMarketingHead } from 'src/utils/api.service';
import toast from 'react-hot-toast';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

// Enhanced Yup validation schema
const modSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  address: yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
  phone: yup.string()
    .required('Phone Number is required')
    .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),
  age: yup.number()
    .typeError('Age must be a number')
    .required('Age is required')
    .min(18, 'Age must be at least 18 years')
    .max(65, 'Age must not exceed 65 years'),
  gender: yup.string()
    .oneOf(['male', 'female'], 'Please select a valid gender')
    .required('Gender is required'),
  email: yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .max(100, 'Email must not exceed 100 characters'),
  status: yup.boolean()
    .required('Status is required')
});

export interface MarketerFormData {
  name: string;
  address: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  email: string;
  status: boolean;
}

const MarketingHeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm<MarketerFormData>({
    resolver: yupResolver(modSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      age: 0,
      gender: 'male',
      email: '',
      status: true
    },
  });

  // Watch for phone input to format it
  const phoneValue = watch('phone');

  // Format phone number as user types
  useEffect(() => {
    if (phoneValue && phoneValue.length > 0) {
      const numericValue = phoneValue.replace(/\D/g, '').slice(0, 10);
      if (numericValue !== phoneValue) {
        setValue('phone', numericValue, { shouldValidate: true });
      }
    }
  }, [phoneValue, setValue]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getMarketingHead = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await getAMarketingHead(id);
      const customerData = response?.data?.data;
      if (customerData) {
        // Ensure data types match form expectations
        const formData: MarketerFormData = {
          name: customerData.name || '',
          address: customerData.address || '',
          phone: customerData.phone || '',
          age: Number(customerData.age) || 18,
          gender: customerData.gender || 'male',
          email: customerData.email || '',
          status: Boolean(customerData.status)
        };
        reset(formData);
        showSnackbar('Data loaded successfully', 'success');
      } else {
        showSnackbar('No data found for this ID', 'warning');
      }
    } catch (error) {
      console.error('Error fetching marketing head data:', error);
      showSnackbar('Failed to load data. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getMarketingHead();
    }
  }, [id]);

  const onSubmit = async (data: MarketerFormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate phone number format one more time
      if (!/^[0-9]{10}$/.test(data.phone)) {
        showSnackbar('Please enter a valid 10-digit phone number', 'error');
        return;
      }

      const response = id 
        ? await updateMarketingHead({ ...data, _id: id }) 
        : await createMarkinghead(data);

      if (response && response.data) {
        const action = id ? 'updated' : 'created';
        toast.success(response.message)
        
        // Reset form if creating new entry
        if (!id) {
          reset();
        }
        navigate(-1)
        // Optionally navigate back after successful submission
        // setTimeout(() => navigate('/marketing-heads'), 2000);
      } else {
        toast(response.message)
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isDirty) {
      const confirmReset = window.confirm('Are you sure you want to reset all changes?');
      if (confirmReset) {
        reset();
        showSnackbar('Form reset successfully', 'info');
      }
    }
  };

  const isEditMode = !!id;
  const formTitle = isEditMode ? 'Edit Marketing Head' : 'Create New Marketing Head';

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {formTitle}
        </Typography>
        {isEditMode && (
          <Typography variant="body2" color="text.secondary">
            ID: {id}
          </Typography>
        )}
      </Box>

      <StyledCard>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <Box textAlign="center">
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Loading data...
              </Typography>
            </Box>
          </Box>
        ) : (
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Personal Details
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Full Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message || 'Enter your full name (2-50 characters)'}
                    fullWidth
                    variant="outlined"
                    disabled={isSubmitting}
                    InputProps={{
                      placeholder: 'e.g., John Doe'
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Phone Number"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message || 'Enter 10-digit phone number'}
                    fullWidth
                    variant="outlined"
                    disabled={isSubmitting}
                    inputProps={{
                      maxLength: 10,
                      pattern: '[0-9]*',
                      inputMode: 'numeric'
                    }}
                    InputProps={{
                      placeholder: 'e.g., 9876543210'
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Age"
                    type="number"
                    {...register('age')}
                    error={!!errors.age}
                    helperText={errors.age?.message || 'Age must be between 18-65 years'}
                    fullWidth
                    variant="outlined"
                    disabled={isSubmitting}
                    inputProps={{
                      min: 18,
                      max: 65,
                      step: 1
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Email Address"
                    type="email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message || 'Enter a valid email address'}
                    fullWidth
                    variant="outlined"
                    disabled={isSubmitting}
                    InputProps={{
                      placeholder: 'e.g., john.doe@email.com'
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Address"
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message || 'Enter complete address (10-200 characters)'}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    disabled={isSubmitting}
                    InputProps={{
                      placeholder: 'Enter your complete address including city, state, and postal code'
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl component="fieldset" error={!!errors.gender} disabled={isSubmitting}>
                    <FormLabel component="legend" required>
                      Gender
                    </FormLabel>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value="male"
                            control={<Radio color="primary" />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio color="primary" />}
                            label="Female"
                          />
                        </RadioGroup>
                      )}
                    />
                    {errors.gender && (
                      <Typography color="error" variant="caption">
                        {errors.gender.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl component="fieldset" error={!!errors.status} disabled={isSubmitting}>
                    <FormLabel component="legend" required>
                      Status
                    </FormLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup 
                          row 
                          value={field.value ? 'active' : 'inactive'}
                          onChange={(e) => field.onChange(e.target.value === 'active')}
                        >
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
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                      variant="outlined"
                      size="large"
                      color="secondary"
                      onClick={handleReset}
                      disabled={isSubmitting || !isDirty}
                      sx={{ flex: { xs: 1, sm: 'auto' }, minWidth: 120 }}
                    >
                      Reset Form
                    </Button>

                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      sx={{ flex: 1 }}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                      {isSubmitting 
                        ? (isEditMode ? 'Updating...' : 'Creating...') 
                        : (isEditMode ? 'Update Marketing Head' : 'Create Marketing Head')
                      }
                    </Button>
                    
                    
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        )}
      </StyledCard>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
};

export default MarketingHeadForm;