import { Box, Button, Card, CardContent, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCustomBillingReport } from 'src/utils/api.service';
import * as XLSX from 'xlsx';


const CustomExport = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [dateFilter, setDateFilter] = useState('Custom');
  const [status, setStatus] = useState('paid');

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filter = event.target.value;
    setDateFilter(filter);

    const today = new Date();
    let newFromDate = '';
    let newToDate = getTodayDate();

    switch (filter) {
      case 'Yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        newFromDate = yesterday.toISOString().split('T')[0];
        newToDate = newFromDate;
        break;
      }
      case 'Today': {
        newFromDate = getTodayDate();
        newToDate = getTodayDate();
        break;
      }
      case 'Last 1 Week': {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        newFromDate = lastWeek.toISOString().split('T')[0];
        break;
      }
      case 'Last 1 Month': {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        newFromDate = lastMonth.toISOString().split('T')[0];
        break;
      }
      case 'Custom':
      default:
        // Do nothing for Custom, keep existing dates or let user change them
        return;
    }

    setFromDate(newFromDate);
    setToDate(newToDate);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
    setDateFilter('Custom');
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
    setDateFilter('Custom');
  };

  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // If value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Validate dates
      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        toast.error('From date cannot be after To date');
        setIsDownloading(false);
        return;
      }

      // Prepare API parameters based on date selection
      const params: { date?: string; dateFrom?: string; dateTo?: string; status?: string } = {};
      
      // If both dates are the same AND it is today's date, send only 'date' param
      // The backend expects 'date' only for Today. For Yesterday (or past dates), it expects a range.
      if (fromDate === toDate && fromDate === getTodayDate()) {
        params.date = fromDate;
      } else {
        // Otherwise, send both dateFrom and dateTo
        if (fromDate) params.dateFrom = fromDate;
        if (toDate) params.dateTo = toDate;
      }
        
      // Add status filter if selected
      if (status) {
        params.status = status;
        console.log('Using status filter:', status);
      }

      console.log('API Params being sent:', params);
      // Call the API
      const response = await getCustomBillingReport(params as any);

      if (response.status === 200 && response.data) {
        console.log('API Response Data:', response.data);
        const billingData = response.data.billing || response.data.data || [];
        const emiData = response.data.emi || [];
        
        if (billingData.length === 0 && emiData.length === 0) {
          toast.error(response.message || 'No data found for the selected date range');
          setIsDownloading(false);
          return;
        }

        // --- SHEET 1: BILLING (PAID) ---
        const billingRows = billingData.map((item: any) => {
          // Helper to safely get properties
          const getVal = (val: any) => val || '';
          const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : ''; // DD/MM/YYYY

          // Project ID with preference: shortName > _id > N/A
          const projectShortName = item.general?.project?.shortName || item.general?.project?._id || 'N/A';
          // Project Name
          const projectName = item.general?.project?.projectName || 'N/A';
          
          // CED (Customer Executive Director) details
          const cedName = item.customer?.cedId?.name || '';
          const cedId = item.customer?.cedId?.id || item.customer?.cedId?._id || '';
          
          // DD (Direct Director) details
          const ddName = item.customer?.ddId?.name || '';
          const ddId = item.customer?.ddId?.id || item.customer?.ddId?._id || '';

          // Calculations
          const emiAmount = Number(item.general?.emiAmount) || 0;
          const noOfInstallments = Number(item.general?.noOfInstallments) || 0;
          const calculatedTotalAmount = emiAmount * noOfInstallments;
          const totalAmount = item.general?.totalAmount || item.general?.plotCost || (calculatedTotalAmount > 0 ? calculatedTotalAmount : '');
          const balanceAmount = Number(item.balanceAmount) || 0;
          const totalPaid = totalAmount ? (Number(totalAmount) - balanceAmount) : '';

          return {
            'Project ID': projectShortName,
            'Project Name': projectName,
            'Customer Name': getVal(item.customerName || item?.customer?.name),
            'Customer ID': getVal(item.customerCode || item?.customer?.id),
            'Phone': getVal(item.mobileNo || item?.customer?.phone),
            'CED Name': cedName,
            'CED ID': cedId,
            'DD Name': ddName,
            'DD ID': ddId,
            'Payment Date': formatDate(item.paymentDate),
            'Amount Paid': getVal(item.amountPaid),
            'Booking ID': getVal(item.general?._id),
            'Plot No': getVal(item.customer?.plotNo),
            'EMI No': getVal(item.emiNo),
            'Pay Mode': getVal(item.modeOfPayment),
            'Remarks': getVal(item.remarks),
            'Created By': getVal(item.createdBy?.name),
            'Total Amount': totalAmount,
            'Total Paid': totalPaid,
            'Total Balance': getVal(item.balanceAmount),
          };
        });

        // --- SHEET 2: UNPAID EMI ---
        const emiRows = emiData.map((item: any) => {
          const getVal = (val: any) => val || '';
          const formatDate = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : '';

          const customer = item.customer || {};
          const general = item.general || {};
          
          // Project ID with preference: shortName > _id > N/A
          const projectShortName = general.project?.shortName || general.project?._id || customer.projectId || 'N/A';
          // Project Name
          const projectName = general.project?.projectName || 'N/A';
          
          // CED (Customer Executive Director) details
          const cedName = customer.cedId?.name || '';
          const cedId = customer.cedId?.id || customer.cedId?._id || '';
          
          // DD (Direct Director) details
          const ddName = customer.ddId?.name || '';
          const ddId = customer.ddId?.id || customer.ddId?._id || '';

          return {
             'Project ID': projectShortName,
             'Project Name': projectName,
             'Customer Name': getVal(customer.name),
             'Customer ID': getVal(customer.id),
             'Phone': getVal(customer.phone),
             'CED Name': cedName,
             'CED ID': cedId,
             'DD Name': ddName,
             'DD ID': ddId,
             'EMI Amount': getVal(item.emiAmt),
             'EMI No': getVal(item.emiNo),
             'Date': formatDate(item.date),
             'Status': 'Unpaid',
          };
        });

        // Create Workbook
        const wb = XLSX.utils.book_new();

        // Add Billing Sheet (only if there is data)
        if (billingRows.length > 0) {
          const wsBilling = XLSX.utils.json_to_sheet(billingRows);
          XLSX.utils.book_append_sheet(wb, wsBilling, 'Billing');
        }

        // Add Unpaid EMI Sheet
        if (emiRows.length > 0) {
            const wsEmi = XLSX.utils.json_to_sheet(emiRows);
            XLSX.utils.book_append_sheet(wb, wsEmi, 'Pending Collections');
        }

        // Generate filename
        const filename = `Billing_Report_${fromDate}_to_${toDate}.xlsx`;

        // Write and Download
        XLSX.writeFile(wb, filename);
        
        toast.success('Report downloaded successfully');
      } else {
        toast.error(response.message || 'Failed to download report');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/billing')}
          sx={{ minWidth: '120px' }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Custom Billing Export
        </Typography>
      </Box>

      <Card sx={{ p: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Select Date Range
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Select a date range to export billing data. By default, today's date is selected.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <TextField
                select
                label="Date Range"
                value={dateFilter}
                onChange={handleDateFilterChange}
                sx={{ minWidth: '200px' }}
              >
                {['Custom', 'Yesterday', 'Today', 'Last 1 Week', 'Last 1 Month'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="From Date"
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '200px' }}
              />
              
              <TextField
                label="To Date"
                type="date"
                value={toDate}
                onChange={handleToDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1, minWidth: '200px' }}
              />
                
              <TextField
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ minWidth: '200px' }}
                helperText="Optional: Filter by payment status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </TextField>
            </Box>

            {/* <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> If both dates are set to today, only the "To Date" parameter will be sent to the API.
                Otherwise, both "From Date" and "To Date" will be sent.
              </Typography>
            </Box> */}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/billing')}
                disabled={isDownloading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mingcute:download-line" />}
                onClick={handleDownload}
                disabled={isDownloading || !fromDate || !toDate}
              >
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default CustomExport;
