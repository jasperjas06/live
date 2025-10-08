import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';

import { Eye, X, Check } from 'lucide-react';

import { DashboardContent } from 'src/layouts/dashboard';
import { getEditRequest, updateRequestStatus } from 'src/utils/api.auth';

const Requests = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all edit requests
  const getAllRequestsData = async () => {
    setLoading(true);
    try {
      const response = await getEditRequest();
      console.log('Request API response:', response.data);

      // Handle the response data
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

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRequest(null);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const response = await updateRequestStatus(selectedRequest._id, 'approved');

      if (response.status === 200) {
        toast.success(response.message || 'Request approved successfully');
        getAllRequestsData(); // Refresh the data
        handleCloseModal();
      } else {
        toast.error(response.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const response = await updateRequestStatus(selectedRequest._id, 'denied');

      if (response.status === 200) {
        toast.success(response.message || 'Request denied successfully');
        getAllRequestsData(); // Refresh the data
        handleCloseModal();
      } else {
        toast.error(response.message || 'Failed to deny request');
      }
    } catch (error) {
      console.error('Error denying request:', error);
      toast.error('Failed to deny request');
    } finally {
      setActionLoading(false);
    }
  };

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

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Edit Requests
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Eye size={18} />}
          onClick={getAllRequestsData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
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
              {data.map((request) => (
                <TableRow
                  key={request._id}
                  sx={{
                    '&:hover': { backgroundColor: '#f5f5f5' },
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
                    <Typography variant="body2">
                      {request.editedBy?.name || 'Unknown'}
                    </Typography>
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
                      onClick={() => handleViewRequest(request)}
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
        </Box>
      )}

      {/* Approval Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Request Details
          </Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {selectedRequest && (
            <Box>
              {/* Basic Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Target Model
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {selectedRequest.targetModel}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Target ID
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {selectedRequest.targetId}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Edited By
                </Typography>
                <Typography variant="body1">
                  {selectedRequest.editedBy?.name || 'Unknown'} (
                  {selectedRequest.editedBy?.email || 'N/A'})
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {/* Changes Section */}
              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Changes ({selectedRequest.changes?.length || 0})
              </Typography>

              {selectedRequest.changes && selectedRequest.changes.length > 0 ? (
                <Table size="small">
                  <TableBody>
                    {selectedRequest.changes.map((change: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: 600, width: '30%', border: 'none' }}>
                          {change.field}
                        </TableCell>
                        <TableCell sx={{ width: '35%', border: 'none' }}>
                          <Box
                            sx={{
                              p: 1,
                              backgroundColor: '#ffebee',
                              borderRadius: 1,
                              border: '1px solid #ffcdd2'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              Old Value
                            </Typography>
                            <Typography variant="body2">
                              {change.oldValue !== null && change.oldValue !== undefined
                                ? String(change.oldValue)
                                : '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ width: '35%', border: 'none' }}>
                          <Box
                            sx={{
                              p: 1,
                              backgroundColor: '#e8f5e9',
                              borderRadius: 1,
                              border: '1px solid #c8e6c9'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              New Value
                            </Typography>
                            <Typography variant="body2">
                              {change.newValue !== null && change.newValue !== undefined
                                ? String(change.newValue)
                                : '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No changes recorded
                </Typography>
              )}

              {/* Status */}
              {selectedRequest.status && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Status
                  </Typography>
                  <Chip
                    label={selectedRequest.status}
                    color={getStatusColor(selectedRequest.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              )}

              {/* Approved By */}
              {selectedRequest.approvedBy && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Approved By
                  </Typography>
                  <Typography variant="body2">
                    {selectedRequest.approvedBy.name} ({selectedRequest.approvedBy.email})
                  </Typography>
                </Box>
              )}

              {/* Deleted Info (if applicable) */}
              {selectedRequest.deletedId && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Deleted Record
                  </Typography>
                  <Typography variant="body2">
                    Table: {selectedRequest.deletedTableName} - ID: {selectedRequest.deletedId}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', gap: 1 }}>
          <Button onClick={handleCloseModal} variant="outlined" disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeny}
            variant="contained"
            color="error"
            disabled={actionLoading || selectedRequest?.status === 'denied'}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <X size={18} />}
          >
            {actionLoading ? 'Processing...' : 'Deny'}
          </Button>
          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            disabled={actionLoading || selectedRequest?.status === 'approved'}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <Check size={18} />}
          >
            {actionLoading ? 'Processing...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
};

export default Requests;