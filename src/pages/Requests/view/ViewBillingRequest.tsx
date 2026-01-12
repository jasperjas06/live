import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { DashboardContent } from "src/layouts/dashboard";
import { getBillingRequestById, updateBillingRequestStatus } from "src/utils/api.auth";

// Helper to assign chip color by status
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};

const ViewBillingRequest = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Approval Dialog State
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [validity, setValidity] = useState("");

  // Fetch Request Data
  const getData = async () => {
    try {
      setLoading(true);
      const response = await getBillingRequestById(id);
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching request:", error);
      toast.error("Failed to load request data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const handleApproveClick = async () => {
      // For 'create' requests, skip validity dialog and approve directly
      if (data?.requestFor === 'create') {
          // Direct API call without confirmation
          setActionLoading(true);
          try {
              // No validity sent for create requests
              const response = await updateBillingRequestStatus(id, "approved");
              if (response.status === 200) {
                toast.success(response.message || "Request approved successfully");
                getData(); 
              } else {
                toast.error(response.message || "Failed to approve request");
              }
            } catch (error) {
                console.error("Error approving request:", error);
                toast.error("Failed to approve request");
            } finally {
                setActionLoading(false);
            }
          return;
      }

      setValidity(""); // Reset validity for excel requests
      setOpenApproveDialog(true);
  }

  const handleApproveConfirm = async () => {
    if (!validity.trim()) {
        toast.error("Please enter validity period");
        return;
    }

    setOpenApproveDialog(false);
    setActionLoading(true);

    try {
      const response = await updateBillingRequestStatus(id, "approved", validity);
      if (response.status === 200) {
        toast.success(response.message || "Request approved successfully");
        getData(); 
      } else {
        toast.error(response.message || "Failed to approve request");
      }
    } catch (error) {
        console.error("Error approving request:", error);
        toast.error("Failed to approve request");
    } finally {
        setActionLoading(false);
    }
  };

  const handleDenyClick = () => {
    setOpenRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    setOpenRejectDialog(false);
    setActionLoading(true);
    try {
        const response = await updateBillingRequestStatus(id, "rejected", "0"); // Validity 0 for rejection
        if (response.status === 200) {
          toast.success(response.message || "Request rejected successfully");
          getData();
        } else {
          toast.error(response.message || "Failed to reject request");
        }
      } catch (error) {
          console.error("Error rejecting request:", error);
          toast.error("Failed to reject request");
      } finally {
          setActionLoading(false);
      }
  };

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!data) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="text.secondary">
          No data found
        </Typography>
      </DashboardContent>
    );
  }

  const isCreateRequest = data.requestFor === "create";

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Billing Request Details
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Request ID
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
             {data._id}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                User Details
            </Typography>
            <Typography variant="body1" fontWeight={500}>
                {data.userId?.name}
            </Typography>
             <Typography variant="body2" color="text.secondary">
                {data.userId?.phone} | {data.userId?.email}
            </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Request For
          </Typography>
          <Typography variant="body1" sx={{textTransform: 'capitalize'}}>
            {isCreateRequest ? "Verify Bill" : data.requestFor}
          </Typography>
        </Box>

         <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Message
          </Typography>
          <Typography variant="body1">
            {data.message || "N/A"}
          </Typography>
        </Box>

        {!isCreateRequest && (
            <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Excel Date Range
            </Typography>
            <Typography variant="body1">
                {data.excelFromDate && data.excelToDate 
                    ? `${new Date(data.excelFromDate).toLocaleDateString()} - ${new Date(data.excelToDate).toLocaleDateString()}` 
                    : "N/A"}
            </Typography>
            </Box>
        )}

        {isCreateRequest && data.billingDetails && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Billing Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Mode of Payment</Typography>
                        <Typography variant="body2">{data.billingDetails.modeOfPayment || "N/A"}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Payment Date</Typography>
                         <Typography variant="body2">
                            {data.billingDetails.paymentDate ? new Date(data.billingDetails.paymentDate).toLocaleDateString() : "N/A"}
                        </Typography>
                    </Box>
                     <Box>
                        <Typography variant="caption" color="text.secondary">Remarks</Typography>
                        <Typography variant="body2">{data.billingDetails.remarks || "N/A"}</Typography>
                    </Box>
                    {(data.billingDetails.modeOfPayment === "Card" || data.billingDetails.modeOfPayment === "Online") && (
                        <>
                         <Box>
                            <Typography variant="caption" color="text.secondary">Card/Ref No</Typography>
                            <Typography variant="body2">{data.billingDetails.cardNo || "N/A"}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Holder Name</Typography>
                            <Typography variant="body2">{data.billingDetails.cardHolderName || "N/A"}</Typography>
                        </Box>
                        </>
                    )}
                </Box>
            </Box>
        )}

        {isCreateRequest && data.emi && data.emi.length > 0 && (
             <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    EMI Details
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f6f8', textAlign: 'left' }}>
                                <th style={{ padding: '8px', borderBottom: '1px solid #dfe3e8' }}>Customer</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid #dfe3e8' }}>EMI No</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid #dfe3e8' }}>Due Date</th>
                                <th style={{ padding: '8px', borderBottom: '1px solid #dfe3e8' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.emi.map((item: any, index: number) => (
                                <tr key={item._id || index}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #edf2f7' }}>{item.customer?.name || "N/A"}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #edf2f7' }}>{item.emiNo}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #edf2f7' }}>
                                        {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #edf2f7' }}>₹{item.emiAmt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Box>
        )}

         <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Created At
          </Typography>
          <Typography variant="body1">
            {new Date(data.createdAt).toLocaleString()}
          </Typography>
        </Box>

         <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Updated At
          </Typography>
          <Typography variant="body1">
            {new Date(data.updatedAt).toLocaleString()}
          </Typography>
        </Box>

        {data.status && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={data.status}
              color={getStatusColor(data.status)}
              sx={{ textTransform: "capitalize" }}
            />
          </Box>
        )}

        {data.approvedBy && (
            <Box sx={{ mb: 3 }}>
                {/* <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Approved By
                </Typography>
                <Typography variant="body2">
                    ID: {data.approvedBy}
                </Typography> */}
                <Typography variant="body2" color="text.secondary">
                    {data.approvedDate && `Date: ${new Date(data.approvedDate).toLocaleString()}`}
                </Typography>
            </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" gap={2}>
        <Button
          onClick={handleDenyClick}
          variant="contained"
          color="error"
          disabled={actionLoading || data.status !== "pending"}
          startIcon={actionLoading ? <CircularProgress size={16} /> : <X size={18} />}
        >
          {actionLoading ? "Processing..." : "Reject"}
        </Button>

        <Button
          onClick={handleApproveClick}
          variant="contained"
          color="success"
          disabled={actionLoading || data.status !== "pending"}
          startIcon={actionLoading ? <CircularProgress size={16} /> : <Check size={18} />}
        >
          {actionLoading ? "Processing..." : "Approve"}
        </Button>
      </Box>

      {/* Approval Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Request</DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Please enter the validity period (in hours) for this approval.
            </Typography>
            <TextField
                autoFocus
                margin="dense"
                label="Validity (Hours)"
                type="text"
                fullWidth
                variant="outlined"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
            <Button onClick={handleApproveConfirm} variant="contained" color="primary">
                Approve
            </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
            <Typography variant="body1">
                Are you sure you want to reject this request? This action cannot be undone.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
            <Button onClick={handleRejectConfirm} variant="contained" color="error">
                Reject
            </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
};

export default ViewBillingRequest;
