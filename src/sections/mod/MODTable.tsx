/* eslint-disable perfectionist/sort-imports */
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
  Checkbox,
  TableRow,
  TableCell,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DashboardContent } from "src/layouts/dashboard";
import { Iconify } from "src/components/iconify";

import { deleteMOD, getAllMOD } from "src/utils/api.service";
import { useNavigate } from "react-router-dom";
import { Column, DataTable } from "src/custom/dataTable/dataTable";

interface Project {
  id: string;
  siteName: string;
  plotNo: string;
}

const MODTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const getMOD = async () => {
    try {
      const response = await getAllMOD();
      if (response.status) {
        console.log(response.data.data);
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMOD();
  }, []);

  const customerColumns: Column<Project>[] = [
    { id: "siteName", label: "Site Name", sortable: true },
    { id: "plotNo", label: "Plot NO", sortable: true },
  ];

  const handleDelete = async (id: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );
    if (!confirmed) return;

    try {
      console.log(id);
      await deleteMOD(String(id)); // convert to string if needed by API
      getMOD(); // re-fetch data (not getAllCustomer again)
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          MOD List
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate("create")}
        >
          New MOD
        </Button>
      </Box>

      <Card>
        <DataTable
          title="Customer Table"
          data={data}
          columns={customerColumns}
          searchBy="siteName"
          // onEdit={handleEdith}
          onDelete={handleDelete}
        />
      </Card>
    </DashboardContent>
  );
};

export default MODTable;
