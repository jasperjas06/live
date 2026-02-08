import {
  Box,
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteProject, getAllProjects } from 'src/utils/api.service';

interface Project {
  _id?: any;
  projectName: string;
  stortName: string;
  duration: string;
  emiAmount: number;
  marketer: string;
  schema: string;
  returns: number;
  intrest: string;
  totalInvestimate: number;
  totalReturnAmount: number;
  createdAt: string;
  updatedAt: string;
}

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const ProjectsTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<Project[]>([]);
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
      // Reset to page 1 when search term changes
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getProjectsData = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      };

      const res = await getAllProjects(params);
      if (res?.status === 200) {
        // Handle both paginated and non-paginated responses gracefully
        // The API update ensures pagination, but defensive coding is good
        if (Array.isArray(res.data.data)) {
           setData(res.data.data);
           setPagination(res.data.pagination || null);
        } else {
           // Fallback if API structure isn't exactly as expected
           setData(Array.isArray(res.data) ? res.data : []);
        }

      } else {
        setData([]);
        setPagination(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProjectsData();
  }, [currentPage, debouncedSearch]);

  type ProjectWithId = Project & { id: string };

  const projectColumns: Column<ProjectWithId>[] = [
    {
      id: 'projectName',
      label: 'Project Name',
      sortable: true,
      render: (_, row) => row.projectName || 'N/A',
    },
    {
      id: 'duration',
      label: 'Duration',
      render: (_, row) => row.duration || 'N/A',
    },
    {
      id: 'emiAmount',
      label: 'EMI Amount',
      render: (_, row) => row.emiAmount ? `₹${row.emiAmount.toLocaleString('en-IN')}` : '0',
    },
    {
      id: 'returns',
      label: 'Returns',
      render: (_, row) => {
        const returnValue = row.totalReturnAmount || row.returns;
        if (returnValue && returnValue !== 0) {
          return `₹${returnValue.toLocaleString('en-IN')}`;
        }
        return '0';
      },
    },
    {
      id: 'intrest',
      label: 'Interest',
      render: (_, row) => {
        const investmentValue = row.totalInvestimate;
        if (investmentValue && investmentValue !== 0) {
          return `₹${investmentValue.toLocaleString('en-IN')}`;
        }
        const interest = row.intrest || (row as any).interest;
        return interest && interest !== '0' ? interest : 'N/A';
      },
    },
  ];

  // State for ConfirmDialog
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const handleDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteProject(String(deleteId));
        getProjectsData();
      } catch (error) {
        console.error('Failed to delete project:', error);
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
          Projects
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
        >
          New Project
        </Button>
      </Box>

      {/* Search Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by project name..."
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
        <Card>
          <DataTable
            title="Projects Table"
            data={data.map((item) => ({ ...item, id: item._id }))}
            columns={projectColumns}
            searchBy="projectName"
            onDelete={handleDelete}
            disableSearch={true}
            disablePagination={true}
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
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Confirm Delete"
        content="Are you sure you want to delete this project? This action cannot be undone."
        action={handleConfirmDelete}
      />
    </DashboardContent>
  );
};

export default ProjectsTable;
