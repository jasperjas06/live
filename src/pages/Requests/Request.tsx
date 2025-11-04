import axios from "axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { Eye, Download, RefreshCw } from "lucide-react";

import { DashboardContent } from "src/layouts/dashboard";
import { getEditRequest } from "src/utils/api.auth";
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
  TextField,
  Tooltip,
} from "@mui/material";

const Requests = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getAllRequestsData = async () => {
    setLoading(true);
    try {
      const params: any = {};

      // Only add date if user has selected one
      if (selectedDate) {
        params.date = selectedDate;
      }

      const response = await getEditRequest(params);
      console.log("Request API response:", response.data);

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
      } else {
        setData([]);
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch edit requests");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRequestsData();
  }, [selectedDate]); // Re-fetch when date changes

  const handleExportExcel = async () => {
    const toastId = toast.loading("Exporting edit requests...");

    try {
      const params: any = { export: "true" };

      // If date is selected, export only that date
      // Otherwise, export ALL historical data
      if (selectedDate) {
        params.date = selectedDate;
      }

      const response = await getEditRequest(params);

      let exportData = [];
      if (Array.isArray(response.data)) {
        exportData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        exportData = response.data.data;
      }

      if (!exportData || exportData.length === 0) {
        toast.dismiss(toastId);
        toast.error("No data to export");
        return;
      }

      // Transform data for Excel
      const excelData = exportData.map((request: any) => ({
        "Target Model": request.targetModel || "N/A",
        "Target ID": request.targetId || "N/A",
        "Edited By": request.editedBy?.name || "N/A",
        Email: request.editedBy?.email || "N/A",
        "Changes Count": request.changes?.length || 0,
        Changes:
          request.changes
            ?.map((c: any) => `${c.field}: ${c.oldValue} → ${c.newValue}`)
            .join("; ") || "N/A",
        Status: request.status || "pending",
        "Created At": new Date(request.createdAt).toLocaleString("en-IN"),
        "Updated At": new Date(request.updatedAt).toLocaleString("en-IN"),
        "Request ID": request._id,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Edit Requests");

      // Download file
      const fileName = selectedDate
        ? `edit_requests_${selectedDate}.xlsx`
        : `edit_requests_all.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.dismiss(toastId);
      toast.success(
        `Exported ${exportData.length} edit requests successfully!`
      );
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to export edit requests");
      console.error("Export error:", err);
    }
  };

  const getStatusColor = (status: string): any => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "success";
      case "denied":
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(
      (request) =>
        request.targetModel?.toLowerCase().includes(term) ||
        request.editedBy?.email?.toLowerCase().includes(term) ||
        request.status?.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Edit Requests
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Filter by Date"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setPage(0);
            }}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />

          <TextField
            size="small"
            placeholder="Search by model, email, or status..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Refresh">
            <IconButton
              onClick={getAllRequestsData}
              color="primary"
              disabled={loading}
            >
              <RefreshCw size={20} />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportExcel}
            disabled={loading || data.length === 0}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredData.length === 0 ? (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {selectedDate
              ? `No edit requests found for ${selectedDate}`
              : "No edit requests found"}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflowX: "auto",
            width: "100%",
          }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableBody>
              {paginatedData.map((request) => (
                <TableRow
                  key={request._id}
                  onClick={() => navigate(`view/${request._id}`)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <TableCell sx={{ minWidth: 150 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {request.targetModel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {request.targetId?.slice(-8) || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 180 }}>
                    <Typography variant="body2">
                      {request.editedBy?.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.editedBy?.email || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 100 }}>
                    <Typography variant="caption" color="text.secondary">
                      {request.changes?.length || 0} change(s)
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 120 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ minWidth: 100 }}>
                    <Chip
                      label={request.status || "pending"}
                      color={getStatusColor(request.status)}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      minWidth: 80,
                      textAlign: "right",
                      display: { xs: "none", sm: "table-cell" },
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      onClick={() => navigate(`view/${request._id}`)}
                      size="small"
                      sx={{
                        backgroundColor: "#f0f0f0",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                        ml: 1,
                      }}
                    >
                      <Eye size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
