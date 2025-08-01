/* eslint-disable react/jsx-no-undef */
/* eslint-disable perfectionist/sort-imports */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Card,
  CardContent,
  Divider,
  styled,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from 'src/validation/sample';
import MODReUse from 'src/custom/MOD_Reuse/MODReUse';
import MODFormdata from 'src/custom/MOD_Reuse/MODReUse';
import { createNVT, getAllCustomer, getANVT, updateNVT } from 'src/utils/api.service';
import CustomSelect from 'src/custom/select/select';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

// ✅ Fixed to properly match Yup schema
export interface FormData {
  customer: string;
  // customerId: string;
  // phoneNumber: string;
  introducerName: string;          // Optional because it's marked as notRequired
  totalPayment: number;
  emi: number;
  initialPayment: number;
  conversion: string;
  needMod: boolean;                // Optional because it's marked as notRequired
}

const SavingsSchemeForm = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [modValue, setModValue] = useState(false);
    const [modData,setModData] = useState<any>({}) 
    const [options, setOptions] = useState<any>([]);
    const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: '',
      // customerId: '',
      // phoneNumber: '',
      introducerName: '',
      totalPayment: 0,
      emi: 0,
      initialPayment: 0,
      conversion: '',
      needMod: false,
    },
  });

  const getUpdateData = async () => {
  try {
    if (!id) return;

    const response = await getANVT(id);
    if (response.status) {
      const data = response.data.data;

      // Set default form values using reset
      reset({
        customer: data.customer?._id || '',
        introducerName: data.introducerName || '',
        totalPayment: data.totalPayment,
        initialPayment: data.initialPayment,
        emi: data.emi,
        conversion: data.conversion ? 'yes' : 'no',
        needMod: data.needMod || false,
      });

      if (data.needMod && data.mod) {
        setModValue(true);
        setModData({
          date: data.mod.date || '',
          siteName: data.mod.siteName || '',
          plotNo: data.mod.plotNo || '',
          customer: data.mod.customer || '',
          introducerName: data.mod.introducerName || '',
          introducerMobile: data.mod.introducerPhone || '',
          directorName: data.mod.directorName || '',
          directorMobile: data.mod.directorPhone || '',
          edName: data.mod.EDName || '',
          edMobile: data.mod.EDPhone || '',
          rupee: data.mod.amount || 0,
          status: data.mod.status || 'active',
        });
      }
    }
  } catch (error) {
    console.log('Error fetching NVT by ID:', error);
  }
};


  useEffect(() => {
      const getData = async () => {
        try {
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
          // await getUpdateData();
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setLoading(false);
        }
      };
      getData();
    }, []);

const onSubmit = async (data: FormData) => {
  try {
    setSubmitting(true);
   const nvtPayload = {
  ...data,
  conversion: data.conversion === 'yes',
  ...(id && { _id: id }) // ✅ conditionally add _id only if editing
};


    const payload: {
      nvt: typeof nvtPayload;
      mod?: {
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
      };
    } = { nvt: nvtPayload };

    if (data.needMod) {
      payload.mod = {
        date: modData.date,
        siteName: modData.siteName,
        plotNo: modData.plotNo,
        customer: modData.customer,
        introducerName: modData.introducerName,
        introducerPhone:modData.introducerMobile,
        directorName: modData.directorName,
        directorPhone: modData.directorMobile,
        EDName: modData.edName,
        EDPhone: modData.edMobile,
        amount: modData.rupee,
        status: modData.status,
      };
    }

    const response = id? await updateNVT(payload) : await createNVT(payload);
    if(response.status){
      toast.success(response.message)
      navigate(-1)
    }
  } catch (error:any) {
    toast.error(error)
    console.error('Submission error:', error);
  } finally {
    setSubmitting(false);
    
  }
};

  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        NVT Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                {/* <TextField
                  label="Customer Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
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

              {/* <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Customer ID"
                  {...register('customerId')}
                  error={!!errors.customerId}
                  helperText={errors.customerId?.message}
                  fullWidth
                />
              </Grid> */}

              {/* <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Phone Number"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  fullWidth
                />
              </Grid> */}

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Introducer Name "
                  {...register('introducerName')}
                  fullWidth
                  
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Total Payment (16 months)"
                  {...register('totalPayment')}
                  error={!!errors.totalPayment}
                  helperText={errors.totalPayment?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Initial Payment"
                  {...register('initialPayment')}
                  error={!!errors.initialPayment}
                  helperText={errors.initialPayment?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="EMI"
                  {...register('emi')}
                  error={!!errors.emi}
                  helperText={errors.emi?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormLabel component="legend" sx={{ display: 'block', mb: 1 }}>
                  Conversion
                </FormLabel>
                <Controller
                  name="conversion"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  )}
                />
                {errors.conversion && (
                  <Typography variant="caption" color="error">
                    {errors.conversion.message}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="needMod"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} onChange={(e) => {
                  const newValue = e.target.checked;
                  setModValue(newValue);        
                  field.onChange(newValue);     
                }} checked={field.value || false} />}
                      label="Do you need MOD?"
                    />
                  )}
                />
              </Grid>
                  {
                    modValue && <MODFormdata data={modData} setData={setModData}/>
                  }
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Button 
                  onClick={()=>console.log(errors)} 
                  variant="contained" 
                  size="large" 
                  color="primary" 
                  fullWidth 
                  type="submit"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default SavingsSchemeForm;