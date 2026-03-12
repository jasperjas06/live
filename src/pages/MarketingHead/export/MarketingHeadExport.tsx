import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import {
  getAllMarkingHead,
  getMarketingHeadFullHierarchy,
} from "src/utils/api.service";

type HeadItem = {
  _id: string;
  name: string;
  phone?: string;
};

type DownlineItem = {
  _id: string;
  name: string;
  phone: string | number;
  level: number;
  leaderName?: string;
  status: string;
  id?: string | number;
  leaderID?: string | number;
};

const MarketingHeadExport = () => {
  const navigate = useNavigate();

  // Autocomplete state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [headOptions, setHeadOptions] = useState<HeadItem[]>([]);
  const [selectedHead, setSelectedHead] = useState<HeadItem | null>(null);
  const [loadingHeads, setLoadingHeads] = useState(false);

  // Hierarchy table state
  const [downlineData, setDownlineData] = useState<DownlineItem[]>([]);
  const [loadingDownline, setLoadingDownline] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Marketing Heads for Autocomplete
  useEffect(() => {
    const fetchHeads = async () => {
      setLoadingHeads(true);
      try {
        const response = await getAllMarkingHead({
          search: debouncedSearch,
          page: 1,
          limit: 10,
        });
        if (response.status && response.data?.data) {
          setHeadOptions(response.data.data);
        } else {
          setHeadOptions([]);
        }
      } catch (error) {
        console.error("Error fetching marketing heads:", error);
      } finally {
        setLoadingHeads(false);
      }
    };
    fetchHeads();
  }, [debouncedSearch]);

  // Fetch Hierarchy when Head is selected
  useEffect(() => {
    const fetchHierarchy = async () => {
      if (!selectedHead?._id) {
        setDownlineData([]);
        return;
      }
      setLoadingDownline(true);
      try {
        const response: any = await getMarketingHeadFullHierarchy(
          selectedHead._id,
        );
        if (response.status && response.data?.downline) {
          const rawDownline: DownlineItem[] = response.data.downline;
          // Sort the downline basically by Level
          const sorted = [...rawDownline].sort((a, b) => a.level - b.level);
          setDownlineData(sorted);
        } else {
          setDownlineData([]);
        }
      } catch (error) {
        console.error("Error fetching downline hierarchy:", error);
      } finally {
        setLoadingDownline(false);
      }
    };

    fetchHierarchy();
  }, [selectedHead]);

  // Export to Excel function
  const handleExport = () => {
    if (!downlineData || downlineData.length === 0) return;

    // Based on user requirements: Level, Name, Leader Name, Phone, Status
    const exportData = downlineData.map((item) => ({
      LevelId: item.level,
      ID: item.id || "-",
      Name: item.name,
      "Leader ID": item.leaderID || "-",
      "Leader Name": item.leaderName || "-",
      Phone: item.phone || "-",
      Status: item.status || "-",
    }));

    // Grouping by level (Sorting already handles the visual grouping of levels.
    // In excel, sorting by level creates exactly the grouped effect shown in your first image)
    const sortedExportData = exportData.sort(
      (a, b) => (a.LevelId || 0) - (b.LevelId || 0),
    );

    const worksheet = XLSX.utils.json_to_sheet(sortedExportData);
    const workbook = XLSX.utils.book_new();
    const sheetName = selectedHead?.name
      ? selectedHead.name.substring(0, 31)
      : "Marketing Head List";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Save File
    const fileName = selectedHead?.name
      ? `${selectedHead.name}.xlsx`
      : "MarketingHead_List.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Marketing Head Export
        </Typography>

        {/* Export Button */}
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:download-line" />}
          sx={{ mr: 2, bgcolor: "#118D57", "&:hover": { bgcolor: "#0d6a41" } }} // Excel green color
          onClick={handleExport}
          disabled={!downlineData || downlineData.length === 0}
        >
          Download Excel
        </Button>

        <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      {/* Select Marking Head Card */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Select Marketing Head
        </Typography>
        <Autocomplete
          fullWidth
          options={headOptions}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          loading={loadingHeads}
          value={selectedHead}
          onChange={(_, newValue) => setSelectedHead(newValue)}
          onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search or select a marketer head..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingHeads ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Card>

      {/* Results Table */}
      {selectedHead && (
        <Card sx={{ mt: 3 }}>
          {loadingDownline ? (
            <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : downlineData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "background.neutral" }}>
                  <TableRow>
                    <TableCell>Level</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Leader ID</TableCell>
                    <TableCell>Leader Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {downlineData.map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell>{row.level}</TableCell>
                      <TableCell>{row.id || "-"}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.leaderID || "-"}</TableCell>
                      <TableCell>{row.leaderName || "-"}</TableCell>
                      <TableCell>{row.phone || "-"}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor:
                                row.status === "active"
                                  ? "success.main"
                                  : "error.main",
                              mr: 1,
                            }}
                          />
                          {row.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 5, textAlign: "center", color: "text.secondary" }}>
              <Typography>No downline data found for this head.</Typography>
            </Box>
          )}
        </Card>
      )}
    </DashboardContent>
  );
};

export default MarketingHeadExport;
