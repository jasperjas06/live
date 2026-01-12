/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import { yupResolver } from '@hookform/resolvers/yup';
import { ContentCopy } from '@mui/icons-material';
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
    List,
    ListItem,
    ListItemText,
    styled,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSelect from 'src/custom/select/select';
import { DashboardContent } from 'src/layouts/dashboard';
import { DetailRow } from 'src/pages/LFC/view/ViewLFC';
import { /* checkEmi, */ createbilling, getAllCustomer, getAllEmi, getBillingById, updateEmployee } from 'src/utils/api.service';
import * as yup from 'yup';

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
    billingMonth: yup.string().required('Billing Month is required'),
    emi: yup.string(),
    status: yup.string().required('Status is required'),
    remarks: yup.string().notRequired(),
    modeOfPayment: yup.string().required('Mode Of Payment is required'),
    referenceId: yup.string().notRequired(),
    cardNo: yup.string().notRequired(),
    cardHolderName: yup.string().notRequired(),
    paymentDate: yup.string().required('Payment Date is required'),
    amount: yup.number().required('Amount is required'),
});

export interface BillingFormData {
    customerId: string;
    billingMonth: string;
    emi: string;
    modeOfPayment: string;
    referenceId?: string | undefined;
    cardNo?: string | undefined;
    cardHolderName?: string | undefined;
    paymentDate: string;
    status: string;
    remarks?: string | undefined;
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
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [emiOptions, setEmiOptions] = useState<any>([]);
    const [emiError, setEmiError] = useState<any>("")
    const [emiDialogOpen, setEmiDialogOpen] = useState(false);

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
        setValue,
        register,
    } = useForm<BillingFormData>({
        resolver: yupResolver(roleSchema) as any,
        defaultValues: {
            customerId: '',
            billingMonth: '',
            emi: '',
            modeOfPayment: '',
            referenceId: '',
            cardNo: '',
            cardHolderName: '',
            paymentDate: '',
            status: 'enquired',
            remarks: '',
            amount: 0
        },
    });


    const modeOfPayment = watch("modeOfPayment");
    const billingMonth = watch("billingMonth");

    const getBillById = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const response = await getBillingById(id);
            if (response?.data?.data) {
                const empData = response.data.data;
                reset({
                    customerId: empData.customerId || '',
                    billingMonth: empData.billingMonth || '',
                    emi: empData.emi || '',
                    modeOfPayment: empData.modeOfPayment || '',
                    referenceId: empData.referenceId || '',
                    cardNo: empData.cardNo || '',
                    cardHolderName: empData.cardHolderName || '',
                    paymentDate: empData.paymentDate || '',
                    status: empData.status || 'enquired',
                    remarks: empData.remarks || '',
                    amount: empData.amount || 0,
                });
                
                // Find and set the selected customer for display
                if (empData.customerId && customerOptions.length > 0) {
                    const foundCustomer = customerOptions.find((option: any) => option.value === empData.customerId);
                    if (foundCustomer) {
                        setSelectedCustomer(foundCustomer);
                    }
                }
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
                        id: item.id,
                        _id: item._id,
                        originalData: item,
                    }));
                    setCustomerOptions(newdata);
                    
                    // If we're editing and have customerId in form, find the customer
                    if (id) {
                        const formValues = watch();
                        if (formValues.customerId && newdata.length > 0) {
                            const foundCustomer = newdata.find((option: any) => option.value === formValues.customerId);
                            if (foundCustomer) {
                                setSelectedCustomer(foundCustomer);
                            }
                        }
                    }
                } else {
                    console.log("Failed to fetch customers:", res);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();
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
                        emiAmt: item.emiAmt,
                        date: item.date,
                        noOfInstallments: item.general?.noOfInstallments,
                        status: item.general?.status,
                        customerName: item.customer?.name,
                        customerPhone: item.customer?.phone,
                        marketerName: item.customer?.marketerName,
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

                    // Auto-fill EMI and amount for previous/current billing month
                    if (billingMonth === "previous" || billingMonth === "current") {
                        // Find the current month's EMI based on date
                        const currentDate = new Date();
                        const currentMonth = currentDate.getMonth();
                        const currentYear = currentDate.getFullYear();

                        const currentMonthEmi = newdata.find((emi: any) => {
                            const emiDate = new Date(emi.date);
                            return emiDate.getMonth() === currentMonth && emiDate.getFullYear() === currentYear;
                        });

                        if (currentMonthEmi) {
                            // Set EMI ID
                            setValue('emi', currentMonthEmi.value, { shouldValidate: true });
                            // Set Amount
                            setValue('amount', currentMonthEmi.emiAmt, { shouldValidate: true });
                            // Clear any previous EMI error
                            setEmiError("");
                        } else {
                            // If no EMI found for current month, try to get the first unpaid EMI
                            if (newdata.length > 0) {
                                setValue('emi', newdata[0].value, { shouldValidate: true });
                                setValue('amount', newdata[0].emiAmt, { shouldValidate: true });
                                setEmiError("");
                            }
                        }
                    } else if (billingMonth === "advance") {
                        // Clear fields for advance billing
                        setValue('emi', '', { shouldValidate: false });
                        setValue('amount', 0, { shouldValidate: false });
                        setEmiError("");
                    }
                } else {
                    console.log("Failed to fetch customers:", res);
                    if (res.data === null) {
                        toast.error("Estimation not found for selected customer");
                    }
                    setEmiOptions([]);
                }
            } catch (error: any) {
                setEmiOptions([]);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [cusId, billingMonth, setValue]);

    // Auto-fill payment date based on billing month
    useEffect(() => {
        // Always auto-fill with current date in YYYY-MM-DD format regardless of billing month to prevent malpractice
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setValue('paymentDate', formattedDate, { shouldValidate: true });
    }, [billingMonth, setValue]);

    useEffect(() => {
        if (id) {
            getBillById();
        }
    }, [id]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            console.log(data, "data");
            // let checkEmiCorrect = await checkEmi({ customerId: data.customerId, emiId: data.emi })
            // if (checkEmiCorrect.status !== 200) {
            //     setEmiError(checkEmiCorrect.message || "Something went wrong in emi field try again");
            //     return
            // }

            // Transform form data to match API expectations
            const apiData = {
                customerId: data.customerId,
                // generalId: data.emi, // Map emi to generalId - Commented out for future use
                modeOfPayment: data.modeOfPayment,
                referenceId: data.referenceId,
                cardNo: data.cardNo,
                cardHolderName: data.cardHolderName,
                paymentDate: data.paymentDate,
                status: data.status,
                amount: data.amount,
                billFor: data.billingMonth, // Map billingMonth to billFor
                remarks: data.remarks,
            };

            const response = id
                ? await updateEmployee({ ...apiData, _id: id })
                : await createbilling(apiData);

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

    const handleCopyEmi = (emiId: string, emiLabel: string, emiAmount: number) => {
        // Update the form field with the EMI ID
        setValue('emi', emiId, { shouldValidate: true });

        // Auto-fill the amount field with the EMI amount
        setValue('amount', emiAmount, { shouldValidate: true });

        // Copy to clipboard
        navigator.clipboard.writeText(emiId);

        // Clear any previous EMI error
        setEmiError("");

        // Show success message
        toast.success(`EMI #${emiLabel} copied and amount filled`);

        // Close dialog
        setEmiDialogOpen(false);
    };

    const handleClose = () => {
        navigate(-1);
        reset();
    };

    // Helper function for highlighting search terms
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
                                        <Autocomplete
                                            options={customerOptions}
                                            getOptionLabel={(option) => {
                                                // Display format: "Name (Identifier)"
                                                const identifier = option.id || option._id;
                                                return `${option.label} (${identifier})`;
                                            }}
                                            loading={loading}
                                            value={selectedCustomer}
                                            onChange={(event, newValue) => {
                                                setSelectedCustomer(newValue);
                                                const selectedId = newValue?.value || '';
                                                setValue('customerId', selectedId, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                                setCusId(selectedId);
                                                
                                                // Reset all auto-filled fields when customer changes
                                                setValue('billingMonth', '', { shouldValidate: false });
                                                setValue('emi', '', { shouldValidate: false });
                                                setValue('amount', 0, { shouldValidate: false });
                                                setValue('paymentDate', '', { shouldValidate: false });
                                                setEmiError("");
                                            }}
                                            filterOptions={(options, { inputValue }) => {
                                                const searchTerm = inputValue.toLowerCase().trim();
                                                
                                                if (!searchTerm) return options;
                                                
                                                return options.filter(option => {
                                                    // Search in name, id, and _id
                                                    const nameMatch = option.label?.toLowerCase().includes(searchTerm);
                                                    const idMatch = option.id?.toLowerCase().includes(searchTerm);
                                                    const _idMatch = option._id?.toLowerCase().includes(searchTerm);
                                                    
                                                    return nameMatch || idMatch || _idMatch;
                                                });
                                            }}
                                            renderOption={(props, option, { inputValue }) => {
                                                // Determine which identifier to display
                                                const displayIdentifier = option.id ? option.id : option._id;
                                                const searchTerm = inputValue.toLowerCase().trim();
                                                
                                                return (
                                                    <li {...props} key={option.value}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                    {highlightText(option.label, searchTerm)}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                                                    {highlightText(displayIdentifier, searchTerm)}
                                                                </Typography>
                                                            </Box>
                                                            {option.originalData?.email && (
                                                                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                                                                    {highlightText(option.originalData.email, searchTerm)}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={
                                                        <>
                                                            Customer <span style={{ color: 'red' }}>*</span>
                                                        </>
                                                    }
                                                    error={!!errors.customerId}
                                                    helperText={errors.customerId?.message}
                                                    placeholder="Search by name, ID, or customer ID..."
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <>
                                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            noOptionsText="No customers found"
                                        />
                                        {/* Hidden input to register customerId with react-hook-form */}
                                        <input type="hidden" {...register('customerId')} />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="billingMonth"
                                            defaultValue=""
                                            rules={{ required: "Billing Month is required" }}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    label="Billing Month"
                                                    name="billingMonth"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const selected = e.target.value;
                                                        field.onChange(selected);
                                                    }}
                                                    options={[
                                                        { value: "advance", label: "Advance" },
                                                        { value: "previous", label: "Previous" },
                                                        { value: "current", label: "Current" },
                                                    ]}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* EMI Field - Commented out for future use */}
                                    {/* <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            name="emi"
                                            control={control}
                                            rules={{ required: 'Emi is required' }}
                                            render={({ field, fieldState }) => {
                                                // Find the selected EMI to display its label
                                                const selectedEmi = emiOptions.find((emi: any) => emi.value === field.value);
                                                const displayValue = selectedEmi ? `EMI #${selectedEmi.label}` : field.value;
                                                const isDisabled = billingMonth === "previous" || billingMonth === "current";

                                                return (
                                                    <>
                                                        <TextField
                                                            {...field}
                                                            value={displayValue}
                                                            label="Emi"
                                                            type="text"
                                                            fullWidth
                                                            disabled={isDisabled}
                                                            error={!!fieldState.error || !!emiError}
                                                            helperText={fieldState.error?.message || emiError}
                                                            InputProps={{
                                                                endAdornment: cusId && !isDisabled && (
                                                                    <IconButton
                                                                        onClick={() => setEmiDialogOpen(true)}
                                                                        edge="end"
                                                                        color="primary"
                                                                        title="View all EMIs"
                                                                        sx={{ mr: -1 }}
                                                                    >
                                                                        <Visibility />
                                                                    </IconButton>
                                                                )
                                                            }}
                                                        />
                                                    </>
                                                );
                                            }}
                                        />
                                    </Grid> */}

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            name="amount"
                                            control={control}
                                            rules={{ required: 'Amount is required' }}
                                            render={({ field, fieldState }) => {
                                                const isDisabled = billingMonth === "previous" || billingMonth === "current";
                                                
                                                return (
                                                    <TextField
                                                        {...field}
                                                        label="Amount"
                                                        type="number"
                                                        fullWidth
                                                        disabled={isDisabled}
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                );
                                            }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                        <Controller
                                            name="paymentDate"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: 'Payment Date is required' }}
                                            render={({ field, fieldState }) => {
                                                // Always disable to prevent malpractice
                                                const isDisabled = true;
                                                
                                                return (
                                                    <TextField
                                                        {...field}
                                                        label="Payment Date"
                                                        type="date"
                                                        fullWidth
                                                        disabled={isDisabled}
                                                        InputLabelProps={{ shrink: true }}
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                );
                                            }}
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

                                    {(modeOfPayment.toLowerCase() === "card" || modeOfPayment.toLowerCase() === "online") && (
                                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                            <Controller
                                                control={control}
                                                name="referenceId"
                                                defaultValue=""
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Reference ID"
                                                        fullWidth
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )}

                                    {modeOfPayment.toLowerCase() === "card" && (
                                        <>
                                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                                <Controller
                                                    control={control}
                                                    name="cardNo"
                                                    defaultValue=""
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
                                            defaultValue="enquired"
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

                            {/* EMI Selection Dialog */}
                            <Dialog
                                open={emiDialogOpen}
                                onClose={() => setEmiDialogOpen(false)}
                                maxWidth="sm"
                                fullWidth
                            >
                                <DialogTitle>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                        Available EMIs
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Click copy to paste EMI ID to the field
                                    </Typography>
                                </DialogTitle>

                                <DialogContent dividers>
  {emiOptions.length === 0 ? (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography color="text.secondary">
        No unpaid EMIs found for this customer
      </Typography>
    </Box>
  ) : (
    <List sx={{ p: 0 }}>
      {emiOptions.map((emi:any, index:number) => (
        <React.Fragment key={emi.value}>
          <ListItem
            sx={{
              "&:hover": {
                backgroundColor: "action.hover",
              },
              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              px: 2,
              py: 1.5,
              mb: 1.5,
              border: "1px solid #e0e0e0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    EMI #{emi.label}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    ID: {emi.value}
                  </Typography>
                }
              />

              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopy />}
                onClick={() => handleCopyEmi(emi.value, emi.label, emi.emiAmt)}
                sx={{ ml: 2 }}
              >
                Copy
              </Button>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* EMI Details Section */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 1,
                width: "100%",
              }}
            >
              <DetailRow label="EMI Amount" value={`₹ ${emi.emiAmt}`} />
              <DetailRow
                label="Date"
                value={new Date(emi.date).toLocaleDateString()}
              />
              <DetailRow
                label="Installments"
                value={emi.noOfInstallments || "N/A"}
              />
              <DetailRow label="Status" value={emi.status || "N/A"} />
              <DetailRow
                label="Customer Name"
                value={emi.customerName || "N/A"}
              />
              <DetailRow
                label="Customer Phone"
                value={emi.customerPhone || "N/A"}
              />
              <DetailRow
                label="Marketer Name"
                value={emi.marketerName || "N/A"}
              />
            </Box>
          </ListItem>

          {index < emiOptions.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  )}
</DialogContent>


                                <DialogActions>
                                    <Button onClick={() => setEmiDialogOpen(false)} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </form>
                    )}
                </CardContent>
            </StyledCard>
        </DashboardContent>
    );
};

export default BillingForm;