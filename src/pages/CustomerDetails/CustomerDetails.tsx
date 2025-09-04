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

import { DashboardContent } from 'src/layouts/dashboard';
import { ActionMenu, DataTable } from 'src/custom/dataTable/dataTable';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);

  const getCustomerData = async () => {
    try {
      const res = await getAllCustomer();
      if (res?.status === 200) {
        setData(res?.data.data);
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
// {
//     id: 'id', // key used for rendering
//     label: 'Actions',
//     render: (_, row) => <ActionMenu row={row} onDelete={handleDelete} />,
//   },
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
          Customer Details
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate("create")}
        >
          Add New Details
        </Button>
      </Box>

      <Card>
        <DataTable
          title="Customer Table"
          data={data}
          columns={customerColumns}
          searchBy="name"
          onDelete={handleDelete}
        />
      </Card>
    </DashboardContent>
  );
};

export default CustomerDetails;
