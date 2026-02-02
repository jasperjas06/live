import type { Column } from 'src/custom/dataTable/dataTable';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';

import { deleteCustomer, getAllCustomer } from 'src/utils/api.service';

import { Icon } from '@iconify/react';
import toast from "react-hot-toast";
import { permissions } from 'src/common/Permissions';
import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';
import type { CustomerPagination } from 'src/types/customer';

type Customer = {
  id: string;
  customerId?: string;
  name: string;
  email: string;
  phone: string;
    projectId?: {
    marketer?: string;
    projectName?: string;
    [key: string]: any;
  };
      ddId?: {
    name?: string;
    [key: string]: any;
  };
  cedId?: {
    name?: string;
    [key: string]: any;
  };
};

const CustomerPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [pagination, setPagination] = useState<CustomerPagination | null>(null);
  const pageSize = 10;

  // console.log(permissions.Customer,"permissions")

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

 const getCustomerData = async () => {
   try {
     setIsLoading(true);
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(debouncedSearch && { search: debouncedSearch }),
    };
    const res = await getAllCustomer(params);
    if (res?.status === 200) {
      const mapped = res.data.data.map((c: any) => ({
        ...c,
        customerId: c.id || c._id,  // 👈 prefer id, fallback to _id
        id: c._id,   // 👈 normalize _id → id for internal use
      }));
      setData(mapped);
      setPagination(res.data.pagination || null);
      } else if (res?.status === 404) {
      setData([]);
      setPagination(null);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    getCustomerData();
  }, [currentPage, debouncedSearch]);

  const customerColumns: Column<Customer>[] = [
    { 
    id: 'customerId', 
    label: 'Customer ID', 
    sortable: true,
    render: (value: any, row: Customer) => {
      const displayId = value || row.id || 'N/A';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">{displayId}</Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(displayId);
              toast.success('Customer ID copied!');
            }}
            sx={{ 
              width: 24, 
              height: 24, 
              color: 'text.secondary',
              opacity: 0.7,
              '&:hover': { 
                opacity: 1,
                color: 'primary.main',
                bgcolor: 'action.hover' 
              }
            }}
          >
            <Icon icon="solar:copy-outline" width={16} />
          </IconButton>
        </Box>
      );
    }
  },
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { 
    id: 'projectId', 
    label: 'Marketer', 
    sortable: false,
    render: (_value: any, row: Customer) => (
      <Typography variant="body2">
       {row.projectId?.marketer || row?.ddId?.name || 'N/A'}
      </Typography>
    )
  },
  { 
    id: 'id',   // 👈 match the API field
    label: 'Estimate Details',
    sortable: false,
    render: (_value: any, row: Customer) => (
      <button style={{background:"#2c2c2cff", padding:"5px", borderRadius:"5px", paddingRight:"10px", paddingLeft:"10px", cursor:"pointer", color:"white"}} onClick={(e) => {navigate(`${row.id}/estimate`) 
      e.stopPropagation(); }}>Estimate</button>
    )
  }
];



const handleDelete = async (id: string | number) => {
  const confirmed = window.confirm('Are you sure you want to delete this customer?');
  if (!confirmed) return;

  try {
    await deleteCustomer(String(id)); // convert to string if needed by API
    getCustomerData(); // re-fetch data (not getAllCustomer again)
  } catch (error) {
    console.error('Failed to delete customer:', error);
  }
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
          Customers
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate("create")}
          disabled={permissions?.Customer?.create !== true}
        >
          New Customer
        </Button>
      </Box>

            {/* Search Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by customer ID, name, email, phone..."
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
        <Card>
           <DataTable
          title="Customer Table"
          data={data}
          columns={customerColumns}
          searchBy="name"
          isDelete={permissions?.Customer?.delete === true ? true : false}
          isEdit={permissions?.Customer?.update === true ? true : false}
          isView={permissions?.Customer?.read === true ? true : false}
          onDelete={handleDelete}
          preserveOrder={true}
          disableSearch={true}
          disablePagination={true}
        />
      </Card>
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
  );
};

export default CustomerPage;
