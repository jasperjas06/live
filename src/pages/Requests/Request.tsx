import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';

import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  CircularProgress,
  TablePagination,
  TextField
} from '@mui/material';

import { Eye } from 'lucide-react';
import { DashboardContent } from 'src/layouts/dashboard';
import { getEditRequest } from 'src/utils/api.auth';

const Requests = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all edit requests
  const getAllRequestsData = async () => {
    setLoading(true);
    try {
      const response = await getEditRequest();
      console.log('Request API response:', response.data);

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
        toast.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch edit requests');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRequestsData();
  }, []);

  const getStatusColor = (status: string): any => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'denied':
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Filtered data by search term
  const filteredData = useMemo(() => {
    return data.filter((request) => {
      const term = searchTerm.toLowerCase();
      return (
        request.targetModel?.toLowerCase().includes(term) ||
        request.editedBy?.email?.toLowerCase().includes(term) ||
        request.status?.toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Edit Requests
        </Typography>
        <TextField
          size="small"
          placeholder="Search by model, email, or status..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="outlined"
          startIcon={<Eye size={18} />}
          onClick={getAllRequestsData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      ) : filteredData.length === 0 ? (
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No edit requests found
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableBody>
              {paginatedData.map((request) => (
                <TableRow
                  key={request._id}
                  sx={{
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <TableCell sx={{ width: '25%' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {request.targetModel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {request.targetId?.slice(-8) || 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: '25%' }}>
                    <Typography variant="body2">{request.editedBy?.name || 'Unknown'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.editedBy?.email || 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: '15%' }}>
                    <Typography variant="caption" color="text.secondary">
                      {request.changes?.length || 0} change(s)
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: '15%' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: '10%' }}>
                    <Chip
                      label={request.status || 'pending'}
                      color={getStatusColor(request.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>

                  <TableCell sx={{ width: '10%', textAlign: 'right' }}>
                    <IconButton
                      onClick={() => navigate(`view/${request._id}`)}
                      size="small"
                      sx={{
                        backgroundColor: '#f0f0f0',
                        '&:hover': { backgroundColor: '#e0e0e0' }
                      }}
                    >
                      <Eye size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      )}
    </DashboardContent>
  );
};

export default Requests;
