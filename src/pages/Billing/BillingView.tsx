import { Box, Typography, Card, CardContent, Grid, Chip, Button, Backdrop, CircularProgress, Divider } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBillingsByCustomerId } from 'src/utils/api.service'
import { Print } from '@mui/icons-material'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'
import BillView from './BillFormat'


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

    const billRef = useRef<HTMLDivElement>(null);
    const downloadPDF = async () => {
        if (!billRef.current) return;

        const element = billRef.current;

        // 1️⃣ Capture the receipt exactly as it appears
        const canvas = await html2canvas(element, {
            scale: 2,                 // good print quality
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");

        // 2️⃣ Create A5 LANDSCAPE PDF (THIS is the key change)
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a5",             // ✅ A5 paper
  });

  // A5 landscape size in mm
  const pdfWidth = 210;
  const pdfHeight = 148;

  // 3️⃣ Calculate image dimensions to fit width (NO stretching)
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  // 4️⃣ Align image at TOP (like real receipts)
  // If you want center, change y to: (pdfHeight - imgHeight) / 2
  const x = 0;
  const y = 0;

  pdf.addImage(
    imgData,
    "PNG",
    x,
    y,
    imgWidth,
    imgHeight
  );

  // 5️⃣ Save
  pdf.save("receipt.pdf");
};





    const downloadAsPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4')
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        let yPosition = 10


        // Header border
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.5)
        doc.rect(10, yPosition, pageWidth - 20, 35)


        // Add Logo Image
        const logoUrl = data.logoUrl || 'https://via.placeholder.com/50x50?text=Logo' // Replace with your logo URL
        try {
            doc.addImage(logoUrl, 'PNG', 15, yPosition + 5, 25, 25)
        } catch (error) {
            console.log('Logo image could not be loaded')
        }


        // Company Logo placeholder and header
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(14)
        doc.text('LIFE HOUSING ENTERPRISES', 50, yPosition + 8)


        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text('NO.107/1,1st FLOOR,AMPA MANOR,NELSON MANICKAM', 50, yPosition + 15)
        doc.text('ROAD,AMINJIKARAI,CHENNAI-29', 50, yPosition + 20)
        doc.text('Contact No. - 78240 29123', 50, yPosition + 25)


        // Receipt No and Payment Date on right
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text(`Receipt No : ${data.receiptNo || '236513'}`, pageWidth - 50, yPosition + 8)
        doc.text(`Payment Date : ${formatDate(data.paymentDate) || '30-Oct-2025'}`, pageWidth - 50, yPosition + 15)
        doc.text(`M.O.P. : ${data.modeOfPayment || 'CASH'}`, pageWidth - 50, yPosition + 22)


        yPosition += 40


        // RECEIPT title
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text('RECEIPT', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 8


        // Customer details section
        doc.setDrawColor(0, 0, 0)
        doc.rect(10, yPosition, pageWidth - 20, 25)


        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(`Customer Name : ${data.customerName || 'R.RAJESH'}`, 15, yPosition + 5)
        doc.text(`Customer ID : ${data.customerId || 'LSS-26-1508'}`, 15, yPosition + 10)
        doc.text(`Mobile : ${data.mobileNo || '9566221157'}`, 15, yPosition + 15)
        doc.text(`Remarks : ${data.remarks || 'BK 5PM CASH (28/10/25)'}`, 15, yPosition + 20)


        // Right side details
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text(`Sponcer ID : ${data.sponcerId || '24364'}`, pageWidth - 50, yPosition + 5)
        doc.text(`EXECUTIVE : ${data.executive || 'RAJESH.R / 9566221157'}`, pageWidth - 50, yPosition + 10)
        doc.text(`Diamond Director : ${data.diamondDirector || 'INTHERBAIAJI D / 8610812924'}`, pageWidth - 50, yPosition + 15)
        doc.text(`Received ${data.received || 'One Thousand Only'}`, -10, yPosition + 25)


        yPosition += 30


        // Project details section
        doc.setDrawColor(0, 0, 0)
        doc.rect(10, yPosition, pageWidth - 20, 30)


        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(`Project Name : ${data.projectName || 'LIFE SAVINGS SCHEME 26'}`, 15, yPosition + 5)
        doc.text(`Inst No : ${data.instNo || '1'}`, 15, yPosition + 10)
        doc.text(`Inst. Date : ${formatDate(data.createdAt) || '30-Oct-2025'}`, 15, yPosition + 15)


        // Right side amounts
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text('Total Value :', pageWidth - 75, yPosition + 5)
        doc.text(`${formatCurrency(data.totalValue || 6000)}`, pageWidth - 25, yPosition + 5, { align: 'right' })


        doc.text('Prv. Paid Amount :', pageWidth - 75, yPosition + 10)
        doc.text(`${formatCurrency(data.prvPaidAmount || 0)}`, pageWidth - 25, yPosition + 10, { align: 'right' })


        doc.text('Current Paid Amount :', pageWidth - 75, yPosition + 15)
        doc.text(`${formatCurrency(data.amountPaid || 1000)}`, pageWidth - 25, yPosition + 15, { align: 'right' })


        doc.text('Balance :', pageWidth - 75, yPosition + 20)
        doc.text(`${formatCurrency(data.balanceAmount || 5000)}`, pageWidth - 25, yPosition + 20, { align: 'right' })


        yPosition += 35


        // Footer section
        doc.setDrawColor(0, 0, 0)
        doc.rect(10, yPosition, pageWidth - 20, 20)


        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(`Created By : ${data.createdBy || 'AARTHI'}`, 15, yPosition + 7)


        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('for LIFE ALLIANCE ENTERPRISES', pageWidth - 50, yPosition + 7)


        yPosition += 15
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.text('Computerized Bill Signature not required', pageWidth - 50, yPosition + 5)


        yPosition += 10
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(14)
        doc.text('Come with us Grow with us', pageWidth / 2, yPosition, { align: 'center' })


        // Save PDF
        doc.save(`Receipt_${data.customerName || 'Billing'}_${new Date().toISOString().split('T')[0]}.pdf`)
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
            <div>
                <BillView ref={billRef} data={data}/>
            </div>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={600}>
                    Billing Details
                </Typography>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadAsExcel}
                        sx={{ textTransform: 'none' }}
                    >
                        Download as Excel
                    </Button>
                    <Button variant='contained' onClick={downloadPDF} sx={{ textTransform: "none" }} startIcon={<Print />}>
                        Print
                    </Button>
                </div>
            </Box>


            {/* Transaction Information */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
                        Transaction Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Transaction Type
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.transactionType || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Mobile Number
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.mobileNo || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Customer Name
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                                    {data.customerName || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Sale Type
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.saleType || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Mode of Payment
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5 }}>
                                    {data.modeOfPayment || 'N/A'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Amount Paid
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                                    {formatCurrency(data.amountPaid)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Balance Amount
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'error.main' }}>
                                    {formatCurrency(data.balanceAmount)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
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
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            Card Number
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                                            {data.cardNo}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
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
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.name || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.phone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.email || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Marketer Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.marketerName || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        City
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.city || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        State & Pincode
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.customer.state || 'N/A'} - {data.customer.pincode || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
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
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        EMI Number
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.emiNo || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        EMI Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'warning.main' }}>
                                        {formatCurrency(data.emi.emiAmt)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Paid Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, color: 'success.main' }}>
                                        {formatCurrency(data.emi.paidAmt)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Paid Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {formatDate(data.emi.paidDate)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
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
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Payment Terms
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.general.paymentTerms || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        EMI Amount
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                                        {formatCurrency(data.general.emiAmount)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Number of Installments
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.general.noOfInstallments || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
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
                            <Grid size={{ xs: 12, md: 6 }}>
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
                            <Grid size={{ xs: 12, md: 6 }}>
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
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.name || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.phone || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Email
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.email || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Gender
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5, textTransform: 'capitalize' }}>
                                        {data.introducer.gender || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Age
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                                        {data.introducer.age || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
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
                            <Grid size={{ xs: 12 }}>
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

