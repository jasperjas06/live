import type { Column} from 'src/custom/dataTable/dataTable';

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { getAllMarketer } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';

type Customer = {
  id: string;
  name: string;
  phone: string;
  headbyName: string;
};

const MarketerTable = () => {
  const navigate = useNavigate();
  const [data,setData] = useState<any>([])

const getAllData = async () => {
  try {
    const response = await getAllMarketer();
    if (response.status) {
      const updatedData = response.data.data.map((item:any) => ({
        ...item,
        headbyName: item.headBy?.name || 'N/A',
      }));
      setData(updatedData);
    }
  } catch (error) {
    console.log(error);
  }
};



  useEffect(()=>{
    getAllData()
  },[])

  const customerColumns: Column<Customer>[] = [
      { id: 'name', label: 'Name', sortable: true },
      { id: 'phone', label: 'Phone', sortable: false },
      {
    id: 'headbyName',
    label: 'Head By',
    sortable: false,
  },
    // 
    ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Marketer
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
          disabled={permissions?.Marketer?.create !== true}
        >
          New Marketer
        </Button>
      </Box>
        <DataTable
                        title="Customer Table"
                        data={data}
                        columns={customerColumns}
                        searchBy="name"
                        isDelete={permissions?.Marketer?.delete === true ? true : false}
          isEdit={permissions?.Marketer?.update === true ? true : false}
          isView={permissions?.Marketer?.read === true ? true : false}
                        // onDelete={handleDelete}
                      />
    </DashboardContent>
  );
};

export default MarketerTable;
