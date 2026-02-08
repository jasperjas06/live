import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import { deleteEmployee, getAllEmployees } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';

const Employee = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data,setData] = React.useState<any[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = React.useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchParams.get('search') || '');
  
  const [pagination, setPagination] = React.useState<any>(null);
  const pageSize = 10;

  // Sync state to URL params
  useEffect(() => {
    const params: any = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, currentPage, setSearchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      // Reset to page 1 when search term changes
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const response = await getAllEmployees(params)
      if(response){
        setData(response.data.data);
        setPagination(response.data.pagination || null);
      }

    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(()=>{
    getAllEmployeeData();
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

  const handleDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response: any = await deleteEmployee(deleteId); 
        if (response) {
          toast.success('Employee deleted successfully');
          getAllEmployeeData();
        } else {
          toast.error('Failed to delete employee');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete employee');
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
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

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name..."
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
          title="Employee Table"
          data={data}
          columns={employeeColumns}
          searchBy="name"
          isDelete={permissions?.Employee?.delete === true ? true : false}
          isEdit={permissions?.Employee?.update === true ? true : false}
          // isView={permissions?.Employee?.read === true ? true : false}
          isView={false}
          onDelete={handleDelete}
          disableSearch={true}
          disablePagination={true}
          preserveOrder={true}
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
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Confirm Delete"
          content="Are you sure you want to delete this employee? This action cannot be undone."
          action={handleConfirmDelete}
        />
      </DashboardContent>
    </div>
  );
};

export default Employee;
