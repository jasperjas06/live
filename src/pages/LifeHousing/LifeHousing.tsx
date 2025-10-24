import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Box, Typography, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';

const LifeHousing = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
    const url = import.meta.env.VITE_API_URL


  // ✅ Columns based on your plot booking API (you can add/remove fields as needed)
  const housingColumns: Column<any>[] = [
    { id: 'plotNo', label: 'Plot No', sortable: true },
    { id: 'nameOfCustomer', label: 'Customer Name', sortable: true },
    { id: 'date', label: 'Booking Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { id: 'projectArea', label: 'Project Area', sortable: true },
    { id: 'mobileNo', label: 'Mobile No', sortable: false },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'gender', label: 'Gender', sortable: true },
  ];

  // ✅ Fetch housing data
  const getAllHousingData = async () => {
    try {
      const response = await axios.get(
        `${url}api/plot/booking/get/all`
      );

      console.log("Housing API response:", response.data);

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch housing data');
    }
  };

  // ✅ Delete handler (adjust endpoint if backend supports delete)
  const handleDelete = async (id: string | number) => {
    try {
      const res = await axios.delete(
        `https://customer-form-8auo.onrender.com/api/plot/booking/delete/${id}`
      );
      if (res) {
        toast.success('Booking deleted successfully');
        getAllHousingData();
      } else {
        toast.error('Failed to delete booking');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete booking');
    }
  };

  useEffect(() => {
    getAllHousingData();
  }, []);

  return (
    <div>
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Life Housing Management
          </Typography>
          
        </Box>

        <DataTable
          title="Life Housing Table"
          data={data}
          columns={housingColumns}
          searchBy="nameOfCustomer"
          isView={false}
          onDelete={handleDelete}
        />
      </DashboardContent>
    </div>
  );
};

export default LifeHousing;
