/* eslint-disable react/jsx-no-undef */
/* eslint-disable perfectionist/sort-imports */

import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { deleteLFC, getAllLFC } from 'src/utils/api.service';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';

type Customer = {
  id: string;
  plotNo: string;
  totalSqFt: string;
  sqFtAmount: string;
  registration: string;
  customer: string;
};

const LFCTable = () => {
  const [data,setData] = useState<any>([])
  const navigate = useNavigate();
  
  const getLFCData = async() =>{
    try {
      const response = await getAllLFC()
      if(response.status){
        const enrichedData = response.data.data.map((item: any) => ({
        ...item,
        customer: item.customer?.name || 'N/A', // fallback if name is missing
      }));

      setData(enrichedData);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getLFCData()
  },[ ])

   const customerColumns: Column<Customer>[] = [
     { id: 'customer', label: 'Customer Name', sortable: true },
    { id: 'plotNo', label: 'Plot No', sortable: true },
    { id: 'totalSqFt', label: 'Total SqFt', sortable: true },
    { id: 'sqFtAmount', label: 'SqFt Price', sortable: false },
    { id: 'registration', label: 'Status', sortable: false },

  ];
  
  const handleDelete = async (id: string | number) => {
    const confirmed = window.confirm('Are you sure you want to delete this Prpject Detail?');
    if (!confirmed) return;
  
    try {
      await deleteLFC(String(id)); // convert to string if needed by API
      getLFCData(); // re-fetch data (not getAllCustomer again)
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Project Details 
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
        >
          New  
        </Button>
      </Box>

      <Card>
              <DataTable
                title="Customer Table"
                data={data}
                columns={customerColumns}
                searchBy="customer"
                onDelete={handleDelete}
              />
            </Card>
    </DashboardContent>
  );
};

export default LFCTable;
