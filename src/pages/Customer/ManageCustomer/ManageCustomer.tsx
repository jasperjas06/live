/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import Flat from "src/pages/CustomerDetails/ManageCustomer/Flat";
import General from "src/pages/CustomerDetails/ManageCustomer/General";
import Plot from "src/pages/CustomerDetails/ManageCustomer/Plot";
import { createCustomer, createCustomerEstimate, getACustomer, getAllMarketer, getAllMarkingHead, getAllProjects, updateCustomer, updateCustomerEstimate } from 'src/utils/api.service';
import { z } from 'zod';

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
// Base schema for customer details
const baseCustomerSchema = z.object({
  // Required fields
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^[0-9]{10,11}$/, 'Phone must be 10-11 digits'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  projectId: z.string().min(1, 'Project is required'),
  ddId: z.string().min(1, 'DD Name is required'),

  // Optional / domain fields
  plotNo: z.string().optional(),
  gender: z.string().optional(),
  emiAmount: z.preprocess((val) => Number(val), z.number().optional()),
  ddMobile: z.string().optional(),
  cedId: z.string().nullable().optional(), // Allow nullable for optional ObjectId
  cedMobile: z.string().optional(),
  // percentge field logic is in estimate for new, but technically part of customer schema too? 
  // keeping optional fields as they were relative to customer collection
  percentage: z.preprocess((val) => Number(val), z.number().optional()),
  projectArea: z.string().optional(),
  nationality: z.string().optional(),
  dob: z.string().optional(),
  occupation: z.string().optional(),
  qualification: z.string().optional(),
  panNo: z.string().optional(),
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
  diamountDirectorName: z.string().optional(),
  diamountDirectorPhone: z.string().optional(),
  guardianAddress: z.string().optional(),
  photo: z.any().optional(),
});

// Schema for creating new customer (includes estimate details)
const createCustomerSchema = baseCustomerSchema.extend({
  general: z.object({
    marketer: z.string().min(1, 'Marketer is required'),
    saleType: z.string().min(1, 'Sale Type is required'),
    percentage: z.preprocess((val) => Number(val), z.number().min(0).max(100, 'Percentage allow 0-100')),
    emiAmount: z.preprocess((val) => Number(val), z.number().min(1, 'EMI Amount is required')),
    noOfInstallments: z.preprocess((val) => Number(val), z.number().min(1, 'Installments is required')),
    
    // Optional estimate fields
    paymentTerms: z.string().optional(),
    status: z.string().optional(),
    loan: z.string().optional(),
    offered: z.string().optional(),
    reason: z.string().optional(),
    saleDeedDoc: z.any().optional(),
    motherDoc: z.any().optional(),
  }),
});

type CustomerFormData = z.infer<typeof baseCustomerSchema>;

const CustomerForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdCustomerId, setCreatedCustomerId] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [ddOptions, setDdOptions] = useState<any[]>([]);
  const [ddLoading, setDdLoading] = useState(false);
  const [selectedDD, setSelectedDD] = useState<any>(null);
  const [cedOptions, setCedOptions] = useState<any[]>([]);
  const [cedLoading, setCedLoading] = useState(false);
  const [selectedCED, setSelectedCED] = useState<any>(null);
  // Estimate form state
  const [saleType, setSaleType] = useState("");
  const [marketerOptions, setMarketerOptions] = useState<{ label: string; value: string; percentage: string | number }[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const methods = useForm<any>({
    resolver: zodResolver(createCustomerSchema),
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
      // date: '',    
      // nameOfCustomer: '',
      gender: '',
      projectId: '',
      emiAmount: 0,
      ddId: '',
      ddMobile: '',
      cedId: '',
      cedMobile: '',
      percentage: 0,
      projectArea: '',
      nationality: '',
      dob: '',
      occupation: '',
      qualification: '',
      panNo: '',
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
      diamountDirectorName: '',
      diamountDirectorPhone: '',
      photo: undefined,
      guardianAddress: '',
      // Estimate form defaults
      general: {},
      plot: {},
      flat: {},
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = methods;

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
            // Clean phone and mobileNo by removing leading zeros (Chrome autofill issue)
      let cleanedPhone = data.phone;
      if (cleanedPhone.startsWith('0')) {
        cleanedPhone = cleanedPhone.substring(1);
      }
      
      // Validate cleaned phone is exactly 10 digits
      if (!/^[0-9]{10}$/.test(cleanedPhone)) {
        toast.error('Phone must be exactly 10 digits');
        return;
      }
      const cleanedMobileNo = data.mobileNo?.startsWith('0') 
        ? data.mobileNo.substring(1) 
        : data.mobileNo;

      // Validate estimate fields for new customers
      // if (!id) {
      //   // Check if basic estimate fields are valid
      //   const isEstimateValid = await trigger([
      //     'general.marketer', 
      //     'general.saleType', 
      //     'general.percentage',
      //     'general.emiAmount',
      //     'general.noOfInstallments'
      //   ]);
      //   if (!isEstimateValid) {
      //     toast.error('Please fill in all required estimate fields');
      //     return;
      //   }
      // }

      // Prepare customer payload (exclude estimate fields)
      const customerPayload: any = {
        name: data.name,
        address: data.address,
        phone: cleanedPhone,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        email: data.email,
        projectId: data.projectId,
        ddId: data.ddId,
        plotNo: data.plotNo,
        gender: data.gender,
        emiAmount: data.emiAmount,
        ddMobile: data.ddMobile,
        cedId: data.cedId && data.cedId.trim() !== '' ? data.cedId : null,
        cedMobile: data.cedMobile,
        percentage: data.percentage,
        projectArea: data.projectArea,
        nationality: data.nationality,
        dob: data.dob,
        occupation: data.occupation,
        qualification: data.qualification,
        panNo: data.panNo,
        communicationAddress: data.communicationAddress,
        mobileNo: cleanedMobileNo,
        landLineNo: data.landLineNo,
        fatherOrHusbandName: data.fatherOrHusbandName,
        motherName: data.motherName,
        nomineeName: data.nomineeName,
        nomineeAge: data.nomineeAge,
        nomineeRelationship: data.nomineeRelationship,
        nameOfGuardian: data.nameOfGuardian,
        so_wf_do: data.so_wf_do,
        relationshipWithCustomer: data.relationshipWithCustomer,
        introducerName: data.introducerName,
        introducerMobileNo: data.introducerMobileNo,
        immSupervisorName: data.immSupervisorName,
        diamountDirectorName: data.diamountDirectorName,
        diamountDirectorPhone: data.diamountDirectorPhone,
        guardianAddress: data.guardianAddress,
        photo: data.photo,
      };

      let response;
      // If editing existing customer
      if (id) {
        // Update existing customer
        // We need to pass _id for update
        response = await updateCustomer({ ...customerPayload, _id: id }, true);
        
        if (response.status === 200) {
           // Handle Estimate Update
           if (Object.keys(data.general || {}).length > 0) {
              const estimatePayload: any = {
                general: data.general,
                customerId: id, // Use existing ID
                // For update, we might need _id of the general/plot records if the API requires it. 
                // The form data populated from fetch should contain them.
              };

              if (saleType.toLowerCase() === 'plot') {
                estimatePayload.plot = data.plot;
              }
              if (saleType.toLowerCase() === 'flat') {
                estimatePayload.flat = data.flat;
              }
              
              // We call updateCustomerEstimate 
              // Note: The API likely needs the structure { general: { _id: ..., ... }, ... }
              // The form values should have these _ids if they were fetched correctly.
              await updateCustomerEstimate(estimatePayload);
           }
           
           toast.success('Customer updated successfully');
           navigate('/customer/list');
           return;
        }
      } else {
        // Create new customer
        response = await createCustomer(customerPayload, true);
      }

      const customerResponse = response;

      if (customerResponse.status === 200) {
        // Prioritize _id (MongoDB ID) for estimate creation logic
        const mongoId = customerResponse.data?.data?._id;
        // Prioritize id (Customer Code) for display/clipboard
        const displayId = customerResponse.data?.data?.id || mongoId;
        
        if (!mongoId) {
          toast.error('Customer created but ID not returned');
          return;
        }

        // Check if estimate data exists
        if (Object.keys(data.general || {}).length > 0) {
          // Prepare estimate payload
          let estimatePayload: any = {
            general: data.general,
            customerId: mongoId, // Use MongoDB ID for linking
          };

          if (saleType.toLowerCase() === 'plot' || saleType.toLowerCase() === 'villa') {
            estimatePayload.plot = data.plot;
          }
          if (saleType.toLowerCase() === 'flat') {
            estimatePayload.flat = data.flat;
          }

          // Create estimate
          const estimateResponse = await createCustomerEstimate(estimatePayload);

          if (estimateResponse.status === 200) {
            setCreatedCustomerId(displayId); // Show friendly ID
            setSuccessDialogOpen(true);
            toast.success('Customer and estimate created successfully!');
          } else {
            toast.error(estimateResponse.message || 'Customer created but estimate creation failed');
            setCreatedCustomerId(displayId);
            setSuccessDialogOpen(true);
          }
        } else {
          // No estimate data, just show success for customer
          setCreatedCustomerId(displayId);
          setSuccessDialogOpen(true);
        }
      } else {
        toast.error(customerResponse.message || 'Failed to create customer');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error?.message || 'Something went wrong');
    }
  };

  
  const handleCopyCustomerId = () => {
    navigator.clipboard.writeText(createdCustomerId);
    toast.success('Customer ID copied to clipboard!');
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate('/customer');
  };

  const getDataByID = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await getACustomer(id);
      if (response?.data?.data) {
          const customerData = response.data.data;
          
          // Map API response to form data
          const formData = {
            ...customerData,
            // Handle populated fields (objects -> IDs)
            projectId: customerData.projectId?._id || customerData.projectId,
            ddId: customerData.ddId?._id || customerData.ddId,
            cedId: customerData.cedId?._id || customerData.cedId, // Map cedId object to ID
            
            // Map generalId to general form field
            general: customerData.generalId || {}, 
            plot: {}, // Initialize empty, will populate if needed
            flat: {}
          };
          
          // Reset form with mapped data
          methods.reset(formData);

          // Handle special fields that need explicit setting or logic
          
          // 1. Auto-fill names/mobiles from populated objects if available, 
          // although strict form usually relies on IDs. 
          // But purely for display if referenced:
          if (customerData.cedId?.phone) {
             methods.setValue('cedMobile', customerData.cedId.phone);
          }
          if (customerData.ddId?.phone) {
             methods.setValue('ddMobile', customerData.ddId.phone);
          }

          // 2. Set Sale Type if available in general data
          if (customerData.generalId?.saleType) {
            setSaleType(customerData.generalId.saleType);
            
            // If sale type exists, check for plot/flat data
            // The API response might have them as top-level keys or inside general?
            // User JSON didn't show plot/flat keys, assuming they might exist if saleType was set.
            // If they are nested elsewhere, we'd map them here. 
            // For now, assuming standard keys if they exist:
            if (customerData.plot) methods.setValue('plot', customerData.plot);
            if (customerData.flat) methods.setValue('flat', customerData.flat);
          }

          // 3. Set Autocomplete States for Project, DD, CED
          if (customerData.projectId && typeof customerData.projectId === 'object') {
             setSelectedScheme(customerData.projectId);
          }
          if (customerData.ddId && typeof customerData.ddId === 'object') {
             setSelectedDD(customerData.ddId);
             // Fetch CED options for the selected DD
             if (customerData.ddId._id) {
               fetchCEDs(customerData.ddId._id);
             }
          }
          if (customerData.cedId && typeof customerData.cedId === 'object') {
             setSelectedCED(customerData.cedId);
          }
        }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch customer');
      console.log('Error fetching customer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects on mount
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await getAllProjects();
      if (response.status === 200 && response.data?.data) {
        setProjects(response.data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch projects');
      console.log('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch DDs on mount
  const fetchDDs = async () => {
    try {
      setDdLoading(true);
      const response = await getAllMarkingHead();
      if (response.status === 200 && response.data?.data) {
        setDdOptions(response.data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch DDs');
      console.log('Error fetching DDs:', error);
    } finally {
      setDdLoading(false);
    }
  };

  // Fetch CEDs filtered by selected DD
  const fetchCEDs = async (ddId?: string) => {
    try {
      setCedLoading(true);
      const params = ddId ? { head: ddId } : {};
      const response = await getAllMarketer(params);
      if (response.status === 200 && response.data?.data) {
        setCedOptions(response.data.data);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch CEDs');
      console.log('Error fetching CEDs:', error);
    } finally {
      setCedLoading(false);
    }
  };

  // Fetch marketers for estimate form
  const fetchMarketers = async () => {
    try {
      const response = await getAllMarketer();
      if (response.status === 200 && response.data?.data) {
        const marketers = response.data.data.map((m: any) => ({
          label: m.name,
          value: m._id,
          percentage: m.percentageId?.rate || 0,
        }));
        setMarketerOptions(marketers);
      }
    } catch (error: any) {
      console.error('Error fetching marketers:', error);
    }
  };

  // Handle next for estimate form (just validates, doesn't navigate)
  const handleNext = async () => {
    const valid = await trigger('general');
    if (!valid) {
      toast.error('Please fill in all required estimate fields');
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchDDs();
    fetchMarketers();
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
              <FormProvider {...methods}>
              {/* SECTION 1: BASIC DETAILS */}
              <FormSection>
                <SectionTitle variant="h6">Basic Details</SectionTitle>
                  <Grid container spacing={3}>
                    
                    <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                    <Autocomplete
                      options={projects}
                      getOptionLabel={(option) => option.projectName || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      loading={projectsLoading}
                      value={selectedScheme}
                      onChange={(event, newValue) => {
                        setSelectedScheme(newValue);
                        setValue('projectId', newValue?._id || '', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });

                        // Auto-fill EMI Amount from selected scheme/project
                        if (newValue && newValue.emiAmount !== null && newValue.emiAmount !== undefined) {
                          setValue('emiAmount', newValue.emiAmount, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          // Also update general.emiAmount for estimate form
                          setValue('general.emiAmount', newValue.emiAmount, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          // Update general.noOfInstallments from project duration
                          if (newValue.duration) {
                              setValue('general.noOfInstallments', newValue.duration, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                          }
                        } else {
                          setValue('emiAmount', 0, {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                          setValue('general.emiAmount', 0, {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                          setValue('general.noOfInstallments', '', {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <>
                              Project <span style={{ color: 'red' }}>*</span>
                            </>
                          }
                          error={!!errors.projectId}
                          helperText={errors.projectId?.message as string}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {projectsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {/* Hidden input to register projectId with react-hook-form */}
                    <input type="hidden" {...register('projectId')} />
                  </Grid>



                    <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Name"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message as string}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Plot No"
                      {...register('plotNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  {/* <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      {...register('date')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid> */}

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="PAN No"
                      {...register('panNo')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  {/* <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Name of Customer"
                      {...register('nameOfCustomer')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid> */}

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
                      helperText={errors.city?.message as string}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="State"
                      {...register('state')}
                      error={!!errors.state}
                      helperText={errors.state?.message as string}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Pincode"
                      {...register('pincode')}
                      error={!!errors.pincode}
                      helperText={errors.pincode?.message as string}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label={
                        <>
                          Mobile No <span style={{ color: 'red' }}>*</span>
                        </>
                      }
                      {...register('phone')}
                      error={!!errors.phone}
                      helperText={errors.phone?.message as string}
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
                      helperText={errors.email?.message as string}
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
                      label="Address"
                      {...register('address')}
                      error={!!errors.address}
                      helperText={errors.address?.message as string}
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
                      {...register('guardianAddress')}
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
                  {/* <Grid size={{ xs: 12, md: 6 }}>
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
                  </Grid> */}

                  {/* DD Name and DD Mobile - Side by Side */}
                  {/* DD Name - Required (Autocomplete) */}
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Autocomplete
                      options={ddOptions}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      loading={ddLoading}
                      value={selectedDD}
                      onChange={(event, newValue) => {
                        setSelectedDD(newValue);
                        setValue('ddId', newValue?._id || '', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        
                        // Auto-fill DD Mobile
                        if (newValue && newValue.phone !== null && newValue.phone !== undefined) {
                          setValue('ddMobile', newValue.phone, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        } else {
                          setValue('ddMobile', '', {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                        }

                        // Silently store DD's percentage for backend submission
                        if (newValue?.percentageId?.rate) {
                          const percentageValue = Number((newValue.percentageId.rate as string).replace('%', ''));
                          setValue('general.percentage', percentageValue, {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                        } else {
                          setValue('general.percentage', 0, {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                        }

                        // Fetch CEDs for this DD
                        if (newValue?._id) {
                          fetchCEDs(newValue._id);
                        } else {
                          setCedOptions([]);
                          setSelectedCED(null);
                          setValue('cedId', '', { shouldValidate: false });
                          setValue('cedMobile', '', { shouldValidate: false });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <>
                              DD Name <span style={{ color: 'red' }}>*</span>
                            </>
                          }
                          error={!!errors.ddId}
                          helperText={errors.ddId?.message as string}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {ddLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {/* Hidden input to register ddId with react-hook-form */}
                    <input type="hidden" {...register('ddId')} />
                  </Grid>

                  {/* DD Mobile - Required (Auto-filled and Disabled) */}
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <TextField
                      label={
                        <>
                          DD Mobile <span style={{ color: 'red' }}>*</span>
                        </>
                      }
                      {...register('ddMobile')}
                      error={!!errors.ddMobile}
                      helperText={errors.ddMobile?.message as string}
                      fullWidth
                      variant="outlined"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                        style: { cursor: 'not-allowed' }
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          cursor: 'not-allowed',
                          WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-root': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    />
                  </Grid>

                  {/* CED Name - Required (Autocomplete) */}
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Autocomplete
                      options={cedOptions}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      loading={cedLoading}
                      value={selectedCED}
                      onChange={(event, newValue) => {
                        setSelectedCED(newValue);
                        setValue('cedId', newValue?._id || '', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        
                        // Auto-fill CED Mobile
                        if (newValue && newValue.phone !== null && newValue.phone !== undefined) {
                          setValue('cedMobile', newValue.phone, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        } else {
                          setValue('cedMobile', '', {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                        }

                        // Silently store CED's percentage for backend submission (overrides DD percentage)
                        if (newValue?.percentageId?.rate) {
                          const percentageValue = Number((newValue.percentageId.rate as string).replace('%', ''));
                          setValue('general.percentage', percentageValue, {
                            shouldValidate: false,
                            shouldDirty: false,
                          });
                        } else if (!newValue) {
                          // If CED is cleared, revert to DD's percentage if DD is selected
                          if (selectedDD?.percentageId?.rate) {
                            const ddPercentageValue = Number((selectedDD.percentageId.rate as string).replace('%', ''));
                            setValue('general.percentage', ddPercentageValue, {
                              shouldValidate: false,
                              shouldDirty: false,
                            });
                          } else {
                            setValue('general.percentage', 0, {
                              shouldValidate: false,
                              shouldDirty: false,
                            });
                          }
                        }

                        // Auto-set General Marketer from CED
                        if (newValue?._id) {
                           setValue('general.marketer', newValue._id, {
                              shouldValidate: true,
                              shouldDirty: true
                           });
                        } else {
                           setValue('general.marketer', '', { shouldValidate: false });
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="CED Name"
                          error={!!errors.cedId}
                          helperText={errors.cedId?.message as string}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {cedLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {/* Hidden input to register cedId with react-hook-form */}
                    <input type="hidden" {...register('cedId')} />
                  </Grid>

                  {/* CED Mobile - Optional (Auto-filled and Disabled) */}
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <TextField
                      label="CED Mobile"
                      {...register('cedMobile')}
                      error={!!errors.cedMobile}
                      helperText={errors.cedMobile?.message as string}
                      fullWidth
                      variant="outlined"
                      disabled
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                        style: { cursor: 'not-allowed' }
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          cursor: 'not-allowed',
                          WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                        },
                        '& .MuiInputBase-root': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    />
                  </Grid>

                  {/* <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Immediate Supervisor Name"
                      {...register('immSupervisorName')}
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>

                  CED Name field removed - CED selection is handled via Autocomplete in Basic Details section

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
                  </Grid> */}
                </Grid>
              </FormSection>

              {/* SECTION 4: ESTIMATE DETAILS */}
              {/* SECTION 4: ESTIMATE DETAILS */}
                <>
                  <Divider sx={{ my: 4 }} />
                  <FormSection>
                    <SectionTitle variant="h6">Estimate Details</SectionTitle>
                    <General
                      marketer={marketerOptions}
                      saleType={saleType}
                      setSaleType={setSaleType}
                      handleNext={handleNext}
                      setTabIndex={() => {}} // Not used in this context
                    />
                  </FormSection>

                  {/* Conditional Plot Section */}
                  {(saleType.toLowerCase() === 'plot') && (
                    <FormSection>
                      <SectionTitle variant="h6">
                        {saleType.charAt(0).toUpperCase() + saleType.slice(1)} Details
                      </SectionTitle>
                      <Plot control={methods.control} errors={methods.formState.errors} />
                    </FormSection>
                  )}

                  {/* Conditional Flat Section */}
                  {saleType.toLowerCase() === 'flat' && (
                    <FormSection>
                      <SectionTitle variant="h6">Flat Details</SectionTitle>
                      <Flat control={methods.control} errors={methods.formState.errors} />
                    </FormSection>
                  )}
                </>

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
            </FormProvider>
            </form>
          )}
        </CardContent>
      </StyledCard>
      
      {/* Success Dialog */}
      <Dialog 
        open={successDialogOpen} 
        onClose={(event, reason) => {
          // Prevent closing by clicking outside or pressing escape
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pb: 1,
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#4caf50'
        }}>
          ✓ Customer Created Successfully!
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 3, pb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Your customer has been created with the following ID:
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 1,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              border: '2px solid #e0e0e0'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: '#1976d2',
                fontFamily: 'monospace'
              }}
            >
              {createdCustomerId}
            </Typography>
            <IconButton 
              onClick={handleCopyCustomerId}
              size="small"
              sx={{ 
                color: '#1976d2',
                '&:hover': { backgroundColor: '#e3f2fd' }
              }}
              title="Copy Customer ID"
            >
              <Icon icon="solar:copy-outline" width={24} />
            </IconButton>
          </Box>
          <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
            Click the copy icon to copy the ID to your clipboard
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleSuccessDialogClose}
            variant="contained"
            size="large"
            sx={{ minWidth: 150 }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
};

export default CustomerForm;
