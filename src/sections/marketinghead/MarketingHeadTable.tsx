import type { Column } from 'src/custom/dataTable/dataTable';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import { deleteMarketingHead, getAllMarkingHead } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age : number
};

const MarketingHeadTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [data, setData] = useState<Customer[]>([]);
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

  const getAllData = async () =>{
    try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(debouncedSearch && { search: debouncedSearch }),
        };
        const response = await getAllMarkingHead(params);
        // console.log(response.data.data)
        if(response.status){
            setData(response.data.data)
            setPagination(response.data.pagination || null);
        }
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false);
    }
  }
  
  useEffect(()=>{
    getAllData()
  },[currentPage, debouncedSearch])

   const customerColumns: Column<Customer>[] = [
    { id: 'name', label: 'Name', sortable: true },
    { 
      id: 'age', 
      label: 'Age', 
      sortable: true,
      render: (value: any) => value || '-' 
    },
    { 
      id: 'email', 
      label: 'Email', 
      sortable: true,
      render: (value: any) => value || '-'
    },
    { id: 'phone', label: 'Phone', sortable: false },
  ];

  const handleDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response: any = await deleteMarketingHead(String(deleteId));
        if (response) {
          toast.success('Marketing Head deleted successfully');
          getAllData();
        } else {
          toast.error('Failed to delete Marketing Head');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete Marketing Head');
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

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Marketing Head
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
          disabled={permissions["Marketing Head"]?.create !== true}
        >
          New Marketing Head
        </Button>
      </Box>

      {/* Search Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, email, phone..."
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
                title="Marketing Head Table"
                data={data}
                columns={customerColumns}
                searchBy="name"
                onDelete={handleDelete}
                isDelete={permissions["Marketing Head"]?.delete === true ? true : false}
          isEdit={permissions["Marketing Head"]?.update === true ? true : false}
          isView={permissions["Marketing Head"]?.read === true ? true : false}
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
          content="Are you sure you want to delete this Marketing Head? This action cannot be undone."
          action={handleConfirmDelete}
        />
    </DashboardContent>
  );
};

export default MarketingHeadTable;
