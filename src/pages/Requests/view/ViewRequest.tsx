import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardContent } from "src/layouts/dashboard";
import { getEditRequestByID, updateRequestStatus } from "src/utils/api.auth";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

// Helper to assign chip color by status
const getStatusColor = (status: string) => {
  switch (status) {
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

const ViewRequest = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Request Data
  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEditRequestByID(id);
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

  // Approve Request
  const handleApprove = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const response = await updateRequestStatus(data._id, "approved");
      if (response.status === 200) {
        toast.success(response.message || "Request approved successfully");
        getData(); // Refresh updated data
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

  // Deny Request
  const handleDeny = async () => {
    if (!data) return;
    setActionLoading(true);
    try {
      const response = await updateRequestStatus(data._id, "rejected");
      if (response.status === 200) {
        toast.success(response.message || "Request denied successfully");
        getData(); // Refresh updated data
      } else {
        toast.error(response.message || "Failed to deny request");
      }
    } catch (error) {
      console.error("Error denying request:", error);
      toast.error("Failed to deny request");
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

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
        Request Id : {id}
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600}>
        Request Details
      </Typography>

      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Target Model
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {data.targetModel}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Target ID
          </Typography>
          <Typography variant="body2" fontFamily="monospace">
            {data.targetId}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Edited By
          </Typography>
          <Typography variant="body1">
            {data.editedBy?.name || "Unknown"} ({data.editedBy?.email || "N/A"})
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Created At
          </Typography>
          <Typography variant="body1">
            {new Date(data.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Changes ({data.changes?.length || 0})
        </Typography>

        {data.changes && data.changes.length > 0 ? (
          <Table size="small">
            <TableBody>
              {data.changes.map((change: any, index: number) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 600, width: "30%", border: "none" }}>
                    {change.field}
                  </TableCell>
                  <TableCell sx={{ width: "35%", border: "none" }}>
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "#ffebee",
                        borderRadius: 1,
                        border: "1px solid #ffcdd2",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" display="block">
                        Old Value
                      </Typography>
                      <Typography variant="body2">
                        {change.oldValue ?? "-"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "35%", border: "none" }}>
                    <Box
                      sx={{
                        p: 1,
                        backgroundColor: "#e8f5e9",
                        borderRadius: 1,
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" display="block">
                        New Value
                      </Typography>
                      <Typography variant="body2">
                        {change.newValue ?? "-"}
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

        {data.status && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current Status
            </Typography>
            <Chip
              label={data.status}
              color={getStatusColor(data.status)}
              sx={{ textTransform: "capitalize" }}
            />
          </Box>
        )}

        {data.approvedBy && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Approved By
            </Typography>
            <Typography variant="body2">
              {data.approvedBy.name} ({data.approvedBy.email})
            </Typography>
          </Box>
        )}

        {data.deletedId && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Deleted Record
            </Typography>
            <Typography variant="body2">
              Table: {data.deletedTableName} - ID: {data.deletedId}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" gap={2}>
        <Button
          onClick={handleDeny}
          variant="contained"
          color="error"
          disabled={actionLoading || data.status !== "pending"}
          startIcon={actionLoading ? <CircularProgress size={16} /> : <X size={18} />}
        >
          {actionLoading ? "Processing..." : "Deny"}
        </Button>

        <Button
          onClick={handleApprove}
          variant="contained"
          color="success"
          disabled={actionLoading || data.status !== "pending"}
          startIcon={actionLoading ? <CircularProgress size={16} /> : <Check size={18} />}
        >
          {actionLoading ? "Processing..." : "Approve"}
        </Button>
      </Box>
    </DashboardContent>
  );
};

export default ViewRequest;
