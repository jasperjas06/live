import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import { deleteMenuMapping, getAllRoles } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';


const RoleMenuMapping = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [data, setData] = React.useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = React.useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchParams.get('search') || '');
  
  const [pagination, setPagination] = React.useState<any>(null);
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

  const getMenuData = async () =>{
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const response = await getAllRoles(params)
      if(response){
        setData(response.data.data);
        setPagination(response.data.pagination || null);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  React.useEffect(()=>{
    getMenuData();
  },[currentPage, debouncedSearch])

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

  const handleDeleteRole = (id: string | number) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      const response:any= await deleteMenuMapping(deleteId);
      if(response){
        toast.success('Role deleted successfully');
        getMenuData();
      } else {
        toast.error('Failed to delete role');
      }
    }
    setOpenDeleteDialog(false);
    setDeleteId(null);
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
          disabled={permissions["Role And Menu Mapping"]?.create !== true}
        >
          New Role Mapping
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
        title="Role Permissions"
        data={data}
        columns={roleColumns}
        searchBy="role"
        onDelete={handleDeleteRole}
        isDelete={permissions["Role And Menu Mapping"]?.delete === true ? true : false}
        isEdit={permissions["Role And Menu Mapping"]?.update === true ? true : false}
        isView={permissions["Role And Menu Mapping"]?.read === true ? true : false}
        preserveOrder={true}
        disableSearch={true}
        disablePagination={true}
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

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Confirm Delete"
        content="Are you sure you want to delete this Role Mapping? This action cannot be undone."
        action={handleConfirmDelete}
      />
    </DashboardContent>
  );
};

export default RoleMenuMapping;
