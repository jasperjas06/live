/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  styled,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createEmployee, getAllRoles, getEmployeeById, updateEmployee } from 'src/utils/api.service';

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

// ✅ Validation Schema
const roleSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phone: yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  role: yup.string().required('Role is required'),
});

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

const EmployeeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
    },
  });

  const getEmpById = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getEmployeeById(id);
      if (response?.data?.data) {
        const empData = response.data.data;
        reset({
          name: empData.name || '',
          email: empData.email || '',
          phone: empData.phone || '',
          role: empData.role?._id || '',
        });
      } else {
        toast.error('Failed to fetch employee data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch employee data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRolesData = async () => {
    try {
      const response = await getAllRoles();
      if (response?.data?.data) {
        const rolesData = response.data.data.map((role: any) => ({
          label: role.name,
          value: role._id,
        }));
        setRoles(rolesData);
      } else {
        console.log('Failed to fetch roles data');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    getRolesData();
  }, []);

  useEffect(() => {
    if (id) {
      getEmpById();
    }
  }, [id]);

  const handleClose = () => {
    navigate(-1);
    reset();
  };

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const response = id
        ? await updateEmployee({ ...data, _id: id })
        : await createEmployee(data);

      if (response.status === 200) {
        toast.success(response.message);
        navigate(-1);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        {id ? 'Edit Employee' : 'Create Employee'}
      </Typography>

      <StyledCard>
        <CardContent>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormSection>
                <SectionTitle variant="h6">Employee Information</SectionTitle>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          fullWidth
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          fullWidth
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          fullWidth
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <FormControl fullWidth variant="outlined" error={!!errors.role}>
                      <InputLabel id="role-label">Role</InputLabel>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} labelId="role-label" label="Role">
                            {roles.map((role) => (
                              <MenuItem key={role.value} value={role.value}>
                                {role.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
              </FormSection>

              <Divider sx={{ my: 4 }} />

              <Grid container justifyContent="flex-end">
                <Grid>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    type="submit"
                    sx={{ minWidth: 150 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} color="inherit" />
                        {id ? 'Updating...' : 'Creating...'}
                      </Box>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ ml: 2, minWidth: 150 }}
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
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

export default EmployeeForm;