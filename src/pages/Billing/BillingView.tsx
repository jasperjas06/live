import { Box, Typography, Card, CardContent, Grid, Chip, Button, Backdrop, CircularProgress, Divider } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBillingsByCustomerId } from 'src/utils/api.service'

const BillingView = () => {
    const [data, setData] = useState<any>({})
    const [loading, setLoading] = useState(true)
    const { id } = useParams()

    const getData = async () => {
        try {
            setLoading(true)
            const response = await getBillingsByCustomerId(id)
            console.log(response.data.data, "response billing view")
            if (response.data && response.data.data) {
                setData(response.data.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) getData()
    }, [id])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        const statusColors: any = {
            'Blocked': 'error',
            'Active': 'success',
            'Pending': 'warning',
            'Enquired': 'info',
            'Completed': 'success'
        }
        return statusColors[status] || 'default'
    }

    const downloadAsExcel = () => {
        const worksheetData: any[][] = []

        // Title
        worksheetData.push(['BILLING DETAILS REPORT'])
        worksheetData.push([])

        // Transaction Information
        worksheetData.push(['TRANSACTION INFORMATION'])
        worksheetData.push(['Transaction Type', data.transactionType || 'N/A'])
        worksheetData.push(['Mobile Number', data.mobileNo || 'N/A'])
        worksheetData.push(['Customer Name', data.customerName || 'N/A'])
        worksheetData.push(['Sale Type', data.saleType || 'N/A'])
        worksheetData.push(['Status', data.status || 'N/A'])
        worksheetData.push(['Remarks', data.remarks || 'N/A'])
        worksheetData.push(['Created Date', formatDate(data.createdAt)])
        worksheetData.push(['Updated Date', formatDate(data.updatedAt)])
        worksheetData.push([])

        // Payment Details
        worksheetData.push(['PAYMENT DETAILS'])
        worksheetData.push(['Mode of Payment', data.modeOfPayment || 'N/A'])
        worksheetData.push(['Amount Paid', formatCurrency(data.amountPaid)])
        worksheetData.push(['Balance Amount', formatCurrency(data.balanceAmount)])
        worksheetData.push(['Payment Date', formatDate(data.paymentDate)])
        if (data.cardNo) {
            worksheetData.push(['Card Number', data.cardNo])
            worksheetData.push(['Card Holder Name', data.cardHolderName || 'N/A'])
        }
        worksheetData.push([])

        // Customer Information
        if (data.customer) {
            worksheetData.push(['CUSTOMER INFORMATION'])
            worksheetData.push(['Name', data.customer.name || 'N/A'])
            worksheetData.push(['Phone', data.customer.phone || 'N/A'])
            worksheetData.push(['Email', data.customer.email || 'N/A'])
            worksheetData.push(['Address', data.customer.address || 'N/A'])
            worksheetData.push(['City', data.customer.city || 'N/A'])
            worksheetData.push(['State', data.customer.state || 'N/A'])
            worksheetData.push(['Pincode', data.customer.pincode || 'N/A'])
            worksheetData.push(['Marketer Name', data.customer.marketerName || 'N/A'])
            worksheetData.push([])
        }

        // EMI Details
        if (data.emi) {
            worksheetData.push(['EMI DETAILS'])
            worksheetData.push(['EMI Number', data.emiNo || 'N/A'])
            worksheetData.push(['EMI Amount', formatCurrency(data.emi.emiAmt)])
            worksheetData.push(['Paid Amount', formatCurrency(data.emi.paidAmt)])
            worksheetData.push(['Paid Date', formatDate(data.emi.paidDate)])
            worksheetData.push(['Due Date', formatDate(data.emi.date)])
            worksheetData.push([])
        }

        // General Information
        if (data.general) {
            worksheetData.push(['GENERAL INFORMATION'])
            worksheetData.push(['Payment Terms', data.general.paymentTerms || 'N/A'])
            worksheetData.push(['EMI Amount', formatCurrency(data.general.emiAmount)])
            worksheetData.push(['Number of Installments', data.general.noOfInstallments || 'N/A'])
            worksheetData.push(['Status', data.general.status || 'N/A'])
            worksheetData.push(['Loan', data.general.loan || 'N/A'])
            worksheetData.push(['Offered', data.general.offered || 'N/A'])
            worksheetData.push([])
        }

        // Introducer Information
        if (data.introducer) {
            worksheetData.push(['INTRODUCER INFORMATION'])
            worksheetData.push(['Name', data.introducer.name || 'N/A'])
            worksheetData.push(['Phone', data.introducer.phone || 'N/A'])
            worksheetData.push(['Email', data.introducer.email || 'N/A'])
            worksheetData.push(['Gender', data.introducer.gender || 'N/A'])
            worksheetData.push(['Age', data.introducer.age || 'N/A'])
            worksheetData.push(['Address', data.introducer.address || 'N/A'])
            worksheetData.push(['Status', data.introducer.status || 'N/A'])
        }

        // Convert to CSV
        const csvContent = worksheetData.map(row =>
            row.map(cell => {
                const cellStr = String(cell || '')
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`
                }
                return cellStr
            }).join(',')
        ).join('\n')

        // Download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.setAttribute('href', url)
        link.setAttribute('download', `Billing_Details_${data.customerName || 'Report'}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={600}>
                    Billing Details
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadAsExcel}
                    sx={{ textTransform: 'none' }}
                >
                    Download as Excel
                </Button>
            </Box>

            {/* Transaction Information */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                        Transaction Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Transaction Type
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.transactionType || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Mobile Number
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.mobileNo || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Customer Name
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                                    {data.customerName || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Sale Type
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.saleType || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Status
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <Chip
                                        label={data.status || 'N/A'}
                                        color={getStatusColor(data.status)}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Created Date
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {formatDate(data.createdAt)}
                                </Typography>
                            </Box>
                        </Grid>
                        {data.remarks && (
                            <Grid size={{ xs: 12 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Remarks
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.remarks}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Payment Details */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                        Payment Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Mode of Payment
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.modeOfPayment || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Amount Paid
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                                    {formatCurrency(data.amountPaid)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Balance Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'error.main' }}>
                                    {formatCurrency(data.balanceAmount)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12,  md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Payment Date
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {formatDate(data.paymentDate)}
                                </Typography>
                            </Box>
                        </Grid>
                        {data.cardNo && (
                            <>
                                <Grid size={{ xs: 12,  md: 6 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Card Number
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                                            {data.cardNo}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12,  md: 6 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Card Holder Name
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                                            {data.cardHolderName || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Customer Information */}
            {data.customer && (
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                            Customer Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.name || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.phone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.email || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Marketer Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.marketerName || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        City
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.city || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        State & Pincode
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.state || 'N/A'} - {data.customer.pincode || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12}}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.address || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* EMI Details */}
            {data.emi && (
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                            EMI Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        EMI Number
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.emiNo || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        EMI Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'warning.main' }}>
                                        {formatCurrency(data.emi.emiAmt)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Paid Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                                        {formatCurrency(data.emi.paidAmt)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Paid Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {formatDate(data.emi.paidDate)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Due Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {formatDate(data.emi.date)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* General Information */}
            {data.general && (
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                            General Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Payment Terms
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.general.paymentTerms || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        EMI Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                                        {formatCurrency(data.general.emiAmount)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Number of Installments
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.general.noOfInstallments || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Status
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={data.general.status || 'N/A'}
                                            color={getStatusColor(data.general.status)}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Loan
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={data.general.loan || 'N/A'}
                                            color={data.general.loan === 'Yes' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Offered
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={data.general.offered || 'N/A'}
                                            color={data.general.offered === 'Yes' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Introducer Information */}
            {data.introducer && (
                <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                            Introducer Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.name || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.phone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.email || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Gender
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, textTransform: 'capitalize' }}>
                                        {data.introducer.gender || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Age
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.age || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12,  md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Status
                                    </Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip
                                            label={data.introducer.status || 'N/A'}
                                            color={getStatusColor(data.introducer.status)}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12}}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.address || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}

export default BillingView