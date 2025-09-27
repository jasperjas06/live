/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  styled,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getAllCustomer, createLFC, updateLFC, getALFC, getANVTbyCus } from "src/utils/api.service";
import CustomSelect from "src/custom/select/select";
import MODFormdata from "src/custom/MOD_Reuse/MODReUse";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StaticTableData from "src/custom/dataTable/StaticTableData";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  backgroundColor: "#fff",
}));

export const lfcSchema = yup.object({
  customer: yup.string().required("Customer is required"),
  introductionName: yup.string().required("Introducer name is required"),
  emi: yup.number().required("EMI is required"),
  inital: yup.number().required("Initial payment is required"),
  totalSqFt: yup.string().required("Total square feet is required"),
  sqFtAmount: yup.string().required("Square feet amount is required"),
  plotNo: yup.string().required("Plot number is required"),
  needMod: yup.boolean().required("MOD selection is required"),
  registration: yup
    .mixed<"open" | "closed">()
    .oneOf(["open", "closed"])
    .required("Registration status is required"),
  conversion: yup.boolean().required("Conversion selection is required"),

}).required();

export interface LFCFormData {
  customer: string;
  introductionName: string;
  emi: number;
  inital: number;
  totalSqFt: string;
  sqFtAmount: string;
  plotNo: string;
  needMod: boolean;
  registration: "open" | "closed";
  conversion: boolean;
  nvt?: any;
}

const LFCForm = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [options, setOptions] = useState<any>([]);
  const [isMod, setIsMod] = useState<boolean>(false);
  const [modData, setModData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cusId, setCusId] = useState<any>("")
  const [nvtData,setNvtData] = useState([])
  const [nvtTableData, setNvtTableData] = useState([])
  const [isNvt, setIsNvt] = useState<boolean>(false)

  const columns = [
  { header: 'Customer Name', accessor: 'customer.name' },
  { header: 'Phone', accessor: 'customer.phone' },
  { header: 'Initial Payment', accessor: 'initialPayment' },
  { header: 'Total Payment', accessor: 'totalPayment' },
  { header: 'EMI', accessor: 'emi' },
  { header: 'Introducer', accessor: 'introducerName' },
  { header: 'Mod Amount', accessor: 'mod.amount' },
  { header: 'Mod Site', accessor: 'mod.siteName' },
];

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<LFCFormData>({
    resolver: yupResolver(lfcSchema),
    defaultValues: {
      customer: "",
      introductionName: "",
      emi: 0,
      inital: 0,
      totalSqFt: "",
      sqFtAmount: "",
      plotNo: "",
      needMod: false,
      registration: "open",
      conversion: false,
      nvt: [],
    },
  });

  const conversion = watch("conversion");

  const getCustomerNVT = async () => {
  try {
    const response = await getANVTbyCus(cusId);
    if (response.status) {
      setIsNvt(true)
      setNvtTableData(response.data.data)
      const ids = response.data.data.map((item: { _id: string }) => item._id);
      setNvtData(ids);
    }
    else setIsNvt(false)
  } catch (error) {
    setIsNvt(false)
    console.log(error);
  }
};

  useEffect(()=>{
    if(cusId) getCustomerNVT()
  },[cusId])
  const getUpdateData = async () => {
    try {
      if (!id) return;

      const response = await getALFC(id);
      if (response.status) {
        const data = response.data.data;
        

        // Set default form values using reset
        reset({
          customer: data.customer?._id || data.customer || '',
          introductionName: data.introductionName || '',
          emi: data.emi || 0,
          inital: data.inital || 0,
          totalSqFt: data.totalSqFt || '',
          sqFtAmount: data.sqFtAmount || '',
          plotNo: data.plotNo || '',
          needMod: data.needMod || false,
          registration: data.registration || 'open',
          conversion: data.conversion || false,
          nvt: data.nvt || [],
        });

        if (data.needMod && data.mod) {
          setIsMod(true);
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
      console.log('Error fetching LFC by ID:', error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      
      const lfcPayload = {
        ...data,
        ...(nvtData && {nvt: nvtData}),
        ...(id && { _id: id }) // conditionally add _id only if editing
      };

      const payload: {
        lfc: typeof lfcPayload;
        mod?: {
          date: string;
          siteName: string;
          plotNo: string;
          introducerName: string;
          introducerPhone: string;
          directorName: string;
          directorPhone: string;
          EDName: string;
          EDPhone: string;
          amount: number;
          status: 'active' | 'inactive';
        };
      } = { lfc: lfcPayload };

      if (data.needMod) {
        payload.mod = {
          date: modData.date,
        siteName: modData.siteName,
        plotNo: modData.plotNo,
        // customer: modData.customer,
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

      const response = id ? await updateLFC(payload) : await createLFC(payload);
      
      if (response.status) {
        toast.success(response.message)
        navigate(-1)
      }
    } catch (error:any) {
      console.error('Submission error:', error);
       toast.error(error)
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await getAllCustomer();
        if (res.status) {
          const newdata = res.data.data.map((item: any, index: number) => ({
            value: item._id,
            label: item.name,
          }));
          setOptions(newdata);
        } else {
          console.log("Failed to fetch customers:", res);
        }
        await getUpdateData();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getData();
    // return setLoading(false)
  }, [id]);

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
        {id ? 'Update Project Detailes Form' : 'Create Project Detailes Form'}
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Basic Customer Information */}
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
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
                     onChange={(e) => {
                        const selectedId = e.target.value;
                        field.onChange(selectedId); // updates RHF form state
                        setCusId(selectedId);       // updates local state
                      }}
                      options={options}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Introduction Name"
                  {...register("introductionName")}
                  error={!!errors.introductionName}
                  helperText={errors.introductionName?.message}
                  fullWidth
                />
              </Grid>

              {/* Total Payments Section */}
              {/* <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Total Payments for Usports
                </Typography>
              </Grid> */}

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="EMI"
                  {...register("emi")}
                  error={!!errors.emi}
                  helperText={errors.emi?.message}
                  fullWidth
                  type="number"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Initial"
                  {...register("inital")}
                  error={!!errors.inital}
                  helperText={errors.inital?.message}
                  fullWidth
                  type="number"
                />
              </Grid>

              {/* LAND Details Section */}
              {/* <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  LAND Details
                </Typography>
              </Grid> */}

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Total Sq Feet"
                  {...register("totalSqFt")}
                  error={!!errors.totalSqFt}
                  helperText={errors.totalSqFt?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Sq Feet Amount"
                  {...register("sqFtAmount")}
                  error={!!errors.sqFtAmount}
                  helperText={errors.sqFtAmount?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Plot No"
                  {...register("plotNo")}
                  error={!!errors.plotNo}
                  helperText={errors.plotNo?.message}
                  fullWidth
                />
              </Grid>

              {/* MOD Selection */}
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Do you need MOD?</FormLabel>
                  <Controller
                    name="needMod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup 
                        row 
                        value={field.value} 
                        onChange={(e) => {
                          const newValue = e.target.value === 'true';
                          setIsMod(newValue);        
                          field.onChange(newValue);     
                        }}
                      >
                        <FormControlLabel
                          value
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.needMod && (
                    <Typography color="error" variant="caption">
                      {errors.needMod.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Registration Status */}
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Registration</FormLabel>
                  <Controller
                    name="registration"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="open"
                          control={<Radio />}
                          label="Booking opens"
                        />
                        <FormControlLabel
                          value="closed"
                          control={<Radio />}
                          label="Booking Closed"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.registration && (
                    <Typography color="error" variant="caption">
                      {errors.registration.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Conversion Section */}
              <Grid size={{ xs: 12 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Conversion</FormLabel>
                  <Controller
                    name="conversion"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup 
                        row 
                        value={field.value} 
                        onChange={(e) => field.onChange(e.target.value === 'true')}
                      >
                        <FormControlLabel
                          value
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                  {errors.conversion && (
                    <Typography color="error" variant="caption">
                      {errors.conversion.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Conditional NVT Customers for Conversion */}
              {conversion && (
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name="nvt"
                    render={({ field, fieldState }) => (
                      <CustomSelect
                        label="NVT Customers"
                        name="nvt"
                        value={field.value}
                        onChange={field.onChange}
                        options={options}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        
                      />
                    )}
                  />
                </Grid>
              )}

              {isMod && <MODFormdata data={modData} setData={setModData}/>}
              {isNvt && <div>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  NVT Details
                </Typography>
                <StaticTableData columns={columns} data={nvtTableData} />
                </div>
                }

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Submit')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default LFCForm;