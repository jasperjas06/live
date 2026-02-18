import { Print } from "@mui/icons-material";
import DownloadIcon from '@mui/icons-material/Download';
import { Backdrop, Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBillingsByCustomerId } from 'src/utils/api.service';
import BillView from "./BillFormat";

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
                setData({
                  ...response.data.data,
                  emiList: response.data?.emi || [],
                  billData: response.data?.billData,
                });
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




    const downloadAsExcel = () => {
        const headers = [
            'Transaction Type', 'Mobile Number', 'Customer Name', 'Sale Type', 'Status', 'Remarks', 'Created Date', 'Updated Date',
            'Mode of Payment', 'Amount Paid', 'Balance Amount', 'Payment Date', 'Card Number', 'Card Holder Name',
            'Customer Name', 'Phone', 'Email', 'Address', 'City', 'State', 'Pincode', 'Marketer Name',
            'EMI Number', 'EMI Amount', 'Paid Amount', 'Paid Date', 'Due Date',
            'Payment Terms', 'General EMI Amount', 'Number of Installments', 'General Status', 'Loan', 'Offered',
            'Introducer Name', 'Introducer Phone', 'Introducer Email', 'Introducer Gender', 'Introducer Age', 'Introducer Address', 'Introducer Status'
        ];

        const row = [
            data.transactionType || 'N/A',
            data.mobileNo || 'N/A',
            data.customerName || 'N/A',
            data.saleType || 'N/A',
            data.status || 'N/A',
            data.remarks || 'N/A',
            formatDate(data.createdAt),
            formatDate(data.updatedAt),

            // Payment Details
            data.modeOfPayment || 'N/A',
            formatCurrency(data.amountPaid),
            formatCurrency(data.balanceAmount),
            formatDate(data.paymentDate),
            data.cardNo || 'N/A',
            data.cardHolderName || 'N/A',

            // Customer Information
            data.customer?.name || 'N/A',
            data.customer?.phone || 'N/A',
            data.customer?.email || 'N/A',
            data.customer?.address || 'N/A',
            data.customer?.city || 'N/A',
            data.customer?.state || 'N/A',
            data.customer?.pincode || 'N/A',
            data.customer?.marketerName || 'N/A',

            // EMI Details
            data.emiNo || 'N/A',
            data.emi ? formatCurrency(data.emi.emiAmt) : 'N/A',
            data.emi ? formatCurrency(data.emi.paidAmt) : 'N/A',
            data.emi ? formatDate(data.emi.paidDate) : 'N/A',
            data.emi ? formatDate(data.emi.date) : 'N/A',

            // General Information
            data.general?.paymentTerms || 'N/A',
            data.general ? formatCurrency(data.general.emiAmount) : 'N/A',
            data.general?.noOfInstallments || 'N/A',
            data.general?.status || 'N/A',
            data.general?.loan || 'N/A',
            data.general?.offered || 'N/A',

            // Introducer Information
            data.introducer?.name || 'N/A',
            data.introducer?.phone || 'N/A',
            data.introducer?.email || 'N/A',
            data.introducer?.gender || 'N/A',
            data.introducer?.age || 'N/A',
            data.introducer?.address || 'N/A',
            data.introducer?.status || 'N/A'
        ];

        const worksheetData = [headers, row];

        // Convert to CSV
        const csvContent = worksheetData.map(r =>
            r.map(cell => {
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
        <div>
          <BillView ref={billRef} data={data} />
        </div>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            Billing Details
          </Typography>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadAsExcel}
              sx={{ textTransform: "none" }}
            >
              Download as Excel
            </Button>
            <Button
              variant="contained"
              onClick={downloadPDF}
              sx={{ textTransform: "none" }}
              startIcon={<Print />}
            >
              Print
            </Button>
          </div>
        </Box>

        {/* Transaction Information */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary"
              sx={{ mb: 2 }}
            >
              Transaction Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Transaction Type
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {data.transactionType || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Mobile Number
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {data.mobileNo || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Customer Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {data.customerName || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Sale Type
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {data.saleType || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={data.status || "N/A"}
                      color={getStatusColor(data.status)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
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
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              color="primary"
              sx={{ mb: 2 }}
            >
              Payment Details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Mode of Payment
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {data.modeOfPayment || "N/A"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Amount Paid
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 0.5, fontWeight: 600, color: "success.main" }}
                  >
                    {formatCurrency(data.enteredAmount ||data.amountPaid)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Balance Amount
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 0.5, fontWeight: 600, color: "error.main" }}
                  >
                    {formatCurrency(data.balanceAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Card Number
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {data.cardNo}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Card Holder Name
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {data.cardHolderName || "N/A"}
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
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary"
                sx={{ mb: 2 }}
              >
                Customer Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.name || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.phone || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.email || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Marketer Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.marketerName || data?.customer?.cedId?.name || data?.customer?.ddId?.name || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      City
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.city || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      State & Pincode
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.state || "N/A"} -{" "}
                      {data.customer.pincode || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.customer.address || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* EMI Details */}
        {data.emi && (
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary"
                sx={{ mb: 2 }}
              >
                EMI Details
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      EMI Number
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.emiNo || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      EMI Amount
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.5, fontWeight: 600, color: "warning.main" }}
                    >
                      {formatCurrency(data.emi.emiAmt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Paid Amount
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.5, fontWeight: 600, color: "success.main" }}
                    >
                      {formatCurrency(data.emi.paidAmt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Paid Date
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {formatDate(data.emi.paidDate)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
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
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary"
                sx={{ mb: 2 }}
              >
                General Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Payment Terms
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.general.paymentTerms || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      EMI Amount
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.5, fontWeight: 600 }}
                    >
                      {formatCurrency(data.general.emiAmount)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Number of Installments
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.general.noOfInstallments || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={data.general.status || "N/A"}
                        color={getStatusColor(data.general.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Loan
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={data.general.loan || "N/A"}
                        color={
                          data.general.loan === "Yes" ? "success" : "default"
                        }
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Offered
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={data.general.offered || "N/A"}
                        color={
                          data.general.offered === "Yes" ? "success" : "default"
                        }
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
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={600}
                color="primary"
                sx={{ mb: 2 }}
              >
                Introducer Information
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.introducer.name || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.introducer.phone || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.introducer.email || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Gender
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 0.5, textTransform: "capitalize" }}
                    >
                      {data.introducer.gender || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Age
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.introducer.age || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={data.introducer.status || "N/A"}
                        color={getStatusColor(data.introducer.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {data.introducer.address || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    );
}

export default BillingView