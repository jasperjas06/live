/* eslint-disable perfectionist/sort-imports */
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Download, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardContent } from "src/layouts/dashboard";
import { getAllLogs } from "src/utils/api.service";
import * as XLSX from "xlsx";

interface LogItem {
  _id: string;
  moduleName: string;
  createdAt: string;
  createdBy?: string;
}

interface LogsResponse {
  data: LogItem[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  totalCount?: number;
}

// Module name to route mapping
const MODULE_ROUTES: Record<string, string | null> = {
  Customer: "customer",
  Percentage: null, // No view page,
  Marketer: "marketer",
  "Marketing Head": "marketing-head",
  Roles: null, // No view page
  Employee: null, // No view page
  "Roles & Menu Mapping": "role&menu-mapping", // No view page
  Billing: "billing",
  NVT: "nvt",
  MOD: "mod",
  Request: "request",
  "Life Alliance": "life-alliance",
  "Edit Request": "edit-request",
  "Life Housing": null, // No view page,
  "Life Saving": "life-saving",
};

const LogsTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "0", 10)
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get("limit") || "10", 10)
  );
  const [totalCount, setTotalCount] = useState(0);
  // Date filter
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || new Date().toISOString().split("T")[0]
  );

  const getLogs = async (isExport = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllLogs({
        date: selectedDate,
        page: isExport ? undefined : page + 1,
        limit: isExport ? undefined : rowsPerPage,
        export: isExport ? "true" : undefined,
      });

      if (response.status === 200) {
        const logsData: LogsResponse = response.data;

        // Only update table data if NOT exporting
        if (!isExport) {
          setData(logsData.data || []);
          if (logsData.pagination) {
            setTotalCount(logsData.pagination.totalCount);
          }
        }

        return logsData.data;
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (err) {
      const errorMsg = "Failed to fetch logs. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }

    return undefined;
  };

  useEffect(() => {
    getLogs();
  }, [page, rowsPerPage, selectedDate]);

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("date", selectedDate);
    params.set("page", page.toString());
    params.set("limit", rowsPerPage.toString());
    setSearchParams(params, { replace: true });
  }, [selectedDate, page, rowsPerPage, setSearchParams]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setPage(0); // Reset to first page when date changes
  };

  const handleRowClick = (log: LogItem) => {
    const route = MODULE_ROUTES[log.moduleName];

    // Check if route is null (no view page available)
    if (route === null || route === undefined) {
      toast.error(`View not available for ${log.moduleName}`);
      return; // MUST have this return to stop execution
    }

    // Route exists, navigate to it
    navigate(`/${route}/view/${log._id}`);
  };

  const handleExportExcel = async () => {
    const toastId = toast.loading("Exporting logs...");

    try {
      // Make a fresh API call with export=true to get ALL data for selected date
      const response = await getAllLogs({
        date: undefined,
        page: undefined,
        limit: undefined,
        export: "true",
      });

      if (response.status !== 200) {
        toast.dismiss(toastId);
        toast.error(response.message || "Failed to export logs");
        return;
      }

      const exportData = response.data.data;

      if (!exportData || exportData.length === 0) {
        toast.dismiss(toastId);
        toast.error("No data to export");
        return;
      }

      // Transform data for Excel
      const excelData = exportData.map((log: LogItem) => ({
        "Module Name": log.moduleName,
        "Created At": new Date(log.createdAt).toLocaleString("en-IN"),
        "Created By": log.createdBy || "N/A",
        ID: log._id,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Logs");

      // Download file
      const fileName = `logs_${selectedDate}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.dismiss(toastId);
      toast.success(`Exported ${exportData.length} logs successfully!`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Failed to export logs");
      console.error("Export error:", err);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Activity Logs
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
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Refresh">
            <IconButton onClick={() => getLogs()} color="primary">
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Module Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Id
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Created At
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                    <Typography variant="body2" color="text.secondary">
                      No logs found for {selectedDate}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((log) => (
                  <TableRow
                    key={log._id}
                    hover
                    onClick={() => handleRowClick(log)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {log.moduleName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {log._id || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(log.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>
    </DashboardContent>
  );
};

export default LogsTable;
