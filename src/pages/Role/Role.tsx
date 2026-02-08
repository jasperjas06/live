import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import { CreateRole, deleteRole, getAllRoles } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import ConfirmDialog from "src/custom/dialog/ConfirmDialog";
import RoleDialog from './ManageRole/ManageRole';

const Role = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [roleId, setRoleId] = useState<string | number>('');
  const [isLoading, setIsLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  
  const [pagination, setPagination] = useState<any>(null);
  const pageSize = 10;

  // Sync state to URL params
  React.useEffect(() => {
    const params: any = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, currentPage, setSearchParams]);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      // Reset to page 1 when search term changes
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleGetRoles = async() =>{
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      
      const response: any = await getAllRoles(params);
      if (response && response.status === 200) {
        setRoles(response.data.data);
        setPagination(response.data.pagination || null);
      } else {
        // toast.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    } finally {
      setIsLoading(false);
    }
  }
  
  React.useEffect(() => {
    handleGetRoles();
  }, [open, currentPage, debouncedSearch]);

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

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
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      const response: any = await deleteRole(deleteId);
      if (response) {
        toast.success('Role deleted successfully');
        handleGetRoles();
      } else {
        toast.error('Failed to delete role');
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
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
            disabled={permissions?.Roles?.create !== true}
          >
            New Role
          </Button>
        </Box>

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    onClick={handleSearchClear}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Iconify icon="mingcute:close-line" />
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>

        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && (
        <DataTable
          title="Role Summary"
          data={roles}
          columns={roleColumns}
          searchBy="role"
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          isDelete={permissions?.Roles?.delete === true ? true : false}
          isEdit={permissions?.Roles?.update === true ? true : false}
          isView={false}
          disableSearch={true}
          disablePagination={true}
          preserveOrder={true}
          // isView={permissions?.Roles?.read === true ? true : false}
        />
        )}

        {/* Pagination Controls */}
        {pagination && !isLoading && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {pagination.total} record{pagination.total !== 1 ? 's' : ''}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage}
              >
                Previous
              </Button>
              
              <Typography variant="body2">
                Page {pagination.page} of {pagination.totalPages}
              </Typography>
              
              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        { open && <RoleDialog open={open} setOpen={setOpen} onSubmitRole={handleSaveRole} id={roleId} />}

        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Confirm Delete"
          content="Are you sure you want to delete this Role? This action cannot be undone."
          action={handleConfirmDelete}
        />
      </DashboardContent>
    </div>
  );
};

export default Role;
