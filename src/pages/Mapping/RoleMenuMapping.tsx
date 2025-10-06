import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import {  deleteMenuMapping, getAllRoles } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';


const RoleMenuMapping = () => {
  const navigate = useNavigate();
  const [data,setData] = React.useState<any[]>([]);

  const getMenuData = async () =>{
    try {
      const response = await getAllRoles()
      if(response){
        setData(response.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(()=>{
    getMenuData();
  },[])
  const handleDeleteRole = (id: string | number) => {
      const response:any= deleteMenuMapping(id);
      if(response){
        toast.success('Role deleted successfully');
        getMenuData();
      } else {
        toast.error('Failed to delete role');
      }
    };

  // ✅ Sample Role Permission Data
  // const data = [
  //   { id: 1, role: "Admin", read: true, write: true, view: true, delete: true },
  //   { id: 2, role: "Editor", read: true, write: true, view: true, delete: false },
  //   { id: 3, role: "Viewer", read: true, write: false, view: true, delete: false },
  //   { id: 4, role: "Moderator", read: true, write: false, view: true, delete: true },
  // ];

  // ✅ Define columns with render function for booleans
  const roleColumns: Column<any>[] = [
      { id: "name", label: "Role", sortable: true },
      { id: "userCount", label: "Total Users", sortable: true },
    ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Role And Menu Mapping
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
          disabled={permissions?.RoleMenuMapping?.create !== true}
        >
          New Role Mapping
        </Button>
      </Box>

      <DataTable
        title="Role Permissions"
        data={data}
        columns={roleColumns}
        searchBy="role"
        onDelete={handleDeleteRole}
        isDelete={permissions["Role And Menu Mapping"]?.delete === true ? true : false}
          isEdit={permissions["Role And Menu Mapping"]?.update === true ? true : false}
          isView={permissions["Role And Menu Mapping"]?.read === true ? true : false}
      />
    </DashboardContent>
  );
};

export default RoleMenuMapping;
