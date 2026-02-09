import type { Column } from 'src/custom/dataTable/dataTable';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaidIcon from "@mui/icons-material/Paid";
import SquareFootIcon from "@mui/icons-material/SquareFoot";

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    linearProgressClasses,
    Typography
} from '@mui/material';

import { deleteCustomer, getCommissionByCustomerId, getOneEstimateByGeneralId } from 'src/utils/api.service';

import { PercentIcon } from 'lucide-react';
import { varAlpha } from 'minimal-shared/utils';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

type Customer = {
    id: string;
    name: string;
    marketer: string;
    saleType: string;
    noEmiPaid: number;
    noEmiPending: number;
};

type Plot = {
    id: string;
    guideRatePerSqFt?: number;
    guideLandValue?: number;
    landValue?: number;
    regValue?: number;
    additionalCharges?: number;
    totalValue?: number;
}

type EMI = {
    id: string;
    emiId: string;
    emiNo: number;
    date: Date;
    emiAmt: number;
    paidDate?: Date;
    paidAmt?: number;
}

type Billing = {
    introducer: string;
    emiNo: number;
    modeOfPayment: string;
    transactionType: string;
    cardNo?: string;
    cardHolderName?: string;
    paymentDate: Date;
    amountPaid: number;
    balanceAmount: number;
    status: string;
    remarks?: string;
    editDeleteReason?: string;
}

type Marketer = {
    emiNo: number;
    marketerName: string;
    paidDate: string;
    paidAmt: Number;
    commPercentage: Number;
    commAmount: Number;
    percentage: number;
}

type Flat = {
    flat: string;
    block: string;
    floor: string;
    bedRoom: number;
    guideRateSqft: number;
    paymentTerm: string;
    totalValue: number;
    udsSqft: number;
    propertyTax: number;
    carPark: string;
    onBookingPercent: number;
    lintelPercent: number;
    roofPercent: number;
    plasterPercent: number;
    flooringPercent: number;
    landValue: number;
    landRegValue: number;
    constCost: number;
    constRegValue: number;
    carParkCost: number;
    ebDeposit: number;
    sewageWaterTax: number;
    gst: number;
    corpusFund: number;
    additionalCharges: number;
}

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode | any;
}) => (
    <Box display="flex" alignItems="center" mb={2}>
        <Box mr={2}>{icon}</Box>
        <Box flex={1}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="subtitle2" fontWeight={500}>
                {value}
            </Typography>
        </Box>
    </Box>
);

const RenderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

const CustomerDetails = () => {

    const { estimateId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [loading , setLoading] = useState<boolean>(false);
    const [emiData, setEmiData] = useState<any[]>([]);
    const [flotData, setFlotData] = useState<any>({});
    const [plotData, setPlotData] = useState<any>({});
    const [billingData, setBillingData] = useState<any[]>([]);
    const [marketerData, setMarketerData] = useState<any[]>([]);
    const [customerId, setCustomerId] = useState<string>('');

    const formatDate = (dateString: any) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        // Format: DD-MM-YYYY
        return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/ /g, '-')
    }

    const getCustomerData = async () => {
        try {
            setLoading(true)
            const res = await getOneEstimateByGeneralId({
                genId: estimateId
            });
            if (res?.status === 200) {
                console.log(res, "res");
                
                // Store customer ID for commission API call
                const cusId = res.data.data.general?.customer?._id || res.data.data.general?.customer;
                if (cusId) {
                    setCustomerId(cusId);
                }
                
                if (res.data.data.emi.length > 0) {
                    let emiData = res?.data.data.emi.map((item: any) => {
                        return {
                            id: item._id || 'N/A',
                            emiId: item._id || 'N/A',
                            emiNo: item.emiNo || 'N/A',
                            date: item.date || 'N/A',
                            emiAmt: item.emiAmt || 'N/A',
                            paidDate: formatDate(item.paidDate),
                            paidAmt: item.paidAmt || '',
                        }
                    })
                    setEmiData(emiData)
                }
                if (res.data.data.plot.length > 0) {
                    let plotData = res?.data.data.plot.map((item: any) => {
                        return {
                            id: item._id || 'N/A',
                            guideRatePerSqFt: item.guideRatePerSqFt || 'N/A',
                            guideLandValue: item.guideLandValue || 'N/A',
                            landValue: item.landValue || 'N/A',
                            regValue: item.regValue || 'N/A',
                            additionalCharges: item.additionalCharges || 'N/A',
                            totalValue: item.totalValue || 'N/A',
                        }
                    })
                    setPlotData(res?.data.data.plot[0])
                }
                if (res.data.data.flat.length > 0) {
                    let flotData = res?.data.data.flat.map((item: any) => {
                        return {
                            flat: item.flat || 'N/A',
                            block: item.block || 'N/A',
                            floor: item.floor || 'N/A',
                            bedRoom: item.bedRoom || 'N/A',
                            guideRateSqft: item.guideRateSqft || 'N/A',
                            paymentTerm: item.paymentTerm || 'N/A',
                            totalValue: item.totalValue || 'N/A',
                        }
                    })
                    setFlotData(res?.data.data.flat[0])
                }
                if (res.data.data.billing.length > 0) {
                    let billingData = res?.data.data.billing.map((item: any) => {
                        return {
                            id: item._id || 'N/A',
                            introducer: item.introducer?.name || 'N/A',
                            emiNo: item.emiNo || 'N/A',
                            modeOfPayment: item.modeOfPayment || 'N/A',
                            transactionType: item.transactionType || 'N/A',
                            cardNo: item?.cardNo || 'N/A',
                            cardHolderName: item?.cardHolderName || 'N/A',
                            paymentDate: formatDate(item.paymentDate),
                            amountPaid: item.amountPaid || 'N/A',
                            balanceAmount: item.balanceAmount || 'N/A',
                            status: item.status || 'N/A',
                            remarks: item.remarks || 'N/A',
                            editDeleteReason: item.editDeleteReason || 'N/A',
                        }
                    })
                    setBillingData(billingData)
                }
            }
        } catch (error) {
            setData([])
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    const getCommissionData = async () => {
        if (!customerId) return;
        
        try {
            const res = await getCommissionByCustomerId(customerId);
            if (res?.status === 200 && res.data?.data?.length > 0) {
                console.log(res, "commission res");
                // Flatten the marketer array from each EMI record
                let marketerData: any[] = [];
                res.data.data.forEach((item: any) => {
                    // Each item has an emi object and a marketer array
                    const emiInfo = item.emi || {};
                    const marketers = item.marketer || [];
                    
                    // Process each marketer in the array
                    marketers.forEach((marketer: any) => {
                        marketerData.push({
                            id: item._id || '-',
                            emiNo: emiInfo.emiNo || '-',
                            marketerName: marketer.marketerId?.name || '-',
                            paidDate: formatDate(emiInfo.paidDate) || '-',
                            paidAmt: emiInfo.paidAmt || '-',
                            commPercentage: marketer.percentage || '-',
                            commAmount: marketer.commAmount || '-'
                        });
                    });
                });
                setMarketerData(marketerData);
            }
        } catch (error) {
            console.log('Commission fetch error:', error);
        }
    };

    useEffect(() => {
        getCustomerData();
    }, [estimateId]);

    useEffect(() => {
        if (customerId) {
            getCommissionData();
        }
    }, [customerId]);

    const formatCurrency = (amount: number) => {
        if (!amount) return 'N/A'
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const emiColumns: Column<EMI>[] = [
        { id: 'emiNo', label: 'Emi No', sortable: true },
        { id: 'emiId', label: 'Emi Id', sortable: true },
        { id: 'date', label: 'Date', sortable: true },
        { id: 'paidDate', label: 'Paid Date', sortable: true },
        { id: 'paidAmt', label: 'Paid Amount', sortable: true },
    ];

    const billingColumns: Column<Billing>[] = [
        { id: 'emiNo', label: 'Emi No', sortable: true },
        { id: 'introducer', label: 'Introducer', sortable: true },
        { id: 'modeOfPayment', label: 'Mode Of Payment', sortable: true },
        { id: 'paymentDate', label: 'Payment Date', sortable: true },
        { id: 'amountPaid', label: 'Amount Paid', sortable: true },
        { id: 'balanceAmount', label: 'Balance Amount', sortable: true },
        { id: 'status', label: 'Status', sortable: true },
    ]

    const marketerColumns: Column<Marketer>[] = [
        { id: 'marketerName', label: 'Name', sortable: true },
        { id: 'emiNo', label: 'Emi No', sortable: true },
        { id: 'paidDate', label: 'Paid Date', sortable: true },
        { id: 'paidAmt', label: 'Paid Amount', sortable: true },
        { id: 'commPercentage', label: 'Commission Percentage', sortable: true },
        { id: 'commAmount', label: 'Commission Amount', sortable: true },
        // { id: 'percentage', label: 'Percentage', sortable: true },
    ]


    const handleDelete = async (id: string | number) => {
        const confirmed = window.confirm('Are you sure you want to delete this customer?');
        if (!confirmed) return;

        try {
            await deleteCustomer(String(id)); // convert to string if needed by API
            getCustomerData(); // re-fetch data (not getAllCustomer again)
        } catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };


    return (
        <DashboardContent>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Estimate Complete Details
                </Typography>
            </Box>
            {loading ? <RenderFallback /> : <>
            {Object.keys(flotData).length > 0 && <Grid >
                <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                        {/* Title */}
                        <Box display="flex" alignItems="center" mb={2}>
                            <HomeIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight={600}>
                                Flat Overview
                            </Typography>
                        </Box>

                        {/* --- BASIC DETAILS --- */}
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Basic Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container  >
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <InfoRow label="Flat" value={flotData.flat} icon={<HomeIcon />} />
                                <InfoRow label="Block" value={flotData.block} icon={<BusinessIcon />} />
                                <InfoRow label="Floor" value={flotData.floor} icon={<LocationCityIcon />} />
                                <InfoRow label="Bedroom(s)" value={flotData.bedRoom} icon={<MeetingRoomIcon />} />
                                <InfoRow label="UDS Sqft" value={flotData.udsSqft} icon={<SquareFootIcon />} />
                                <InfoRow
                                    label="Guide Rate (per sqft)"
                                    value={formatCurrency(flotData.guideRateSqft)}
                                    icon={<MonetizationOnIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <InfoRow
                                    label="Property Tax"
                                    value={formatCurrency(flotData.propertyTax)}
                                    icon={<AccountBalanceIcon />}
                                />
                                <InfoRow
                                    label="Car Parking"
                                    value={flotData.carPark}
                                    icon={<LocalParkingIcon />}
                                />
                                <InfoRow label="On Booking %" value={`${flotData.onBookingPercent}%`} icon={<PercentIcon />} />
                                <InfoRow label="Lintel %" value={`${flotData.lintelPercent}%`}  icon={<PercentIcon />} />
                                <InfoRow label="Roof %" value={`${flotData.roofPercent}%`}  icon={<PercentIcon />} />
                                <InfoRow label="Plaster %" value={`${flotData.plasterPercent}%`}  icon={<PercentIcon />} />
                                <InfoRow label="Flooring %" value={`${flotData.flooringPercent}%`}  icon={<PercentIcon />} />
                            </Grid>
                        </Grid>

                        {/* --- FINANCIAL DETAILS --- */}
                        <Typography variant="subtitle1" fontWeight={600} mt={3} gutterBottom>
                            Financial Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <InfoRow label="Land Value" value={formatCurrency(flotData.landValue)} icon={<PaidIcon />}  />
                                <InfoRow
                                    label="Land Registration Value"
                                    value={formatCurrency(flotData.landRegValue)}
                                    icon={<PaidIcon />}
                                />
                                <InfoRow
                                    label="Construction Cost"
                                    value={formatCurrency(flotData.constCost)}
                                    icon={<PaidIcon />}
                                />
                                <InfoRow
                                    label="Construction Reg. Value"
                                    value={formatCurrency(flotData.constRegValue)}
                                    icon={<PaidIcon />}
                                />
                                <InfoRow label="Car Park Cost" value={formatCurrency(flotData.carParkCost)} icon={<PaidIcon />} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                                <InfoRow label="EB Deposit" value={formatCurrency(flotData.ebDeposit)} icon={<PaidIcon />} />
                                <InfoRow
                                    label="Sewage & Water Tax"
                                    value={formatCurrency(flotData.sewageWaterTax)}
                                    icon={<PaidIcon />}
                                />
                                <InfoRow label="GST" value={formatCurrency(flotData.gst)} icon={<PaidIcon />} />
                                <InfoRow label="Corpus Fund" value={formatCurrency(flotData.corpusFund)} icon={<PaidIcon />} />
                                <InfoRow
                                    label="Additional Charges"
                                    value={formatCurrency(flotData.additionalCharges)}
                                    icon={<PaidIcon />}
                                />
                                <InfoRow
                                    label="Total Value"
                                    value={formatCurrency(flotData.totalValue)}
                                    icon={<PaidIcon />}
                                />
                            </Grid>
                        </Grid>

                        {/* Payment Term */}
                        <Box display="flex" alignItems="center" mt={2}>
                            <Typography variant="body2" color="text.secondary" mr={1}>
                                Payment Term:
                            </Typography>
                            <Chip
                                label={flotData.paymentTerm}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>}
            {Object.keys(plotData).length > 0 &&  <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Plot Overview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <InfoRow label="Guide Rate (per sqft)" value={plotData.guideRatePerSqFt} icon={<MonetizationOnIcon />} />
                            <InfoRow label="Guide Land Value" value={plotData.guideLandValue} icon={<MonetizationOnIcon />} />
                            <InfoRow label="Land Value" value={plotData.landValue} icon={<MonetizationOnIcon />} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <InfoRow label="Registration Value" value={plotData.regValue} icon={<MonetizationOnIcon />} />
                            <InfoRow label="Additional Charges" value={plotData.additionalCharges} icon={<MonetizationOnIcon />} />
                            <InfoRow label="Total Value" value={plotData.totalValue} icon={<PaidIcon />} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                EMI
            </Typography>

            <Card>
                <DataTable
                    title="Customer Table"
                    data={emiData}
                    columns={emiColumns}
                    searchBy="emiId"
                    onDelete={handleDelete}
                    onDropDown= {false}
                />
            </Card>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Billings
            </Typography>
            <Card>
                <DataTable
                    title="Customer Table"
                    data={billingData}
                    columns={billingColumns}
                    searchBy="name"
                    onDelete={handleDelete}
                    onDropDown= {false}
                />
            </Card>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Marketer
            </Typography>
            <Card>
                <DataTable
                    title="Customer Table"
                    data={marketerData}
                    columns={marketerColumns}
                    searchBy="name"
                    onDelete={handleDelete}
                    onDropDown= {false}
                />
            </Card>
            </>
            }
        </DashboardContent>
    );
};

export default CustomerDetails;