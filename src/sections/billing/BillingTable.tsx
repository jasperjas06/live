import type { Column} from 'src/custom/dataTable/dataTable';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { getAllBilling } from 'src/utils/api.service';
import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { Iconify } from 'src/components/iconify';

type Customer = {
  id: string;
  customerName: string;
  marketerName: string;
  emiNo: number;
  emiId: string;
  paidAmount: string;
  paidDate: string;
};

const BillingTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  let { id } = useParams();
  
  console.log(permissions, "permissions");

  const getAllData = async () => {
    try {
      const response = await getAllBilling();
      if (response.status) {
        let data = response.data.data;
        data = data.map((item: any) => ({
          ...item,
          marketerName: item.introducer?.name || 'N/A',
          paidDate: item.emi?.paidDate?.split('T')[0] || 'N/A',
          emiId: item.emi?._id || 'N/A',
          paidAmount: item.emi?.paidAmt || 'N/A',
        }));
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const customerColumns: Column<Customer>[] = [
    { id: 'customerName', label: 'Name', sortable: true },
    { id: 'marketerName', label: 'Marketer Name', sortable: true },
    { id: 'emiNo', label: 'Emi No', sortable: true },
    { id: 'emiId', label: 'Emi Id', sortable: true },
    { id: 'paidAmount', label: 'Paid Amount', sortable: true },
    { id: 'paidDate', label: 'Paid Date', sortable: true },
  ];

  // Function to escape CSV values and handle special characters
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // If value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  // Function to download billing data as Excel (CSV format)
  const handleDownloadExcel = () => {
    try {
      setIsDownloading(true);

      // Define headers based on columns
      const headers = customerColumns.map(col => col.label);
      
      // Convert data to CSV format
      const csvRows = [];
      
      // Add headers
      csvRows.push(headers.map(escapeCSVValue).join(','));
      
      // Add data rows
      data.forEach((row) => {
        const values = customerColumns.map(col => {
          const value = row[col.id as keyof Customer];
          return escapeCSVValue(value);
        });
        csvRows.push(values.join(','));
      });
      
      // Join all rows with newline
      const csvContent = csvRows.join('\n');
      
      // Add BOM for proper Excel UTF-8 encoding
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Billing_Report_${currentDate}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setIsDownloading(false);
    } catch (error) {
      console.error('Failed to download billing data:', error);
      setIsDownloading(false);
      alert('Failed to download billing data. Please try again.');
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ flexGrow: 1, minWidth: '200px' }}>
          Billing
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
            onClick={handleDownloadExcel}
            disabled={isDownloading || data.length === 0}
            sx={{
              minWidth: '150px',
              '&:hover': {
                backgroundColor: 'success.light',
                color: 'white',
              },
            }}
          >
import type { Column} from 'src/custom/dataTable/dataTable';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { getAllBilling } from 'src/utils/api.service';
import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { Iconify } from 'src/components/iconify';

type Customer = {
  id: string;
  customerName: string;
  marketerName: string;
  emiNo: number;
  emiId: string;
  paidAmount: string;
  paidDate: string;
};

const BillingTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  let { id } = useParams();
  
  console.log(permissions, "permissions");

  const getAllData = async () => {
    try {
      const response = await getAllBilling();
      if (response.status) {
        let data = response.data.data;
        data = data.map((item: any) => ({
          ...item,
          marketerName: item.introducer?.name || 'N/A',
          paidDate: item.emi?.paidDate?.split('T')[0] || 'N/A',
          emiId: item.emi?._id || 'N/A',
          paidAmount: item.emi?.paidAmt || 'N/A',
        }));
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const customerColumns: Column<Customer>[] = [
    { id: 'customerName', label: 'Name', sortable: true },
    { id: 'marketerName', label: 'Marketer Name', sortable: true },
    { id: 'emiNo', label: 'Emi No', sortable: true },
    { id: 'emiId', label: 'Emi Id', sortable: true },
    { id: 'paidAmount', label: 'Paid Amount', sortable: true },
    { id: 'paidDate', label: 'Paid Date', sortable: true },
  ];

  // Function to escape CSV values and handle special characters
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);
    
    // If value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };

  // Function to download billing data as Excel (CSV format)
  const handleDownloadExcel = () => {
    try {
      setIsDownloading(true);

      // Define headers based on columns
      const headers = customerColumns.map(col => col.label);
      
      // Convert data to CSV format
      const csvRows = [];
      
      // Add headers
      csvRows.push(headers.map(escapeCSVValue).join(','));
      
      // Add data rows
      data.forEach((row) => {
        const values = customerColumns.map(col => {
          const value = row[col.id as keyof Customer];
          return escapeCSVValue(value);
        });
        csvRows.push(values.join(','));
      });
      
      // Join all rows with newline
      const csvContent = csvRows.join('\n');
      
      // Add BOM for proper Excel UTF-8 encoding
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `Billing_Report_${currentDate}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setIsDownloading(false);
    } catch (error) {
      console.error('Failed to download billing data:', error);
      setIsDownloading(false);
      alert('Failed to download billing data. Please try again.');
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ flexGrow: 1, minWidth: '200px' }}>
          Billing
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
            onClick={handleDownloadExcel}
            disabled={isDownloading || data.length === 0}
            sx={{
              minWidth: '150px',
              '&:hover': {
                backgroundColor: 'success.light',
                color: 'white',
              },
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download Excel'}
          </Button>
          
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate('create')}
            disabled={permissions?.Billing?.create !== true}
            sx={{ minWidth: '150px' }}
          >
            New Billing
          </Button>
        </Box>
      </Box>

      <DataTable
        title="Customer Table"
        data={data}
        columns={customerColumns}
        searchBy="customerName"
        isDelete={false}
        isEdit={false}
        isView={permissions?.Billing?.read === true ? true : false}
      />
    </DashboardContent>
  );
};

export default BillingTable;
