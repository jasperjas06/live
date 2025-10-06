import type { Column } from 'src/custom/dataTable/dataTable';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import {
  Box,
  Card,
  Button,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';

import { deleteCustomer, getAllCustomer } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { ActionMenu, DataTable } from 'src/custom/dataTable/dataTable';


type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const CustomerPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);

  // console.log(permissions,"permissions")

 const getCustomerData = async () => {
  try {
    const res = await getAllCustomer();
    if (res?.status === 200) {
      const mapped = res.data.data.map((c: any) => ({
        ...c,
        id: c._id,   // 👈 normalize _id → id
      }));
      setData(mapped);
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(() => {
    getCustomerData();
  }, []);

const customerColumns: Column<Customer>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'phone', label: 'Phone', sortable: false },
  { 
    id: 'id',   // 👈 match the API field
    label: 'Estimate Details',
    sortable: false,
    render: (_value: string, row: Customer) => (
      <button style={{background:"#2c2c2cff", padding:"5px", borderRadius:"5px", paddingRight:"10px", paddingLeft:"10px", cursor:"pointer", color:"white"}} onClick={() => navigate(`${row.id}/estimate`)}>Estimate</button>
    )
  }
];



const handleDelete = async (id: string | number) => {
  const confirmed = window.confirm('Are you sure you want to delete this customer?');
  if (!confirmed) return;

  try {
    await deleteCustomer(String(id)); // convert to string if needed by API
    getCustomerData(); // re-fetch data (not getAllCustomer again)
  } catch (error) {
    console.error('Failed to delete customer:', error);
  }
};


  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Customers
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate("create")}
          disabled={permissions?.Customer?.create !== true}
        >
          New Customer
        </Button>
      </Box>

      <Card>
        <DataTable
          title="Customer Table"
          data={data}
          columns={customerColumns}
          searchBy="name"
          isDelete={permissions?.Customer?.delete === true ? true : false}
          isEdit={permissions?.Customer?.update === true ? true : false}
          isView={permissions?.Customer?.read === true ? true : false}
          onDelete={handleDelete}
        />
      </Card>
    </DashboardContent>
  );
};

export default CustomerPage;
