import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';

import { deletePercentage, getAllPercentage } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DataTable, type Column } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';
import ManagePercentage from 'src/pages/Percentage/manage/ManagePercentage';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from "src/custom/dialog/ConfirmDialog";

interface Project {
     id: string;
    name: string;
    rate: string;
}


const PercetageTable = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [open,setOpen] = useState<boolean>(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [deleteId, setDeleteId] = useState<string | number | null>(null)
    const [data, setData] = useState<any>([])
    const [ID, setID] =  useState<string>("")
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

    const getAllData = async()=>{
        try {
            setIsLoading(true);
            const params: any = {
                page: currentPage,
                limit: pageSize,
            };
            
            if (debouncedSearch) {
                params.search = debouncedSearch;
            }

            const response = await getAllPercentage(params)
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
    },[open, currentPage, debouncedSearch])

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

    const handleEdith = (id: any) =>{
        if(id){
            setID(id)
            setOpen(true)
        }
    }

    const handleDelete = (id: string | number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
      };
    
      const handleConfirmDelete = async () => {
        if (deleteId) {
          try {
            await deletePercentage(String(deleteId));
            getAllData();
          } catch (error) {
            console.error('Failed to delete percentage:', error);
          }
        }
        setOpenDeleteDialog(false);
        setDeleteId(null);
      };

      const customerColumns: Column<Project>[] = [
      { id: 'name', label: 'Name', sortable: true },
      { id: 'rate', label: 'Rate', sortable: true },
    ];


    return(
    <div>
       <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Percentage
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          disabled={permissions?.Percentage?.create !== true}
          onClick={() => setOpen(true)}
        >
          New Percentage
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
            title="Percentage Table"
            data={data}
            columns={customerColumns}
            searchBy="name"
            onEdit={handleEdith}
            onDelete={handleDelete}
            isDelete={permissions?.Percentage?.delete === true ? true : false}
          isEdit={permissions?.Percentage?.update === true ? true : false}
            isView={permissions?.Percentage?.read === true ? false : false} // used false since there is no view page
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

      <ManagePercentage open={open} setOpen={setOpen} id={ID} />
      
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Confirm Delete"
        content="Are you sure you want to delete this percentage? This action cannot be undone."
        action={handleConfirmDelete}
      />
      </DashboardContent>
    </div>
    )
}

export default PercetageTable
