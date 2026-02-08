import { Download, Eye, RefreshCw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { getBillingRequest, getEditRequest } from "src/utils/api.auth";



const Requests = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize state from URL params for Billing tab
  const [page, setPage] = useState((Number(searchParams.get('page')) || 1) - 1);
  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.get('limit')) || 10);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || "");
  
  const [selectedDate, setSelectedDate] = useState("");
  const [currentTab, setCurrentTab] = useState(Number(searchParams.get('tab')) || 0); // 0: Billing, 1: Others
  const [pagination, setPagination] = useState<any>(null); // Backend pagination for Billing tab

  // Sync state to URL params for both tabs
  useEffect(() => {
        const params: any = {};
        params.tab = currentTab.toString();
        if (debouncedSearch) params.search = debouncedSearch;
        if (page > 0) params.page = (page + 1).toString();
        if (rowsPerPage !== 10) params.limit = rowsPerPage.toString();
        
        setSearchParams(params, { replace: true });
  }, [debouncedSearch, page, rowsPerPage, currentTab, setSearchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setPage(0);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);



  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: any = {};
      
      // Only add date if user has selected one
      if (selectedDate) {
        params.date = selectedDate;
      }

      // Add pagination and search params for both tabs
      params.page = page + 1; // Backend uses 1-indexed pages
      params.limit = rowsPerPage;
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      let response;
      if (currentTab === 0) {
        // Billing Requests
        response = await getBillingRequest(params);
      } else {
        // Edit Requests (Others)
        response = await getEditRequest(params);
      }

      console.log("Request API response:", response.data);

      if (Array.isArray(response.data)) {
        setData(response.data);
        setPagination(null);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setData(response.data.data);
        // Store pagination info
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination(null);
        }
      } else {
        setData([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab !== 0) { // This check was effectively useless as we want to trigger on any tab switch if handled properly, but since we reset state on tab change, let's keep the logic clean
       // Actually, the reset logic is in handleTabChange, this effect was for initialization/refetch. 
       // We can merge the fetching logic.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, selectedDate]);

  // Fetch when page, rowsPerPage, debouncedSearch, selectedDate or tab changes
  useEffect(() => {
      // Re-initialize state from URL params when tab changes or initial load
      // But handleTabChange wipes URL params.
      // So when tab changes, URL params are empty -> state becomes default.
      // If page reload -> URL params exist -> state restored.
      
      // We need to ensure we don't double fetch or overwrite state incorrectly.
      // The previous logic for Billing had setPage etc inside useEffect.
      
      // If we simply fetch on dependency change, it should be fine.
      fetchRequests();
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, debouncedSearch, selectedDate, currentTab]); 

  const handleExportExcel = async () => {
    const toastId = toast.loading("Exporting requests...");

    try {
      const params: any = { export: "true" };

      if (selectedDate) {
        params.date = selectedDate;
      }

      let response;
      if (currentTab === 0) {
        response = await getBillingRequest(params);
      } else {
        response = await getEditRequest(params);
      }

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

      let excelData = [];
      let sheetName = "";
      let fileNamePrefix = "";

      if (currentTab === 0) {
        // Billing Export
        sheetName = "Billing Requests";
        fileNamePrefix = "billing_requests";
        excelData = exportData.map((request: any) => ({
          "User Name": request.userId?.name || "N/A",
          "Phone": request.userId?.phone || "N/A",
          "Email": request.userId?.email || "N/A",
          "Request For": request.requestFor || "N/A",
          "Status": request.status || "pending",
          "Message": request.message || "N/A",
          "Excel From Date": request.excelFromDate ? new Date(request.excelFromDate).toLocaleDateString("en-IN") : "N/A",
          "Excel To Date": request.excelToDate ? new Date(request.excelToDate).toLocaleDateString("en-IN") : "N/A",
          "Created At": new Date(request.createdAt).toLocaleString("en-IN"),
          "Updated At": new Date(request.updatedAt).toLocaleString("en-IN"),
        }));
      } else {
        // Others (Edit Request) Export
        sheetName = "Edit Requests";
        fileNamePrefix = "edit_requests";
        excelData = exportData.map((request: any) => ({
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
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Download file
      const fileName = selectedDate
        ? `${fileNamePrefix}_${selectedDate}.xlsx`
        : `${fileNamePrefix}_all.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.dismiss(toastId);
      toast.success(
        `Exported ${exportData.length} requests successfully!`
      );
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to export requests");
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
      // Reset all filters and pagination
      setSearchTerm("");
      setDebouncedSearch("");
      setSelectedDate("");
      setPage(0);
      setRowsPerPage(10);
      
      // Clear URL params but keep tab
      setSearchParams({ tab: newValue.toString() }, { replace: true });
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Requests
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="request tabs">
                <Tab label="Billing" />
                <Tab label="Others" />
            </Tabs>
        </Box>

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
            InputProps={{
              endAdornment: selectedDate && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedDate("");
                      setPage(0);
                    }}
                    edge="end"
                  >
                    <X size={16} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <TextField
            size="small"
            placeholder={currentTab === 0 ? "Search by user, email, status...": "Search by model, email, or status..."}
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
              onClick={fetchRequests}
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
      ) : data.length === 0 ? (
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
              ? `No requests found for ${selectedDate}`
              : "No requests found"}
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
             {currentTab === 0 && (
                 <TableHead>
                     <TableRow>
                         <TableCell>User</TableCell>
                         <TableCell>Request For</TableCell>

                         <TableCell>Created At</TableCell>
                         <TableCell>Status</TableCell>
                     </TableRow>
                 </TableHead>
             )}
            <TableBody>
              {data.map((request) => (
                <TableRow
                  key={request._id}
                  // Navigate for both billing (tab 0) and others (tab 1)
                  onClick={() => 
                    currentTab === 0 
                      ? navigate(`view/billing/${request._id}`) 
                      : navigate(`view/${request._id}`)
                  }
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                    {currentTab === 0 ? (
                        <>
                             {/* Billing Tab Columns */}
                            <TableCell sx={{ minWidth: 150 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                {request.userId?.name || "Unknown"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                {request.userId?.phone || "N/A"}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                {request.userId?.email || "N/A"}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={request.requestFor === "create" ? "Verify Bill" : request.requestFor} size="small" variant="outlined" />
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
                                onClick={() => navigate(`view/billing/${request._id}`)}
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
                        </>
                    ) : (
                        <>
                        {/* Others Tab Columns (Existing Logic) */}
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
                        </>
                    )}
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Unified Pagination for both tabs */}
          {pagination && (
            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {pagination.totalRecords} record{pagination.totalRecords !== 1 ? 's' : ''}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setPage(prev => prev - 1)}
                  disabled={page === 0}
                  size="small"
                >
                  Previous
                </Button>
                
                <Typography variant="body2">
                  Page {page + 1} of {pagination.totalPages}
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page + 1 >= pagination.totalPages}
                  size="small"
                >
                  Next
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </DashboardContent>
  );
};

export default Requests;
