import type { Column} from 'src/custom/dataTable/dataTable';

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { deleteMarketingHead, getAllMarkingHead } from 'src/utils/api.service';

import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age : number
};

const MarketingHeadTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);

  const getAllData = async () =>{
    try {
        const response = await getAllMarkingHead();
        // console.log(response.data.data)
        if(response.status){
            setData(response.data.data)
        }
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(()=>{
    getAllData()
  },[])

   const customerColumns: Column<Customer>[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'age', label: 'Age', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phone', label: 'Phone', sortable: false },
  // 
  ];

  const handleDelete = async (id: string | number) => {
    const confirmed = window.confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;
  
    try {
      await deleteMarketingHead(String(id)); // convert to string if needed by API
      getAllData(); // re-fetch data (not getAllCustomer again)
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };
  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Marketing Head
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
        >
          New Marketing Head
        </Button>
      </Box>
      <DataTable
                title="Customer Table"
                data={data}
                columns={customerColumns}
                searchBy="name"
                onDelete={handleDelete}
              />
    </DashboardContent>
  );
};

export default MarketingHeadTable;
