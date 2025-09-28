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
import { createbilling, createEmployee, getAllCustomer, getAllEmi, getAllRoles, getBillingById, getEmployeeById, updateEmployee } from 'src/utils/api.service';
import CustomSelect from 'src/custom/select/select';

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
    customerId: yup.string().required('Customer is required'),
    emi: yup.string().required('Emi is required'),
    status: yup.string().required('Status is required'),
    remarks: yup.string().required('Remarks is required'),
    modeOfPayment: yup.string().required('Mode Of Payment is required'),
    saleType: yup.string().required('Sale Type is required'),
    paymentDate: yup.string().required('Payment Date is required'),
    amount: yup.number().required('Amount is required'),
});

export interface BillingFormData {
    customerId: string;
    emi: string;
    modeOfPayment: string;
    cardNo?: string;
    cardHolderName?: string;
    paymentDate: string;
    saleType: string;
    status: string;
    remarks: string;
    amount: number;
}

/*************  ✨ Windsurf Command 🌟  *************/
/**
 * BillingForm component
 * This component is used to create or edit an employee's information.
 * It fetches all roles and then fetches the employee data if an id is provided.
 * It uses React Hook Form to handle form validation and submission.
 *
 * @returns {JSX.Element} The BillingForm component
 */
const BillingForm = () => {
    /**
     * State to track if the form is loading or submitting
     */
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [customerOptions, setCustomerOptions] = useState<any>([]);
    const [emiOptions, setEmiOptions] = useState<any>([]);

    const [cusId, setCusId] = useState<any>("")

    /**
     * Get the id from the URL parameters
     */
    const { id } = useParams();

    /**
     * Navigate to the previous page
     */
    const navigate = useNavigate();

    /**
     * State to track all roles
     */
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<BillingFormData>({
        resolver: yupResolver(roleSchema),
        defaultValues: {
            customerId: '',
            emi: '',
            modeOfPayment: '',
            cardNo: '',
            cardHolderName: '',
            paymentDate: '',
            saleType: '',
            status: '',
            remarks: '',
            amount:0
        },
    });


    const modeOfPayment = watch("modeOfPayment");

    const getBillById = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await getBillingById(id);
            if (response?.data?.data) {
                const empData = response.data.data;
                reset({
                    customerId: empData.customerId || '',
                    emi: empData.emi || '',
                    modeOfPayment: empData.modeOfPayment || '',
                    cardNo: empData.cardNo || '',
                    cardHolderName: empData.cardHolderName || '',
                    paymentDate: empData.paymentDate || '',
                    saleType: empData.saleType || '',
                    status: empData.status || '',
                    remarks: empData.remarks || '',
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
                    setCustomerOptions(newdata);
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
        // return setLoading(false)
    }, [id]);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                if (!cusId) {
                    return;
                }
                const res = await getAllEmi({ customerId: cusId, paid: "false" });
                console.log(res, "res");
                if (res.status === 200) {
                    const newdata = res.data.data.map((item: any, index: number) => ({
                        value: item._id,
                        label: item.emiNo,
                    }))
                    newdata.sort((a: any, b: any) => {
                        if (a.label < b.label) {
                            return -1;
                        }
                        if (a.label > b.label) {
                            return 1;
                        }
                        return 0;
                    })
                    setEmiOptions(newdata);
                } else {
                    console.log("Failed to fetch customers:", res);
                    if(res.data === null){
                        toast.error("Emi not found for selected customer");
                    }
                    setEmiOptions([]);
                }
                // await getUpdateData();
            } catch (error: any) {
                setEmiOptions([]);
                // console.log("kuma");
                // toast.error(error.response.data.error === "emi not found in db" ? "Emi not found for this customer" : error.response.data.error || 'Emi not found for this customer');
            } finally {
                setLoading(false);
            }
        };

        getData();
        // return setLoading(false)
    }, [cusId]);

    useEffect(() => {
        if (id) {
            getBillById();
        }
    }, [id]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = id
                ? await updateEmployee({ ...data, _id: id })
                : await createbilling(data);

            if (response.status === 200) {
                toast.success(response.message);
                navigate(-1);
            } else {
                console.error('Submission error 1:', response);
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error('Submission error:', error);
            toast.error(error.message || 'Failed to save billing');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (id) {
            getBillById();
        }
    }, [id]);

    const handleClose = () => {
        navigate(-1);
        reset();
    };

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
                {id ? 'Edit Billing' : 'Create Billing'}
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
                                <SectionTitle variant="h6">Billing Information</SectionTitle>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="customerId"
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
                                                    options={customerOptions}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="emi"
                                            defaultValue=""
                                            rules={{ required: "Emi is required" }}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    label="Emi"
                                                    name="emi"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const selectedId = e.target.value;
                                                        field.onChange(selectedId); // updates RHF form state
                                                        // setCusId(selectedId);       // updates local state
                                                    }}
                                                    disabled={cusId ? false : true}
                                                    options={emiOptions}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="saleType"
                                            defaultValue=""
                                            rules={{ required: "Sale Type is required" }}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    label="Sale Type"
                                                    name="saleType"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const selectedId = e.target.value;
                                                        field.onChange(selectedId); // updates RHF form state
                                                        // setCusId(selectedId);       // updates local state
                                                    }}
                                                    options={[
                                                        { value: 'plot', label: 'Plot' },
                                                        { value: 'flat', label: 'Flat' },
                                                        { value: 'villa', label: 'Villa' },
                                                    ]}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* //Amount */}
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            name="amount"
                                            control={control}
                                            // defaultValue=0
                                            rules={{ required: 'Amount is required' }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    label="Amount"
                                                    type="number"
                                                    fullWidth
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            name="paymentDate"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: 'Payment Date is required' }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    label="Payment Date"
                                                    type="date"
                                                    fullWidth
                                                    InputLabelProps={{ shrink: true }}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="modeOfPayment"
                                            defaultValue=""
                                            rules={{ required: "Mode of Payment is required" }}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    label="Mode of Payment"
                                                    name="modeOfPayment"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const selected = e.target.value;
                                                        field.onChange(selected);
                                                    }}
                                                    options={[
                                                        { value: "card", label: "Card" },
                                                        { value: "cash", label: "Cash" },
                                                        { value: "online", label: "Online" },
                                                    ]}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {modeOfPayment.toLowerCase() === "card" && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                                <Controller
                                                    control={control}
                                                    name="cardNo"
                                                    defaultValue=""
                                                    rules={{
                                                        required: "Card Number is required",
                                                        pattern: {
                                                            value: /^(\d{4}-){3}\d{4}$/,
                                                            message: "Enter valid card number (1234-5678-9012-3456)",
                                                        },
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Card Number"
                                                            fullWidth
                                                            inputProps={{ maxLength: 19 }}
                                                            onChange={(e) => {
                                                                let value = e.target.value.replace(/\D/g, "");
                                                                value = value.slice(0, 16);
                                                                let formatted = value.match(/.{1,4}/g)?.join("-") || "";
                                                                field.onChange(formatted);
                                                            }}
                                                            value={field.value}
                                                            error={!!fieldState.error}
                                                            helperText={fieldState.error?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                                <Controller
                                                    control={control}
                                                    name="cardHolderName"
                                                    defaultValue=""
                                                    rules={{ required: "Card Holder Name is required" }}
                                                    render={({ field, fieldState }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Card Holder Name"
                                                            fullWidth
                                                            error={!!fieldState.error}
                                                            helperText={fieldState.error?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="status"
                                            defaultValue=""
                                            rules={{ required: "Status is required" }}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    label="Status"
                                                    name="status"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const selected = e.target.value;
                                                        field.onChange(selected);
                                                    }}
                                                    options={[
                                                        { value: "enquired", label: "Enquired" },
                                                        { value: "blocked", label: "Blocked" }
                                                    ]}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            control={control}
                                            name="remarks"
                                            defaultValue=""
                                            rules={{
                                                maxLength: { value: 200, message: "Remark cannot exceed 200 characters" },
                                            }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    label="Remarks"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    placeholder="Enter any remarks here..."
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
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

export default BillingForm;