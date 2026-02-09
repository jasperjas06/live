/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { createMarketer, getAllMarketerBoth, getAllPercentage, getAMarketer, updateMarketer } from 'src/utils/api.service';
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
  phone: yup.string()
    .required('Phone Number is required')
    .matches(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: yup.string().required('Address is required'),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  percentageId: yup.string().required('Percentage is required'),
});

export interface MarketerFormData {
  name: string;
  headBy: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  percentageId: string;
}

interface PercentageData {
  _id: string;
  name: string;
  rate: string;
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
  const [percentages, setPercentages] = useState<PercentageData[]>([]);
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
      percentageId: ''
    },
  });

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return debouncedValue;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const getALLMarketingHeadsData = async(search = '')=>{
    try {
      const response:any = await getAllMarketerBoth({ limit: 100, search })
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

  
  useEffect(() => {
    getALLMarketingHeadsData(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  const getPercen = async() =>{
    try {
      const response = await getAllPercentage()
      setPercentages(response.data.data || []);
    } catch (error) {
      console.log(error)
      showSnackbar('Failed to load percentages', 'error');
    }
  }

  const getMarketerData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await getAMarketer(id);
      if (response.status && response.data?.data) {
        const marketerData = response.data.data;
        // Populate form with fetched data
        reset({
          name: marketerData.name || '',
          headBy: marketerData.headBy?._id || marketerData.headBy || '', // Handle populated or unpopulated field
          phone: marketerData.phone || '',
          address: marketerData.address || '',
          status: marketerData.status ? 'active' : 'inactive',
          percentageId: marketerData.percentageId?._id || marketerData.percentageId || ''
        });
      } else {
        showSnackbar('Failed to fetch marketer data', 'error');
      }
    } catch (error) {
      console.error('Error fetching marketer:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getPercen();
    if (id) {
      getMarketerData();
    }
  },[id])

  const onSubmit = async (data: MarketerFormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate phone number format one more time
      // if (!/^[0-9]{10}$/.test(data.phone)) {
      //   showSnackbar('Please enter a valid 10-digit phone number', 'error');
      //   return;
      // }

      const payload = {
        ...data,
        status: data.status === 'active' // Convert string status back to boolean if API expects boolean
      };

      const response = id 
        ? await updateMarketer({ ...payload, _id: id }) 
        : await createMarketer(payload);

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
      toast.error(error)
      
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
                  required
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: !!id ? true : undefined }}
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
                  rules={{ required: "Head by is required" }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option: any) => option.label || ''}
                      value={options.find((opt: any) => opt.value === field.value) || null}
                      onChange={(_, newValue: any) => {
                        field.onChange(newValue ? newValue.value : '');
                      }}
                      onInputChange={(_, newInputValue) => {
                        setSearchTerm(newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="Head By"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  required
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: !!id ? true : undefined }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormControl fullWidth error={!!errors.percentageId}>
                  {/* <InputLabel id="percentage-label">Percentage</InputLabel> */}
                  <Controller
                    name="percentageId"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        options={percentages}
                        getOptionLabel={(option) => `${option.name} - ${option.rate}`}
                        value={percentages.find((p) => p._id === field.value) || null}
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue._id : '');
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Percentage"
                            error={!!errors.percentageId}
                            helperText={errors.percentageId?.message}
                          />
                        )}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  label="Address"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  InputLabelProps={{ shrink: !!id ? true : undefined }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset" error={!!errors.status}>
                  <FormLabel component="legend" required>Status</FormLabel>
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