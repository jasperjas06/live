import toast from 'react-hot-toast';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Typography, Button } from '@mui/material';

import { deleteEmployee, getAllEmployees } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';

const Employee = () => {
  const navigate = useNavigate();
  const [data,setData] = React.useState<any[]>([]);

  const employeeColumns: Column<any>[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phone', label: 'Phone Number', sortable: false },
    {
  id: 'role',
  label: 'Role',
  sortable: true,
  render: (value, row) => (value?.name ? value.name : '-')  // ✅ safe
}


  ];
  const getAllEmployeeData = async () =>{
    try {
      const response = await getAllEmployees()
      if(response){
        setData(response.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getAllEmployeeData();
  },[])

  const handleDelete = (id: string | number) => {
    try {
      const response:any= deleteEmployee(id);
      if(response){
        toast.success('Employee deleted successfully');
        getAllEmployeeData();
      } else {
        toast.error('Failed to delete employee');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete employee');
    }
  };

  return (
    <div>
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Employee Management
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate('create')}
            disabled={permissions?.Employee?.create !== true}
          >
            New Employee
          </Button>
        </Box>

        <DataTable
          title="Employee Table"
          data={data}
          columns={employeeColumns}
          searchBy="name"
          isDelete={permissions?.Employee?.delete === true ? true : false}
          isEdit={permissions?.Employee?.update === true ? true : false}
          isView={permissions?.Employee?.read === true ? true : false}
          onDelete={handleDelete}
        />
      </DashboardContent>
    </div>
  );
};

export default Employee;
