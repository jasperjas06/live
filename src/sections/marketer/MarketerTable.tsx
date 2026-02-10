import type { Column } from 'src/custom/dataTable/dataTable';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';


import { deleteMarketer, getAllMarketer } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';

type Customer = {
  id: string;
  name: string;
  phone: string;
  headbyName: string;
};

const MarketerTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [data, setData] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  
  const [pagination, setPagination] = useState<any>(null);
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

  const getAllData = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      };
      
      const response = await getAllMarketer(params);
      if (response.status) {
        const updatedData = response.data.data.map((item:any) => ({
          ...item,
          phone: item.phone || '-',
          headbyName: item.headBy?.name || 'N/A',
        }));
        setData(updatedData);
        setPagination(response.data.pagination || null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getAllData()
  },[currentPage, debouncedSearch])

  const handleDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response: any = await deleteMarketer(deleteId);
        if (response) {
          toast.success('Marketer deleted successfully');
          getAllData();
        } else {
          toast.error('Failed to delete marketer');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete marketer');
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
  };

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

      {/* Data Table */}
      {!isLoading && (
        <DataTable
                        title="Marketer Table"
                        data={data}
                        columns={customerColumns}
                        searchBy="name"
                        isDelete={permissions?.Marketer?.delete === true ? true : false}
          isEdit={permissions?.Marketer?.update === true ? true : false}
          isView={permissions?.Marketer?.read === true ? true : false}
          preserveOrder={true}
          onDelete={handleDelete}
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
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Confirm Delete"
          content="Are you sure you want to delete this marketer? This action cannot be undone."
          action={handleConfirmDelete}
        />
    </DashboardContent>
  );
};

export default MarketerTable;
