import toast from 'react-hot-toast';
import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import { CreateRole, deleteRole, getAllRoles } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';

import RoleDialog from './ManageRole/ManageRole';

const Role = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [roleId, setRoleId] = useState<string | number>('');

  const handleGetRoles = async() =>{
    try {
      const response = await getAllRoles();
      if (response) {
        setRoles(response.data.data);
        
      } else {
        // toast.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  }
  React.useEffect(() => {
    handleGetRoles();
  }, [open]);

  // Define table columns
  const roleColumns: Column<any>[] = [
    { id: "name", label: "Role", sortable: true },
    { id: "userCount", label: "Total Users", sortable: true },
  ];

  const handleEditRole = (id: string | number) => {
    if(!id) return;
    else{
      setRoleId(id);
      setOpen(true);
    }
  };

  const handleDeleteRole = (id: string | number) => {
    const response:any= deleteRole(id);
    if(response){
      toast.success('Role deleted successfully');
      handleGetRoles();
    } else {
      toast.error('Failed to delete role');
    }
  };

  const handleSaveRole = async (roleData: any) => {
    try {
      const response = await CreateRole(roleData);
      if (response.status === 201) {
        // toast.success('Role created successfully');
        setOpen(false);
      } else {
        // toast.error('Failed to create role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
    console.log('New Role:', roleData);
    // 👉 here you can call API to save role
  };

  return (
    <div>
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Role Management
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpen(true)}
            disabled={permissions?.Role?.create !== true}
          >
            New Role
          </Button>
        </Box>

        <DataTable
          title="Role Summary"
          data={roles}
          columns={roleColumns}
          searchBy="role"
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          isDelete={permissions?.Roles?.delete === true ? true : false}
          isEdit={permissions?.Roles?.update === true ? true : false}
          isView={permissions?.Roles?.read === true ? true : false}
        />
        { open && <RoleDialog open={open} setOpen={setOpen} onSubmitRole={handleSaveRole} id={roleId} />}
      </DashboardContent>
    </div>
  );
};

export default Role;
