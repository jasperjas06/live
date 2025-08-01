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
  Box,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomSelect from 'src/custom/select/select';
import { createMOD, getAllCustomer, updateMOD } from 'src/utils/api.service';
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
  date: yup.string().required('Date is required'),
  siteName: yup.string().required('Site Name is required'),
  plotNo: yup.string().required('Plot No is required'),
  customer: yup.string().required('Customer Name is required'),

  introducerName: yup.string().required('Introducer Name is required'),
  introducerPhone: yup.string()
    .required('Introducer Mobile is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  directorName: yup.string().required('Director Name is required'),
  directorPhone: yup.string()
    .required('Director Mobile is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  EDName: yup.string().required('ED Name is required'),
  EDPhone: yup.string()
    .required('ED Mobile is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  amount: yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a valid number'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

export interface MODFormData {
  date: string;
  siteName: string;
  plotNo: string;
  customer: string;

  introducerName: string;
  introducerPhone: string;
  directorName: string;
  directorPhone: string;
  EDName: string;
  EDPhone: string;
  amount: number;
  status: 'active' | 'inactive';
}

const MODForm = () => {
    const [options, setOptions] = useState<any>([]);
    const navigate = useNavigate()
    const {id} = useParams()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MODFormData>({
    resolver: yupResolver(modSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Today's date
      siteName: '',
      plotNo: '',
      customer: '',

      introducerName: '',
      introducerPhone: '',
      directorName: '',
      directorPhone: '',
      EDName: '',
      EDPhone: '',
      amount: 0,
      status: 'active',
    },
  });

  const onSubmit = async(data: MODFormData) => {
    try {
      const payload = id ? { ...data, _id: id } : data;
            const response = id
              ? await updateMOD(payload)
              : await createMOD(data);
      
            if (response?.status === 200) {
              toast.success(response.message)
              navigate(-1)
              // alert(`Project ${id ? 'updated' : 'created'} successfully.`);
            } else {
              toast(response.message)
            }
    } catch (error:any) {
    toast.error(error)
    }
  };

  useEffect(() => {
      const getData = async () => {
        const res = await getAllCustomer();
        if (res.status) {
          // console.log(res,"res")
          const newdata = res.data.data.map((item: any, index: number) => ({
            value: item._id,
            label: item.name,
          }));
          setOptions(newdata);
        } else {
          console.log("Failed to fetch customers:", res);
        }
      };
  
      getData();
    }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        MOD Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Basic Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Date"
                  type="date"
                  {...register('date')}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Site Name"
                  {...register('siteName')}
                  error={!!errors.siteName}
                  helperText={errors.siteName?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label="Plot No"
                  {...register('plotNo')}
                  error={!!errors.plotNo}
                  helperText={errors.plotNo?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Customer & Personnel Details Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Customer & Personnel Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {/* <TextField
                  label="Customer Name"
                  {...register('customer')}
                  error={!!errors.customer}
                  helperText={errors.customer?.message}
                  fullWidth
                  variant="outlined"
                /> */}
                <Controller
                                  control={control}
                                  name="customer"
                                  defaultValue=""
                                  rules={{ required: "Customer is required" }}
                                  render={({ field, fieldState }) => (
                                    <CustomSelect
                                      label="Customer"
                                      name="customer"
                                      value={field.value}
                                      onChange={field.onChange}
                                      options={options}
                                      error={!!fieldState.error}
                                      helperText={fieldState.error?.message}
                                    />
                                  )}
                                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {/* <TextField
                  label="Customer Mobile"
                  {...register('customerMobile')}
                  error={!!errors.customerMobile}
                  helperText={errors.customerMobile?.message}
                  fullWidth
                  variant="outlined"
                  placeholder="10-digit mobile number"
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*',
                  }}
                /> */}
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Introducer Name"
                  {...register('introducerName')}
                  error={!!errors.introducerName}
                  helperText={errors.introducerName?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Introducer Mobile"
                  {...register('introducerPhone')}
                  error={!!errors.introducerPhone}
                  helperText={errors.introducerPhone?.message}
                  fullWidth
                  variant="outlined"
                  placeholder="10-digit mobile number"
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*',
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Director Name"
                  {...register('directorName')}
                  error={!!errors.directorName}
                  helperText={errors.directorName?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Director Mobile"
                  {...register('directorPhone')}
                  error={!!errors.directorPhone}
                  helperText={errors.directorPhone?.message}
                  fullWidth
                  variant="outlined"
                  placeholder="10-digit mobile number"
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*',
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="ED Name"
                  {...register('EDName')}
                  error={!!errors.EDName}
                  helperText={errors.EDName?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="ED Mobile"
                  {...register('EDPhone')}
                  error={!!errors.EDPhone}
                  helperText={errors.EDPhone?.message}
                  fullWidth
                  variant="outlined"
                  placeholder="10-digit mobile number"
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*',
                  }}
                />
              </Grid>

              {/* Financial Details Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Financial Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Amount (₹)"
                      {...field}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      fullWidth
                      variant="outlined"
                      type="number"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                      }}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Status Section */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Status
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset" error={!!errors.status}>
                  <FormLabel component="legend" sx={{ fontWeight: 500 }}>Status</FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field} sx={{ mt: 1 }}>
                        <FormControlLabel
                          value="active"
                          control={<Radio color="primary" />}
                          label="Active"
                          sx={{ mr: 4 }}
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
                    <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                      {errors.status.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Submit Section */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 3 }} />
                <Box display="flex" gap={2} justifyContent="center">
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{ minWidth: 120 }}
                    onClick={() => window.location.reload()}
                  >
                    Reset
                  </Button>
                  <Button 
                    variant="contained" 
                    size="large" 
                    color="primary" 
                    type="submit"
                    sx={{ minWidth: 120 }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default MODForm;