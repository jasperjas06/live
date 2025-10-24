import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Box, Typography, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';


const LifeAlliance = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const url = import.meta.env.VITE_API_URL
  // ✅ Columns mapped from API response
  const allianceColumns: Column<any>[] = [
    { id: 'idNo', label: 'Policy ID', sortable: true },
    { id: 'nameOfCustomer', label: 'Customer Name', sortable: true },
    { id: 'dob', label: 'Date of Birth', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { id: 'mobileNo', label: 'Mobile No', sortable: false },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'planNo', label: 'Plan No', sortable: true },
    { id: 'nomineeName', label: 'Nominee', sortable: false },
  ];

  // ✅ Fetch data
  const getAllAllianceData = async () => {
    try {
      const response = await axios.get(
        `${url}api/life/saving/get/all`
      );
      if (response && response.data) {
        setData(response.data.data); // your API already returns array
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch life saving data');
    }
  };

  // ✅ Delete handler (if delete API exists)
  const handleDelete = async (id: string | number) => {
    try {
      // ⚠️ Adjust this endpoint if your backend uses a different delete route
      const res = await axios.delete(
        `https://customer-form-8auo.onrender.com/api/life/saving/delete/${id}`
      );
      if (res) {
        toast.success('Record deleted successfully');
        getAllAllianceData();
      } else {
        toast.error('Failed to delete record');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete record');
    }
  };

  useEffect(() => {
    getAllAllianceData();
  }, []);

  return (
    <div>
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Life Alliance Management
          </Typography>
          
        </Box>

        <DataTable
          title="Life Alliance Table"
          data={data}
          columns={allianceColumns}
          searchBy="nameOfCustomer"
          isView={false}
          onDelete={handleDelete}
        />
      </DashboardContent>
    </div>
  );
};

export default LifeAlliance;
