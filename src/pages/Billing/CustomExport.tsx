import { Box, Button, Card, CardContent, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { getCustomBillingReport } from 'src/utils/api.service';

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
      const params: { date?: string; dateFrom?: string; dateTo?: string } = {};
      
      // If both dates are the same (e.g. both are today), send only 'date' param
      if (fromDate === toDate) {
        params.date = fromDate;
      } else {
        // Otherwise, send both dateFrom and dateTo
        if (fromDate) params.dateFrom = fromDate;
        if (toDate) params.dateTo = toDate;
      }

      // Call the API
      const response = await getCustomBillingReport(params as any);

      if (response.status === 200 && response.data) {
        // Convert data to CSV
        const billingData = response.data.data || [];
        
        if (billingData.length === 0) {
          toast.error('No data found for the selected date range');
          setIsDownloading(false);
          return;
        }

        // Define CSV headers
        const headers = ['Customer Name', 'Marketer Name', 'EMI No', 'Paid Amount', 'Paid Date', 'Status'];
        
        // Convert data to CSV format
        const csvRows = [];
        csvRows.push(headers.map(escapeCSVValue).join(','));
        
        billingData.forEach((item: any) => {
          const row = [
            item.customerName || 'N/A',
            item.introducer?.name || 'N/A',
            item.emiNo || 'N/A',
            item.emi?.paidAmt || item.amountPaid || 'N/A',
            item.emi?.paidDate ? new Date(item.emi.paidDate).toLocaleDateString() : (item.paidDate ? new Date(item.paidDate).toLocaleDateString() : 'N/A'),
            item.status || 'N/A'
          ];
          const values = row.map(escapeCSVValue);
          csvRows.push(values.join(','));
        });
        
        const csvContent = csvRows.join('\n');
        
        // Add BOM for proper Excel UTF-8 encoding
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        // Generate filename with date range
        const filename = `Billing_Report_${fromDate}_to_${toDate}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
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
