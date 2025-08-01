import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';

import {
  Grid,
  Card,
  Radio,
  styled,
  TextField,
  FormLabel,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { getAllCustomer } from 'src/utils/api.service';

import CustomSelect from '../select/select';


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

interface MODFormData {
 date: string;
 siteName: string;
 plotNo: string;
 customer: string
 customerMobile: string;
 introducerName: string;
 introducerMobile: string;
 directorName: string;
 directorMobile: string;
 edName: string;
 edMobile: string;
 rupee: number;
 status: 'active' | 'inactive';
}

const MODFormdata = ({ data, setData }: { data: MODFormData; setData: (data: MODFormData) => void }) => {
  const [options, setOptions] = useState<any[]>([]);

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

    const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<MODFormData>({
    defaultValues: data,
  });

        const watchedValues = watch();

  // Update parent state on every field change
  useEffect(() => {
    setData(watchedValues);
  }, [watchedValues, setData]);

    
  return (

          <form >
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

              <Grid size={{ xs: 12, sm: 6 }} />

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
                  {...register('introducerMobile')}
                  error={!!errors.introducerMobile}
                  helperText={errors.introducerMobile?.message}
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
                  {...register('directorMobile')}
                  error={!!errors.directorMobile}
                  helperText={errors.directorMobile?.message}
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
                  {...register('edName')}
                  error={!!errors.edName}
                  helperText={errors.edName?.message}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="ED Mobile"
                  {...register('edMobile')}
                  error={!!errors.edMobile}
                  helperText={errors.edMobile?.message}
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
                  name="rupee"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Amount (₹)"
                      {...field}
                      error={!!errors.rupee}
                      helperText={errors.rupee?.message}
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

              
            </Grid>
          </form>

  )
}

export default MODFormdata
