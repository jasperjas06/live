import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { permissions } from 'src/common/Permissions';
import { Iconify } from 'src/components/iconify';
import type { Column } from 'src/custom/dataTable/dataTable';
import { DataTable } from 'src/custom/dataTable/dataTable';
import ConfirmDialog from "src/custom/dialog/ConfirmDialog";
import { DashboardContent } from 'src/layouts/dashboard';
import { BillingPagination } from "src/types/billing";
import { deleteBilling, getAllBilling } from 'src/utils/api.service';



type Customer = {
  id: string;
  customerId?: string;
  customerName: string;
  marketerName: string;
  emiNo: number;
  emiId: string;
  paidAmount: string;
  paidDate: string;
};

const BillingTable = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<Customer[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );

  const [pagination, setPagination] = useState<BillingPagination | null>(null);
  const pageSize = 10;
  let { id } = useParams();

  console.log(permissions, "permissions");

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

  const getAllData = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      };

      const response = await getAllBilling(params);

      if (response.status) {
        let billingData = response.data.data;
        billingData = billingData.map((item: any) => ({
          ...item,
          customerId:
            item.customer?.id || item.customer?._id || item.customerCode || "-",
          marketerName:
            item.introducer?.name ||
            item?.customer?.marketerName ||
            item?.customer?.cedId?.name ||
            item?.customer?.ddId?.name ||
            "-",
          paidDate:
            item.emi?.paidDate?.split("T")[0] ||
            item?.paymentDate?.split("T")[0] ||
            "-",
          customerName:
            item?.general?.customer?.name || item?.customer?.name || "-",
          // emiId: item.emi?._id || 'N/A',
          paidAmount:
            item.enteredAmount || item.emi?.paidAmt || item?.amountPaid || "-",
        }));
        setData(billingData);
        setPagination(response.data.pagination || null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, [currentPage, debouncedSearch]);

  const customerColumns: Column<Customer>[] = [
    {
      id: "customerId",
      label: "Customer ID",
      sortable: true,
      render: (value: any, row: Customer) => {
        const displayId = value || row.id || "N/A";
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{displayId}</Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(displayId);
                toast.success("Customer ID copied!");
              }}
              sx={{
                width: 24,
                height: 24,
                color: "text.secondary",
                opacity: 0.7,
                "&:hover": {
                  opacity: 1,
                  color: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              <Icon icon="solar:copy-outline" width={16} />
            </IconButton>
          </Box>
        );
      },
    },
    { id: "customerName", label: "Name", sortable: true },
    { id: "marketerName", label: "Marketer Name", sortable: true },
    { id: "emiNo", label: "Emi No", sortable: true },
    // { id: 'emiId', label: 'Emi Id', sortable: true },
    { id: "paidAmount", label: "Paid Amount", sortable: true },
    { id: "paidDate", label: "Paid Date", sortable: true },
  ];

  // Function to escape CSV values and handle special characters
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) return "";

    const stringValue = String(value);

    // If value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  // Function to download billing data as Excel (CSV format)
  const handleDownloadExcel = () => {
    try {
      setIsDownloading(true);

      // Define headers based on columns
      const headers = customerColumns.map((col) => col.label);

      // Convert data to CSV format
      const csvRows = [];

      // Add headers
      csvRows.push(headers.map(escapeCSVValue).join(","));

      // Add data rows
      data.forEach((row) => {
        const values = customerColumns.map((col) => {
          const value = row[col.id as keyof Customer];
          return escapeCSVValue(value);
        });
        csvRows.push(values.join(","));
      });

      // Join all rows with newline
      const csvContent = csvRows.join("\n");

      // Add BOM for proper Excel UTF-8 encoding
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      // Create download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `Billing_Report_${currentDate}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      setIsDownloading(false);
    } catch (error) {
      console.error("Failed to download billing data:", error);
      setIsDownloading(false);
      alert("Failed to download billing data. Please try again.");
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

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
        await deleteBilling(String(deleteId));
        getAllData();
      } catch (error) {
        console.error("Failed to delete billing:", error);
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1, minWidth: "200px" }}>
          Billing
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* <Button
            variant="outlined"
            color="success"
            onClick={handleDownloadExcel}
            disabled={isDownloading || data.length === 0}
            sx={{
              minWidth: '150px',
              '&:hover': {
                backgroundColor: 'success.light',
                color: 'white',
              },
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download Excel'}
          </Button> */}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<Iconify icon="mingcute:download-line" />}
            onClick={() => navigate("custom-export")}
            sx={{
              minWidth: "150px",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
            }}
          >
            Custom Download
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate("create")}
            disabled={permissions?.Billing?.create !== true}
            sx={{ minWidth: "150px" }}
          >
            New Billing
          </Button>
        </Box>
      </Box>

      {/* Search Input */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, mobile, billing ID, transaction type, payment mode..."
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
                  sx={{ minWidth: "auto", p: 0.5 }}
                >
                  <Iconify icon="mingcute:close-line" />
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "background.paper",
            },
          }}
        />
      </Box>

      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Data Table */}
      {!isLoading && (
        <DataTable
          title="Customer Table"
          data={data}
          columns={customerColumns}
          isDelete={permissions?.Billing?.delete === true ? true : false}
          isEdit={permissions?.Billing?.update === true ? true : false}
          isView={permissions?.Billing?.read === true ? true : false}
          onDelete={handleDelete}
          disableSearch={true}
          disablePagination={true}
          preserveOrder={true}
        />
      )}

      {/* Pagination Controls */}
      {pagination && !isLoading && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {pagination.totalRecords} record
            {pagination.totalRecords !== 1 ? "s" : ""}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </Button>

            <Typography variant="body2">
              Page {pagination.currentPage} of {pagination.totalPages}
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
        content="Are you sure you want to delete this billing record? This action cannot be undone."
        action={handleConfirmDelete}
      />
    </DashboardContent>
  );
};;

export default BillingTable;
