import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { 
  Box, Card, Grid, Chip, Paper, Alert, Divider, Tooltip,
  useTheme, Typography, IconButton, CardContent, useMediaQuery, CircularProgress
} from '@mui/material'
import { 
  Phone as PhoneIcon, Email as EmailIcon, Person as PersonIcon,
  Refresh as RefreshIcon, Business as BusinessIcon,
  AttachMoney as MoneyIcon, LocationOn as LocationIcon,
  CalendarToday as CalendarIcon, SupervisorAccount as SupervisorIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material'

import { getAMOD } from 'src/utils/api.service'

import { DashboardContent } from 'src/layouts/dashboard'
import { Download } from 'lucide-react'



const Mod = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const getMOD = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAMOD(id)
      setData(response.data.data)
    } catch (err) {
      setError('Failed to fetch MOD details. Please try again.')
      console.error('Error fetching MOD:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getMOD()
    }
  }, [id])

  const handleDownloadExcel = () => {
  if (!data) return;

  // Construct rows (headers + values)
  const rows = [
    ["Field", "Value"],
    ["Site Name", data.siteName || "-"],
    ["Plot Number", data.plotNo || "-"],
    ["Date", formatDate(data.date)],
    ["Amount", formatCurrency(data.amount)],
    ["Status", data.status || "-"],
    ["Customer Name", data.customer?.name || "-"],
    ["Customer Phone", data.customer?.phone || "-"],
    ["Customer Email", data.customer?.email || "-"],
    ["Customer City", data.customer?.city || "-"],
    ["Customer State", data.customer?.state || "-"],
    ["Pincode", data.customer?.pincode || "-"],
    ["Address", data.customer?.address || "-"],
    ["Marketer Name", data.customer?.marketerName || "-"],
    ["Duration (Months)", data.customer?.duration || "-"],
    ["EMI Amount", formatCurrency(data.customer?.emiAmount)],
    ["Payment Terms", data.customer?.paymentTerms || "-"],
    ["Introducer Name", data.introducerName || "-"],
    ["Introducer Phone", data.introducerPhone || "-"],
    ["Director Name", data.directorName || "-"],
    ["Director Phone", data.directorPhone || "-"],
    ["Executive Director", data.EDName || "-"],
    ["Executive Director Phone", data.EDPhone || "-"],
    ["Created At", formatDate(data.createdAt)],
    ["Updated At", formatDate(data.updatedAt)],
  ];

  // Build HTML table
  const tableHTML = `
    <table border="1" style="border-collapse:collapse;">
      ${rows
        .map(
          (r) =>
            `<tr><td style="font-weight:bold;padding:4px;">${r[0]}</td><td style="padding:4px;">${r[1]}</td></tr>`
        )
        .join("")}
    </table>
  `;

  // Wrap in Excel-compatible MIME type
  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]>
        <xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>MOD Details</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
        </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>
      <![endif]--></head>
      <body>${tableHTML}</body>
    </html>
  `;

  // Create blob
  const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });

  // Create download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `MOD_${data.customer?.name || "Details"}.xls`;
  link.click();
};


  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success'
      case 'inactive': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  const InfoRow = ({ icon, label, value, isPhone = false }: {
    icon: React.ReactNode; label: string; value: string | number; isPhone?: boolean;
  }) => (
    <Box display="flex" alignItems="center" mb={2}>
      <Box color="text.secondary" mr={2} display="flex" alignItems="center">
        {icon}
      </Box>
      <Box flex={1}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {isPhone ? `+91 ${value}` : value}
        </Typography>
      </Box>
    </Box>
  )

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={50} />
        </Box>
      </DashboardContent>
    )
  }

  if (error) {
    return (
      <DashboardContent>
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small" onClick={getMOD}>
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </DashboardContent>
    )
  }

  if (!data) {
    return (
      <DashboardContent>
        <Alert severity="info">No MOD data found.</Alert>
      </DashboardContent>
    )
  }

  return (
    <DashboardContent>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={600}>
          MOD Details
        </Typography>
        <Box display="flex" gap={1}>
    <Tooltip title="Download Excel">
      <IconButton onClick={handleDownloadExcel} >
        <Download />
      </IconButton>
    </Tooltip>
    <Tooltip title="Refresh">
      <IconButton onClick={getMOD} color="primary">
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  </Box>
      </Box>

      <Grid container spacing={2}>
        {/* MOD Overview */}
        <Grid size={{ xs: 12, sm: 6, }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <BusinessIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>
                  MOD Overview
                </Typography>
              </Box>
              <InfoRow icon={<LocationIcon />} label="Site Name" value={data.siteName} />
              <InfoRow icon={<BusinessIcon />} label="Plot Number" value={data.plotNo} />
              <InfoRow icon={<CalendarIcon />} label="Date" value={formatDate(data.date)} />
              <InfoRow icon={<MoneyIcon />} label="Amount" value={formatCurrency(data.amount)} />
              <Box display="flex" alignItems="center" mb={2}>
                <Box color="text.secondary" mr={2}><AccountBalanceIcon /></Box>
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip label={data.status.toUpperCase()} color={getStatusColor(data.status) as any} size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Information */}
        <Grid size={{ xs: 12, sm: 6,  }}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <PersonIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6" fontWeight={600}>Customer Information</Typography>
              </Box>
              <InfoRow icon={<PersonIcon />} label="Name" value={data.customer.name} />
              <InfoRow icon={<PhoneIcon />} label="Phone" value={data.customer.phone} isPhone />
              <InfoRow icon={<EmailIcon />} label="Email" value={data.customer.email} />
              <InfoRow icon={<LocationIcon />} label="City" value={`${data.customer.city}, ${data.customer.state}`} />
              <InfoRow icon={<LocationIcon />} label="Pincode" value={data.customer.pincode} />
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Details */}
        <Grid size={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Additional Details</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow icon={<LocationIcon />} label="Full Address" value={data.customer.address} />
                  <InfoRow icon={<PersonIcon />} label="Marketer" value={data.customer.marketerName} />
                  <InfoRow icon={<CalendarIcon />} label="Duration" value={data.customer.duration} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InfoRow icon={<MoneyIcon />} label="EMI Amount" value={formatCurrency(data.customer.emiAmount)} />
                  <InfoRow icon={<AccountBalanceIcon />} label="Payment Terms" value={data.customer.paymentTerms} />
                  <InfoRow icon={<CalendarIcon />} label="Customer Created" value={formatDate(data.customer.createdAt)} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid size={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Contact Information</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Box display="flex" alignItems="center" mb={2}><SupervisorIcon color="primary" sx={{ mr: 1 }} /><Typography variant="subtitle1" fontWeight={600}>Introducer</Typography></Box>
                    <Typography variant="body1" gutterBottom>{data.introducerName}</Typography>
                    <Typography variant="body2" color="text.secondary">+91 {data.introducerPhone}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Box display="flex" alignItems="center" mb={2}><SupervisorIcon color="primary" sx={{ mr: 1 }} /><Typography variant="subtitle1" fontWeight={600}>Director</Typography></Box>
                    <Typography variant="body1" gutterBottom>{data.directorName}</Typography>
                    <Typography variant="body2" color="text.secondary">+91 {data.directorPhone}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                    <Box display="flex" alignItems="center" mb={2}><SupervisorIcon color="primary" sx={{ mr: 1 }} /><Typography variant="subtitle1" fontWeight={600}>Executive Director</Typography></Box>
                    <Typography variant="body1" gutterBottom>{data.EDName}</Typography>
                    <Typography variant="body2" color="text.secondary">+91 {data.EDPhone}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Record Info */}
        <Grid size={12}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Record Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Created: {formatDate(data.createdAt)}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Last Updated: {formatDate(data.updatedAt)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  )
}

export default Mod
