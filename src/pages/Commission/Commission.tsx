import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  Autocomplete,
  Box,
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
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  TablePagination
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import {
  getAllMarkingHead,
  getAllMarketer,
  getCommissionByMarketer
} from "src/utils/api.service";

type PersonItem = {
  _id: string;
  name: string;
  phone?: string;
  marketerCode?: string;
};

const Commission = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initType = searchParams.get('type') === 'marketer' ? 'marketer' : 'marketing-head';
  const initPage = Number(searchParams.get('page')) || 1;
  const initLimit = Number(searchParams.get('limit')) || 20;

  const [personType, setPersonType] = useState<"marketing-head" | "marketer">(initType);

  // Autocomplete state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [options, setOptions] = useState<PersonItem[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Data state
  const [commissionData, setCommissionData] = useState<any[]>([]);
  const [commissionSummary, setCommissionSummary] = useState<any>({ totalEarnDirect: 0, totalEarnCommission: 0, totalEarn: 0 });
  const [loadingData, setLoadingData] = useState(false);

  // Pagination
  const [page, setPage] = useState(initPage > 0 ? initPage - 1 : 0);
  const [rowsPerPage, setRowsPerPage] = useState(initLimit);
  const [totalCount, setTotalCount] = useState(0);

  const handleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "marketing-head" | "marketer" | null
  ) => {
    if (newType !== null) {
      setPersonType(newType);
      setSelectedPerson(null);
      setCommissionData([]);
      setCommissionSummary({ totalEarnDirect: 0, totalEarnCommission: 0, totalEarn: 0 });
      setTotalCount(0);
      setPage(0);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Options
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        let response;
        if (personType === "marketing-head") {
          response = await getAllMarkingHead({ search: debouncedSearch, page: 1, limit: 20 });
        } else {
          response = await getAllMarketer({ search: debouncedSearch, page: 1, limit: 20 });
        }
        if (response.status && response.data?.data) {
          setOptions(response.data.data);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, [debouncedSearch, personType]);

  // Fetch Data
  useEffect(() => {
    const fetchCommission = async () => {
      if (!selectedPerson?._id) {
        setCommissionData([]);
        setCommissionSummary({ totalEarnDirect: 0, totalEarnCommission: 0, totalEarn: 0 });
        setTotalCount(0);
        return;
      }
      setLoadingData(true);
      try {
        const queryParams: any = {
          page: page + 1,
          limit: rowsPerPage,
          onlyMarketer: personType === "marketer",
        };
        if (dateFrom) queryParams.dateFrom = dateFrom;
        if (dateTo) queryParams.dateTo = dateTo;

        const response: any = await getCommissionByMarketer(selectedPerson._id, queryParams);
        
        if (response.status && response.data) {
          setCommissionData(response.data.data || []);
          setCommissionSummary(response.data.commission || { totalEarnDirect: 0, totalEarnCommission: 0, totalEarn: 0 });
          setTotalCount(response.data.pagination?.total || 0);
        } else {
          setCommissionData([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("Error fetching commission:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchCommission();
  }, [selectedPerson, page, rowsPerPage, dateFrom, dateTo, personType]);

  // Sync state to URL params
  useEffect(() => {
    const params: any = {};
    params.type = personType;
    if (page > 0) params.page = (page + 1).toString();
    if (rowsPerPage !== 20) params.limit = rowsPerPage.toString();
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    
    // Also persist who was selected so refresh doesn't completely lose track (hydration would require API fetch)
    if (selectedPerson?._id && selectedPerson?.name) {
       params.id = selectedPerson._id;
       params.name = selectedPerson.name;
    }

    setSearchParams(params, { replace: true });
  }, [personType, page, rowsPerPage, dateFrom, dateTo, selectedPerson, setSearchParams]);

  // Hydrate selected person from URL if present and missing locally 
  useEffect(() => {
    const urlId = searchParams.get('id');
    const urlName = searchParams.get('name');
    if (urlId && urlName && !selectedPerson) {
      setSelectedPerson({ _id: urlId, name: urlName } as PersonItem);
    }
  }, []); // Only run once on mount

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Commission Calculation
        </Typography>
      </Box>

      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Select Type
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={personType}
              exclusive
              onChange={handleTypeChange}
              aria-label="Person Type"
              fullWidth
            >
              <ToggleButton value="marketing-head">Marketing Head</ToggleButton>
              <ToggleButton value="marketer">Marketer Detail</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          
          <Grid size={{ xs: 12, md: 8 }}>
             <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Select {personType === 'marketing-head' ? 'Marketing Head' : 'Marketer'}
            </Typography>
            <Autocomplete
              fullWidth
              options={options}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              loading={loadingOptions}
              value={selectedPerson}
              onChange={(_, newValue) => { setSelectedPerson(newValue); setPage(0); }}
              onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`Search...`}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingOptions ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Date From"
              InputLabelProps={{ shrink: true }}
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
             <TextField
              fullWidth
              type="date"
              label="Date To"
              InputLabelProps={{ shrink: true }}
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Summary Cards */}
      {selectedPerson && !loadingData && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.lighter', color: 'primary.darker' }}>
              <Typography variant="subtitle2">Total Earn Direct</Typography>
              <Typography variant="h3">₹ {commissionSummary?.totalEarnDirect || 0}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.lighter', color: 'info.darker' }}>
              <Typography variant="subtitle2">Total Earn Commission</Typography>
              <Typography variant="h3">₹ {commissionSummary?.totalEarnCommission || 0}</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.lighter', color: 'success.darker' }}>
              <Typography variant="subtitle2">Total Earn</Typography>
              <Typography variant="h3">₹ {commissionSummary?.totalEarn || 0}</Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Results Table */}
      {selectedPerson && (
        <Card>
          {loadingData ? (
            <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : commissionData.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ bgcolor: "background.neutral" }}>
                    <TableRow>
                      <TableCell>Customer Code</TableCell>
                      <TableCell>EMI No</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Comm. Amount</TableCell>
                      <TableCell>EMI Amount</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Earn Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commissionData.map((row) => {
                       const marketerDetail = row.marketer?.find((m: any) => m.marketerId === selectedPerson._id) || row.marketer?.[0];
                       const isDirect = marketerDetail?.percentage !== "1%";
                        
                       return (
                      <TableRow key={row._id} hover>
                        <TableCell>{row.customerCode}</TableCell>
                        <TableCell>{row.emiNo}</TableCell>
                        <TableCell>{row.paymentDate ? dayjs(row.paymentDate).format('DD MMM YYYY') : '-'}</TableCell>
                        <TableCell>₹ {marketerDetail?.commAmount || 0}</TableCell>
                        <TableCell>₹ {marketerDetail?.emiAmount || 0}</TableCell>
                        <TableCell>{marketerDetail?.percentage || "-"}</TableCell>
                        <TableCell>{isDirect ? "Direct" : "Commission"}</TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Box sx={{ p: 5, textAlign: "center", color: "text.secondary" }}>
              <Typography>No commission data found.</Typography>
            </Box>
          )}
        </Card>
      )}
    </DashboardContent>
  );
};

export default Commission;
