/* eslint-disable perfectionist/sort-imports */
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { permissions } from 'src/common/Permissions';
import { Iconify } from "src/components/iconify";
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';
import { DashboardContent } from "src/layouts/dashboard";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Column, DataTable } from "src/custom/dataTable/dataTable";
import { deleteMOD, getAllMOD } from "src/utils/api.service";

interface MODData {
  id: string; // Added id property
  _id: string;
  plotNo: string;
  status: string;
  customerId: {
    _id: string;
    name: string;
    customId: string;
  };
  projectId: {
    _id: string;
    projectName: string;
  };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

const MODTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<MODData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [pagination, setPagination] = useState<Pagination | null>(null);
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
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getMOD = async () => {
    setIsLoading(true);
    try {
      const params = {
          page: currentPage,
          limit: pageSize,
          ...(debouncedSearch && { search: debouncedSearch }),
      };

      const response = await getAllMOD(params);
      if (response.status === 200) {
        const mappedData = response.data.data.map((item: any) => ({
          ...item,
          id: item._id
        }));
        setData(mappedData);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.log(error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    getMOD();
  }, [currentPage, debouncedSearch]);

  // Delete Dialog State
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string | number) => {
      setDeleteId(String(id));
      setOpenConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setOpenConfirmDialog(false);

    try {
      await deleteMOD(deleteId);
      getMOD(); 
      toast.success("MOD deleted successfully");
    } catch (error) {
      console.error("Failed to delete MOD:", error);
      toast.error("Failed to delete MOD");
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

  const columns: Column<MODData>[] = [
    {
        id: "customerId",
        label: "Customer ID",
        sortable: true,
        render: (value, row) => {
             const displayId = row.customerId?.customId || 'N/A';
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{displayId}</Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(displayId);
                      toast.success('ID copied!');
                    }}
                  >
                    <Icon icon="solar:copy-outline" width={16} />
                  </IconButton>
                </Box>
              );
        }
    },
    { 
        id: "plotNo", 
        label: "Plot NO", 
        sortable: true 
    },
    { 
        id: "projectId", 
        label: "Site Name", 
        sortable: true,
        render: (value, row) => row.projectId?.projectName || 'N/A'
    },
    { 
        id: "customerId", 
        label: "Customer Name", 
        sortable: true,
        render: (value, row) => row.customerId?.name || 'N/A'
    },
    
    // { 
    //     id: "status", 
    //     label: "Status", 
    //     sortable: true,
    //     render: (value) => (
    //         <Typography 
    //             sx={{ 
    //                 textTransform: 'capitalize',
    //                 color: value === 'active' ? 'success.main' : 'text.secondary',
    //                 fontWeight: 600
    //             }}
    //         >
    //             {String(value)}
    //         </Typography>
    //     )
    // },
  ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          MOD List
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate("create")}
          disabled={permissions?.MOD?.create !== true}
        >
          New MOD
        </Button>
      </Box>

       {/* Search Input */}
       <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by Plot No, Customer Name..."
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

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Card>
        <DataTable
          title="MOD Table"
          data={data}
          columns={columns}
          isDelete={permissions?.MOD?.delete === true ? true : false}
          isEdit={permissions?.MOD?.update === true ? true : false}
          isView={permissions?.MOD?.read === true ? true : false}
          onDelete={handleDeleteClick}
          disablePagination={true} // Custom pagination below
          disableSearch={true} // Custom search above
          preserveOrder={true}
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

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        title="Delete MOD"
        content="Are you sure you want to delete this MOD? This action cannot be undone."
        action={handleDeleteConfirm}
        cancelText="Cancel"
        actionText="Delete"
      />

    </DashboardContent>
  );
};

export default MODTable;
