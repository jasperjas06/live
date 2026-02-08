import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteHousingData, getAllHousingData } from 'src/utils/api.service';

const LifeHousing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  
  const [pagination, setPagination] = useState<any>(null); // Using any for now, ideally CustomerPagination
  const pageSize = 10;
  
  // State for delete dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

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

  const housingColumns: Column<any>[] = [
    { id: 'plotNo', label: 'Plot No', sortable: true },
    { id: 'nameOfCustomer', label: 'Customer Name', sortable: true },
    { id: 'date', label: 'Booking Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { id: 'projectArea', label: 'Project Area', sortable: true },
    { id: 'mobileNo', label: 'Mobile No', sortable: false },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'gender', label: 'Gender', sortable: true },
  ];

  const getHousingData = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      };
      
      const res = await getAllHousingData(params);
      if (res?.status === 200) {
        // Handle response mapping if needed, similar to CustomerTable
        const mapped = Array.isArray(res.data.data) ? res.data.data : [];
        setData(mapped);
        setPagination(res.data.pagination || null);
      } else {
        setData([]);
        setPagination(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch housing data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHousingData();
  }, [currentPage, debouncedSearch]);

  const handleDeleteClick = (id: string | number) => {
    setDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setOpenConfirmDialog(false);

    try {
      const res = await deleteHousingData(deleteId);
      if (res?.status === 200) {
        toast.success('Booking deleted successfully');
        getHousingData();
      } else {
        toast.error('Failed to delete booking');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete booking');
    } finally {
      setDeleteId(null);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
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
    <div>
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Life Housing Management
          </Typography>
        </Box>

        {/* Search Input */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by customer name..."
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
            title="Life Housing Table"
            data={data}
            columns={housingColumns}
            searchBy="nameOfCustomer"
            isView={false}
            isEdit={false}
          isDelete={false}
          onDropDown={false}
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
      </DashboardContent>
    </div>
  );
};

export default LifeHousing;
