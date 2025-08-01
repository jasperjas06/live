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
  Snackbar,
  Alert,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createMarketer, getAllMarkingHead, updateMarketer } from 'src/utils/api.service';
import CustomSelect from 'src/custom/select/select';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  phone: yup.string()
    .required('Phone Number is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: yup.string().required('Address is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

export interface MarketerFormData {
  name: string;
  headBy: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

const MarketerForm = () => {
  const {id} = useParams()
  const [options, setOptions] = useState<any>([]);
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
    control,reset,
    formState: { errors },
  } = useForm<MarketerFormData>({
    resolver: yupResolver(modSchema),
    defaultValues: {
      name: '',
      headBy: '',
      phone: '',
      address: '',
      status: 'active',
    },
  });

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getALLMarketingHeadsData = async()=>{
    try {
      const response:any = await getAllMarkingHead()
      if(response.status){
        const newdata = response.data.data.map((item: any, index: number) => ({
          value: item._id,
          label: item.name,
        }));
        setOptions(newdata);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getALLMarketingHeadsData()
  },[])

  const onSubmit = async (data: MarketerFormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate phone number format one more time
      // if (!/^[0-9]{10}$/.test(data.phone)) {
      //   showSnackbar('Please enter a valid 10-digit phone number', 'error');
      //   return;
      // }

      const response = id 
        ? await updateMarketer({ ...data, _id: id }) 
        : await createMarketer(data);

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
        toast.error(response.message)
      }
    } catch (error: any) {
      toast.success(error)
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        Marketer Form
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
                {/* <TextField
                  label="Head By"
                  {...register('headBy')}
                  error={!!errors.headBy}
                  helperText={errors.headBy?.message}
                  fullWidth
                  variant="outlined"
                /> */}
                <Controller
                  control={control}
                  name="headBy"
                  defaultValue=""
                  rules={{ required: "Head by is required" }}
                  render={({ field, fieldState }) => (
                    <CustomSelect
                      label="Head By"
                      name="headBy"
                      value={field.value}
                      onChange={field.onChange}
                      options={options}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
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

export default MarketerForm;