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
  Box,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCustomer, getACustomer, updateCustomer } from 'src/utils/api.service';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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

// Zod schema
const customerSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),

  // Optional / domain fields
  plotNo: z.string().optional(),
  date: z.string().optional(),
  nameOfCustomer: z.string().optional(),
  gender: z.string().optional(),
  projectArea: z.string().optional(),
  nationality: z.string().optional(),
  dob: z.string().optional(),
  occupation: z.string().optional(),
  qualification: z.string().optional(),
  planNo: z.string().optional(),
  communicationAddress: z.string().optional(),
  mobileNo: z.string().optional(),
  landLineNo: z.string().optional(),
  fatherOrHusbandName: z.string().optional(),
  motherName: z.string().optional(),
  nomineeName: z.string().optional(),
  nomineeAge: z.string().optional(),
  nomineeRelationship: z.string().optional(),
  nameOfGuardian: z.string().optional(),
  so_wf_do: z.string().optional(),
  relationshipWithCustomer: z.string().optional(),
  introducerName: z.string().optional(),
  introducerMobileNo: z.string().optional(),
  immSupervisorName: z.string().optional(),
  cedName: z.string().optional(),
  diamountDirectorName: z.string().optional(),
  diamountDirectorPhone: z.string().optional(),

  photo: z.any().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const CustomerForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      // required
      name: '',
      address: '',
      phone: '',
      city: '',
      state: '',
      pincode: '',
      email: '',

      // optional
      plotNo: '',
      date: '',
      nameOfCustomer: '',
      gender: '',
      projectArea: '',
      nationality: '',
      dob: '',
      occupation: '',
      qualification: '',
      planNo: '',
      communicationAddress: '',
      mobileNo: '',
      landLineNo: '',
      fatherOrHusbandName: '',
      motherName: '',
      nomineeName: '',
      nomineeAge: '',
      nomineeRelationship: '',
      nameOfGuardian: '',
      so_wf_do: '',
      relationshipWithCustomer: '',
      introducerName: '',
      introducerMobileNo: '',
      immSupervisorName: '',
      cedName: '',
      diamountDirectorName: '',
      diamountDirectorPhone: '',
      photo: undefined,
    },
  });

  const onSubmit: SubmitHandler<CustomerFormData> = async (data) => {
    try {
      const response = id
        ? await updateCustomer({ ...data, _id: id })
        : await createCustomer(data);

      if (response.status === 200) {
        toast.success(response.message);
        navigate(-1);
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.message || 'Something went wrong');
    }
  };

  const getDataByID = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await getACustomer(id);
      const customerData = response?.data?.data;

      if (customerData) {
        reset({
          photo: undefined,
          ...(customerData as Partial<CustomerFormData>),
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch customer');
      console.log('Error fetching customer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataByID();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        Customer Registration Form
      </Typography>

      <StyledCard>
        <CardContent>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* SECTION 1: BASIC DETAILS */}
              <FormSection>
                <SectionTitle variant="h6">Basic Details</SectionTitle>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Plot No"
                      {...register('plotNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register('date')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Project Area"
                      {...register('projectArea')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Plan No"
                      {...register('planNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Name of Customer"
                      {...register('nameOfCustomer')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="System Name"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Gender"
                      select
                      {...register('gender')}
                      fullWidth
                      variant="outlined"
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Date of Birth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register('dob')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Nationality"
                      {...register('nationality')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Occupation"
                      {...register('occupation')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Qualification"
                      {...register('qualification')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      label="Communication Address"
                      {...register('communicationAddress')}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
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

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Mobile No"
                      {...register('mobileNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Landline No"
                      {...register('landLineNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Email"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Father / Husband Name"
                      {...register('fatherOrHusbandName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Mother Name"
                      {...register('motherName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="System Address"
                      {...register('address')}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </FormSection>

              {/* SECTION 2: NOMINEE & GUARDIAN */}
              <FormSection>
                <SectionTitle variant="h6">Nominee & Guardian</SectionTitle>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Nominee Name"
                      {...register('nomineeName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Nominee Age"
                      type="number"
                      {...register('nomineeAge')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Nominee Relationship"
                      {...register('nomineeRelationship')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Guardian Name"
                      {...register('nameOfGuardian')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="S/O, W/O, D/O"
                      {...register('so_wf_do')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Relationship with Customer"
                      {...register('relationshipWithCustomer')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Guardian / Nominee Address"
                      {...register('address')}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Customer Photo
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ textTransform: 'none' }}
                    >
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        {...register('photo')}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </FormSection>

              {/* SECTION 3: INTRODUCER & STAFF */}
              <FormSection>
                <SectionTitle variant="h6">Introducer & Staff Details</SectionTitle>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Introducer Name"
                      {...register('introducerName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Introducer Mobile No"
                      {...register('introducerMobileNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Immediate Supervisor Name"
                      {...register('immSupervisorName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="CED Name"
                      {...register('cedName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Diamond Director Name"
                      {...register('diamountDirectorName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Diamond Director Phone"
                      {...register('diamountDirectorPhone')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <Divider sx={{ my: 2 }} />

              <Grid container justifyContent="flex-end">
                <Grid>
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
          )}
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default CustomerForm;
