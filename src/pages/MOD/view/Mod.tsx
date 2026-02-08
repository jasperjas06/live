import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  AccountBalance as AccountBalanceIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  SupervisorAccount as SupervisorIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { getAMOD, getAllMOD } from 'src/utils/api.service';
import * as XLSX from 'xlsx';

import { DownloadIcon } from 'lucide-react';
import { DashboardContent } from 'src/layouts/dashboard';



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

    // Define columns in order
    const columns = [
      { header: "Project Name", value: data.projectId?.projectName || "-" },
      { header: "Project Code", value: data.projectId?.shortName || "-" },
      { header: "Project Total Investimate", value: formatCurrency(data.projectId?.totalInvestimate) },
      { header: "Project Total Return Amount", value: formatCurrency(data.projectId?.totalReturnAmount) },
      { header: "Plot Number", value: data.plotNo || "-" },
      { header: "Paid Date", value: data.paidDate ? formatDate(data.paidDate) : "-" },
      { header: "Total Amount", value: formatCurrency(data.totalAmount) },
      { header: "Paid Amount", value: formatCurrency(data.paidAmount) },
      { header: "Rate Per Sqft", value: formatCurrency(data.ratePerSqft) },
      { header: "Status", value: data.status || "-" },
      { header: "Customer Name", value: data.customerId?.name || "-" },
      { header: "Customer Phone", value: data.customerId?.phone || "-" },
      { header: "Customer Email", value: data.customerId?.email || "-" },
      { header: "Customer Address", value: data.customerId?.address || "-" },
      { header: "Customer ID", value: data.customerId?.customId || data.customerId?.id || "-" }, // Added Customer ID to export
      { header: "Introducer Name", value: data.introducerName || "-" },
      { header: "Introducer Phone", value: data.introducerPhone || "-" },
      { header: "Director Name", value: data.directorName || "-" },
      { header: "Director Phone", value: data.directorPhone || "-" },
      { header: "Executive Director", value: data.EDName || "-" },
      { header: "Executive Director Phone", value: data.EDPhone || "-" },
      { header: "Created At", value: formatDate(data.createdAt) },
      { header: "Updated At", value: formatDate(data.updatedAt) },
    ];

    const headers = columns.map(col => `<th style="font-weight:bold;padding:4px;border:1px solid #000;">${col.header}</th>`).join("");
    const values = columns.map(col => `<td style="padding:4px;border:1px solid #000;">${col.value}</td>`).join("");

    const tableHTML = `
      <table border="1" style="border-collapse:collapse;">
        <tr>${headers}</tr>
        <tr>${values}</tr>
      </table>
    `;

    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
        <meta charset="UTF-8">
        <!--[if gte mso 9]>
          <xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>MOD Details</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
          </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml>
        <![endif]-->
      </head>
        <body>${tableHTML}</body>
      </html>
    `;

    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MOD_${data.customerId?.name || "Details"}.xls`;
    link.click();
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const handleDownloadAllExcel = async () => {
    if (!data?.customerId?._id && !data?.customerId?.id) return;
    
    try {
      const customerId = data.customerId._id || data.customerId.id;
      const response = await getAllMOD({ customerId });
      
      if (response.status === 200 && response.data?.data) {
        const projects = response.data.data;
        const wb = XLSX.utils.book_new();

        projects.forEach((project: any) => {
          if (project.mod && project.mod.length > 0) {
             const sheetData = project.mod.map((mod: any) => ({
              "Project Name": project.projectName || "-",
              "Project Code": project.shortName || "-", // Assuming shortName is on project object based on user context
              "Project Total Investimate": formatCurrency(project.totalInvestimate),
              "Project Total Return Amount": formatCurrency(project.totalReturnAmount),
              "Plot Number": mod.plotNo || "-",
              "Paid Date": mod.paidDate ? formatDate(mod.paidDate) : "-",
              "Total Amount": formatCurrency(mod.totalAmount),
              "Paid Amount": formatCurrency(mod.paidAmount),
              "Rate Per Sqft": formatCurrency(mod.ratePerSqft),
              "Status": mod.status || "-",
               // Customer details are common, so we take from the first mod or the outer scope if needed, 
               // but based on structure, mod items might not have full customer object if it's nested under project.
               // However, we are downloading FOR a customer, so these details should be constant.
               // Using 'data' from component state as fallback for customer details if not in mod objects.
              "Customer Name": data.customerId?.name || "-",
              "Customer Phone": data.customerId?.phone || "-",
              "Customer Email": data.customerId?.email || "-",
              "Customer Address": data.customerId?.address || "-",
              "Customer ID": data.customerId?.customId || data.customerId?.id || "-",
              "Introducer Name": mod.introducerName || "-",
              "Introducer Phone": mod.introducerPhone || "-",
              "Director Name": mod.directorName || "-",
              "Director Phone": mod.directorPhone || "-",
              "Executive Director": mod.EDName || "-",
              "Executive Director Phone": mod.EDPhone || "-",
              "Created At": formatDate(mod.createdAt),
              "Updated At": formatDate(mod.updatedAt),
            }));

            const ws = XLSX.utils.json_to_sheet(sheetData);
            
            // Adjust column widths (optional but good for UX)
            const colWidths = Object.keys(sheetData[0]).map(() => ({ wch: 20 }));
            ws['!cols'] = colWidths;

            // Sheet name max length 31 chars
            const sheetName = (project.projectName || "Project").substring(0, 31).replace(/[\\/?*[\]]/g, ""); 
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          }
        });

        // Write file
        XLSX.writeFile(wb, `All_MODs_${data.customerId?.name || "Customer"}.xlsx`);
      }
    } catch (error) {
      console.error("Error downloading all MODs:", error);
      // Ideally show a toast/alert here
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
      <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
      >
          Download as Excel
      </Button>
    </Tooltip>
    <Tooltip title="Download All MODs">
        <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadAllExcel}
        >
            Download All
        </Button>
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
              <InfoRow icon={<LocationIcon />} label="Project Name" value={data.projectId?.projectName || "-"} />
              <InfoRow icon={<BusinessIcon />} label="Project Code" value={data.projectId?.shortName || "-"} />
              <InfoRow icon={<MoneyIcon />} label="Project Total Investimate" value={formatCurrency(data.projectId?.totalInvestimate)} />
              <InfoRow icon={<MoneyIcon />} label="Project Total Return Amount" value={formatCurrency(data.projectId?.totalReturnAmount)} />
              <InfoRow icon={<BusinessIcon />} label="Plot Number" value={data.plotNo} />
              <InfoRow icon={<CalendarIcon />} label="Paid Date" value={formatDate(data.paidDate)} />
              <InfoRow icon={<MoneyIcon />} label="Total Amount" value={formatCurrency(data.totalAmount)} />
              <InfoRow icon={<MoneyIcon />} label="Paid Amount" value={formatCurrency(data.paidAmount)} />
              <InfoRow icon={<MoneyIcon />} label="Rate Per Sqft" value={formatCurrency(data.ratePerSqft)} />
              <Box display="flex" alignItems="center" mb={2}>
                <Box color="text.secondary" mr={2}><AccountBalanceIcon /></Box>
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip label={(data.status || 'N/A').toUpperCase()} color={getStatusColor(data.status) as any} size="small" />
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
              <InfoRow icon={<PersonIcon />} label="Name" value={data.customerId?.name || "-"} />
              <InfoRow icon={<PhoneIcon />} label="Phone" value={data.customerId?.phone || "-"} isPhone />
              <InfoRow icon={<EmailIcon />} label="Email" value={data.customerId?.email || "-"} />
              <InfoRow icon={<LocationIcon />} label="Address" value={data.customerId?.address || "-"} />
              <InfoRow icon={<PersonIcon />} label="Customer ID" value={data.customerId?.customId || data.customerId?.id || "-"} />
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
