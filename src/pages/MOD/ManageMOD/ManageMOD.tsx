/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { createMOD, getAllModCustomer, getAllProjects, getAMOD, updateMOD } from 'src/utils/api.service';
import * as yup from 'yup';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

// Helper to clean phone numbers
const cleanPhoneNumber = (phone: string) => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  return cleaned;
};

// Validations
const phoneRegExp = /^[0-9]{10}$/;

const modSchema = yup.object().shape({
  // Toggle for customer type
  isNewCustomer: yup.boolean(),
  
  // Conditional Customer Validation
  modCustomerId: yup.string().when('isNewCustomer', {
    is: false,
    then: (schema) => schema.required('Customer selection is required for existing customers'),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  // Customer Fields - Conditional based on isNewCustomer (True for Edit Mode)
  name: yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Customer Name is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  phone: yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Phone is required').matches(phoneRegExp, 'Phone number must be 10 digits'),
    otherwise: (schema) => schema.notRequired(),
  }),
  email: yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.email('Invalid email format').required('Email is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  address: yup.string().when('isNewCustomer', {
    is: true,
    then: (schema) => schema.required('Address is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Common Fields
  projectId: yup.string().required('Project is required'),
  plotNo: yup.string().required('Plot No is required'),
  paidDate: yup.string().required('Paid Date is required'),
  
  // Financials
  totalAmount: yup.number()
    .required('Total Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a valid number'),
  paidAmount: yup.number()
    .required('Paid Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a valid number'),
  ratePerSqft: yup.number()
    .required('Rate per Sqft is required')
    .positive('Rate must be positive')
    .typeError('Rate must be a valid number'),

  // Personnel
  introducerName: yup.string().notRequired(),
  introducerPhone: yup.string()
    .notRequired()
    .test('is-valid-mobile', 'Mobile number must be 10 digits', (val) => {
      if (!val) return true; // allow empty
      return phoneRegExp.test(val);
    }),
  directorName: yup.string().notRequired(),
  directorPhone: yup.string()
    .notRequired()
    .test('is-valid-mobile', 'Mobile number must be 10 digits', (val) => {
      if (!val) return true; // allow empty
      return phoneRegExp.test(val);
    }),
  EDName: yup.string().notRequired(),
  EDPhone: yup.string()
    .notRequired()
    .test('is-valid-mobile', 'Mobile number must be 10 digits', (val) => {
      if (!val) return true; // allow empty
      return phoneRegExp.test(val);
    }),
  
  // Status (we keep it in schema as default/hidden or if passing default 'active')
  status: yup.string().oneOf(['active', 'inactive']).default('active'),
});

export interface MODFormData {
  isNewCustomer: boolean;
  modCustomerId?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  
  projectId: string;
  plotNo: string;
  paidDate: string;
  
  totalAmount: number;
  paidAmount: number;
  ratePerSqft: number;
  
  introducerName: string;
  introducerPhone: string;
  directorName: string;
  directorPhone: string;
  EDName: string;
  EDPhone: string;
  
  status: 'active' | 'inactive';
}

const MODForm = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    
    // Project State
    const [projectOptions, setProjectOptions] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [projectsLoading, setProjectsLoading] = useState(false);

    // Customer Infinite Scroll State
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [customerPage, setCustomerPage] = useState(1);
    const [customerSearch, setCustomerSearch] = useState('');
    const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState('');
    const [hasMoreCustomers, setHasMoreCustomers] = useState(true);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      control,
      watch,
      setValue,
      reset,
      formState: { errors },
    } = useForm<MODFormData>({
      resolver: yupResolver(modSchema) as any,
      defaultValues: {
        isNewCustomer: false,
        modCustomerId: '',
        paidDate: new Date().toISOString().split('T')[0],
        projectId: '',
        plotNo: '',
        totalAmount: 0,
        paidAmount: 0,
        ratePerSqft: 0,
        status: 'active',
        // Customer defaults
        name: '',
        phone: '',
        email: '',
        address: '',
        // Personnel defaults
        introducerName: '',
        introducerPhone: '',
        directorName: '',
        directorPhone: '',
        EDName: '',
        EDPhone: '',
      },
    });

    const isNewCustomer = watch('isNewCustomer');

    // Fetch Projects
    useEffect(() => {
      const getProjects = async () => {
        setProjectsLoading(true);
        try {
          const res = await getAllProjects();
          if (res.status === 200) {
           setProjectOptions(res.data.data.map((p: any) => ({
             label: p.projectName,
             value: p._id,
             ...p
           })));
          }
        } catch (err) {
          console.error("Failed to fetch projects", err);
        } finally {
          setProjectsLoading(false);
        }
      };
      getProjects();
    }, []);

    // Debounce Customer Search
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedCustomerSearch(customerSearch);
        if (customerSearch !== debouncedCustomerSearch) {
          setCustomerPage(1);
          setCustomerOptions([]);
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [customerSearch]);

    // Fetch Customers (Infinite Scroll)
    const fetchCustomers = async (page: number, search: string, append = false) => {
      try {
        setCustomerLoading(true);
        const params: any = { page, limit: 10 };
        if (search) params.search = search;

        const res = await getAllModCustomer(params);

        if (res.status === 200) {
          const newOptions = res.data.data.map((item: any) => ({
            label: item.name, // Assuming 'name' is the field
            value: item._id, // Assuming '_id' is the field for modCustomerId
            phone: item.phone,
            email: item.email,
            address: item.address,
            ...item
          }));

          setCustomerOptions(prev => append ? [...prev, ...newOptions] : newOptions);
          setHasMoreCustomers(res.data.pagination?.hasNextPage || false);
        }
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setCustomerLoading(false);
      }
    };

    // Load Customers on search change or initial
    useEffect(() => {
      // Fetch if existing customer mode OR if we are in edit mode (where we always show dropdown)
      if (!isNewCustomer || id) {
        fetchCustomers(1, debouncedCustomerSearch, false);
      }
    }, [debouncedCustomerSearch, isNewCustomer, id]);

    // Load more customers on page change
    useEffect(() => {
      if ((!isNewCustomer || id) && customerPage > 1 && hasMoreCustomers) {
        fetchCustomers(customerPage, debouncedCustomerSearch, true);
      }
    }, [customerPage]);

    // Fetch Data by ID for Edit Mode
    useEffect(() => {
        const getData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const res = await getAMOD(id);
                if (res.status === 200 && res.data?.data) {
                    const data = res.data.data;
                    
                    // Populate form fields
                    reset({
                        isNewCustomer: true, // Force to TRUE in Edit mode to validate fields
                        projectId: data.projectId?._id || data.projectId,
                        plotNo: data.plotNo,
                        paidDate: data.paidDate ? data.paidDate.split('T')[0] : '',
                        totalAmount: data.totalAmount,
                        paidAmount: data.paidAmount,
                        ratePerSqft: data.ratePerSqft,
                        introducerName: data.introducerName,
                        introducerPhone: data.introducerPhone,
                        directorName: data.directorName,
                        directorPhone: data.directorPhone,
                        EDName: data.EDName,
                        EDPhone: data.EDPhone,
                        status: data.status || 'active',
                        // Populate customer details
                        name: data.customerId?.name || '',
                        phone: data.customerId?.phone || '',
                        email: data.customerId?.email || '',
                        address: data.customerId?.address || '',
                        modCustomerId: data.customerId?._id || data.customerId, // Map customerId
                    });

                    // Set Project Select State
                    if (data.projectId && typeof data.projectId === 'object') {
                        setSelectedProject({
                             label: data.projectId.projectName,
                             value: data.projectId._id,
                             ...data.projectId
                        });
                    }
                    
                    // Set Customer Select State
                    if (data.customerId && typeof data.customerId === 'object') {
                        setSelectedCustomer({
                             label: data.customerId.name,
                             value: data.customerId._id,
                             phone: data.customerId.phone,
                             email: data.customerId.email,
                             address: data.customerId.address,
                             ...data.customerId
                        });
                        
                        // Ensure option exists in dropdown
                        setCustomerOptions(prev => {
                             const exists = prev.some(opt => opt.value === data.customerId._id);
                             if (!exists) return [...prev, {
                                 label: data.customerId.name,
                                 value: data.customerId._id,
                                 phone: data.customerId.phone,
                                 email: data.customerId.email,
                                 address: data.customerId.address,
                                 ...data.customerId
                             }];
                             return prev;
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch MOD details", error);
                toast.error("Failed to load details");
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, [id, reset]);

    const highlightText = (text: string, searchTerm: string) => {
      if (!searchTerm || !text) return text;
      const lowerText = text.toLowerCase();
      const lowerSearchTerm = searchTerm.toLowerCase();
      const index = lowerText.indexOf(lowerSearchTerm);
      if (index === -1) return text;
      return (
        <>
          {text.substring(0, index)}
          <span style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
            {text.substring(index, index + searchTerm.length)}
          </span>
          {text.substring(index + searchTerm.length)}
        </>
      );
    };

    const onSubmit = async(data: MODFormData) => {
      try {
        // Prepare Payload
        const payload: any = {
           projectId: data.projectId,
           plotNo: data.plotNo,
           paidDate: data.paidDate,
           totalAmount: data.totalAmount,
           paidAmount: data.paidAmount,
           ratePerSqft: data.ratePerSqft,
           
           introducerName: data.introducerName,
           introducerPhone: data.introducerPhone,
           directorName: data.directorName,
           directorPhone: data.directorPhone,
           EDName: data.EDName,
           EDPhone: data.EDPhone,
           status: 'active', // Defaulting status per instruction
           
           // Include Customer Details always (if present)
           name: data.name,
           phone: cleanPhoneNumber(data.phone || ''),
           email: data.email,
           address: data.address
        };

        // modCustomerId is relevant for both Existing (Create) and Edit mode
        if (data.modCustomerId) {
           payload.modCustomerId = data.modCustomerId;
        }

        const finalPayload = id ? { ...payload, _id: id } : payload;
        const response = id
               ? await updateMOD(finalPayload)
               : await createMOD(finalPayload);
       
        if (response?.status === 200) {
           toast.success(response.message);
           navigate(-1);
        } else {
           toast.error(response.message);
        }
      } catch (error:any) {
        toast.error(error.message || "An error occurred");
      }
    };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        {id ? 'Edit MOD' : 'Create MOD'}
      </Typography>

      <StyledCard>
        <CardContent>
          {isLoading ? (
             <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
             </Box>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              
              {/* Customer Type Toggle - Only Show in CREATE Mode */}
              {!id && (
              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Customer Type</FormLabel>
                   <Controller
                    name="isNewCustomer"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup 
                        row 
                        {...field}
                        onChange={(e) => {
                           field.onChange(e.target.value === 'true');
                           if (e.target.value === 'true') {
                             // Reset customer ID if switching to new
                             setValue('modCustomerId', '');
                             setSelectedCustomer(null);
                           }
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControlLabel value="false" control={<Radio />} label="Existing Customer" />
                        <FormControlLabel value="true" control={<Radio />} label="New Customer" />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Grid>
              )}

              {/* Existing Customer Select - Show if Existing OR Edit Mode */}
              {(!isNewCustomer || id) && (
                 <Grid size={{ xs: 12, md: 6 }}>
                    <Autocomplete
                        options={customerOptions}
                        getOptionLabel={(option) => option.label || ''}
                        loading={customerLoading}
                        value={selectedCustomer}
                        onInputChange={(event, value, reason) => {
                            if (reason === 'input') setCustomerSearch(value);
                            else if (reason === 'clear') {
                                setCustomerSearch('');
                                setCustomerPage(1);
                            }
                        }}
                        onChange={(event, newValue) => {
                            setSelectedCustomer(newValue);
                            if (newValue) {
                              setValue('modCustomerId', newValue.value || '', { shouldValidate: true });
                              // Pre-fill fields
                              setValue('name', newValue.label || '', { shouldValidate: true });
                              setValue('phone', newValue.phone || '', { shouldValidate: true });
                              setValue('email', newValue.email || '', { shouldValidate: true });
                              setValue('address', newValue.address || '', { shouldValidate: true });
                            } else {
                              setValue('modCustomerId', '', { shouldValidate: true });
                            }
                        }}
                        ListboxProps={{
                            onScroll: (event: React.SyntheticEvent) => {
                                const listboxNode = event.currentTarget;
                                if (
                                    listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight * 0.8 &&
                                    hasMoreCustomers &&
                                    !customerLoading
                                ) {
                                    setCustomerPage(prev => prev + 1);
                                }
                            },
                            style: { maxHeight: '300px' }
                        }}
                        renderOption={(props, option) => (
                            <li {...props} key={option.value}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <Typography variant="body1">
                                        {highlightText(option.label, debouncedCustomerSearch)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.phone}
                                    </Typography>
                                </Box>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Customer"
                                error={!!errors.modCustomerId}
                                helperText={errors.modCustomerId?.message}
                                required
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {customerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <input type="hidden" {...register('modCustomerId')} />
                 </Grid>
              )}

              {/* Customer Fields - Show if New OR Edit Mode */}
              {(isNewCustomer || id) && (
                 <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Customer Name"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Phone Number"
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      fullWidth
                      inputProps={{ maxLength: 10 }}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                      required
                    />
                  </Grid>
                   <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Address"
                      {...register('address')}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      fullWidth
                      required
                    />
                  </Grid>
                 </>
              )}

              <Grid size={{ xs: 12 }}>
                 <Divider sx={{ my: 1 }} />
              </Grid>

               {/* Project Details */}
               <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  Project Details
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  options={projectOptions}
                  getOptionLabel={(option) => option.label || ''}
                  loading={projectsLoading}
                  value={selectedProject}
                  onChange={(event, newValue) => {
                     setSelectedProject(newValue);
                     setValue('projectId', newValue?.value || '', { shouldValidate: true });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Project"
                      error={!!errors.projectId}
                      helperText={errors.projectId?.message}
                      required
                      InputProps={{
                         ...params.InputProps,
                         endAdornment: (
                           <>
                             {projectsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                             {params.InputProps.endAdornment}
                           </>
                         )
                      }}
                    />
                  )}
                />
                 <input type="hidden" {...register('projectId')} />
              </Grid>
              
               <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Plot No"
                      {...register('plotNo')}
                      error={!!errors.plotNo}
                      helperText={errors.plotNo?.message}
                      fullWidth
                      required
                    />
                  </Grid>
                  
                <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Rate Per Sqft"
                  type="number"
                  {...register('ratePerSqft')}
                  error={!!errors.ratePerSqft}
                  helperText={errors.ratePerSqft?.message}
                  fullWidth
                   InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                   required
                />
              </Grid>

                   <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Paid Date"
                      type="date"
                      {...register('paidDate')}
                      error={!!errors.paidDate}
                      helperText={errors.paidDate?.message}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

              {/* Financial Attributes */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Financial Details
                </Typography>
              </Grid>

               <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Total Amount"
                  type="number"
                  {...register('totalAmount')}
                  error={!!errors.totalAmount}
                  helperText={errors.totalAmount?.message}
                  fullWidth
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                  required
                />
              </Grid>
               <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Paid Amount"
                  type="number"
                  {...register('paidAmount')}
                  error={!!errors.paidAmount}
                  helperText={errors.paidAmount?.message}
                  fullWidth
                   InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
                   required
                />
              </Grid>

              {/* Personnel Details */}
               <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600, color: 'primary.main' }}>
                  Personnel Details
                </Typography>
              </Grid>

               <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                  label="Introducer Name"
                  {...register('introducerName')}
                  error={!!errors.introducerName}
                  helperText={errors.introducerName?.message}
                  fullWidth
                 />
               </Grid>
               <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                  label="Introducer Mobile"
                  {...register('introducerPhone')}
                  error={!!errors.introducerPhone}
                  helperText={errors.introducerPhone?.message}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                 />
               </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                  label="Director Name"
                  {...register('directorName')}
                  error={!!errors.directorName}
                  helperText={errors.directorName?.message}
                  fullWidth
                 />
               </Grid>
               <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                  label="Director Mobile"
                  {...register('directorPhone')}
                  error={!!errors.directorPhone}
                  helperText={errors.directorPhone?.message}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                 />
               </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                  label="ED Name"
                  {...register('EDName')}
                  error={!!errors.EDName}
                  helperText={errors.EDName?.message}
                  fullWidth
                 />
               </Grid>
               <Grid size={{ xs: 12, md: 6 }}>
                 <TextField
                  label="ED Mobile"
                  {...register('EDPhone')}
                  error={!!errors.EDPhone}
                  helperText={errors.EDPhone?.message}
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                 />
               </Grid>

              {/* Buttons */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 3 }} />
                <Box display="flex" gap={2} justifyContent="center">
                  <Button 
                    variant="outlined" 
                    size="large" 
                    sx={{ minWidth: 120 }}
                    onClick={() => navigate(-1)}
                  >
                    Cancel
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
          )}
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default MODForm;