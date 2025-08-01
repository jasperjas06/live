/* eslint-disable perfectionist/sort-imports */
// NVTTablePage.tsx
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';


import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { applyFilter, emptyRows, getComparator } from '../user/utils';
import { UserTableToolbar } from '../user/user-table-toolbar';
import { UserTableHead } from '../user/user-table-head';
import { TableEmptyRows } from '../user/table-empty-rows';
import { TableNoData } from '../user/table-no-data';

import { _nvtUsers } from 'src/_mock';
import { NVTTableRow } from 'src/pages/NVT/nvt-table-row';
import { useNavigate } from 'react-router-dom'; 
import { deleteNVT, getAllNVT } from 'src/utils/api.service';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';

interface Project {
     id: string;
    customerName: string;
    introducerName: string;
    totalPayment: number;
    initialPayment:number;
    emi:number
}

export function NVTTable() {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const [data,setData] = useState([])
  const navigate = useNavigate()

const getData = async () => {
  try {
    const response = await getAllNVT();
    if (response.status) {
      const enrichedData = response.data.data.map((item: any) => ({
        ...item,
        customerName: item.customer?.name || 'N/A', // fallback if name is missing
      }));

      setData(enrichedData);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  getData();
}, []);
  const handleDelete = async (id: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this NVT?",
    );
    if (!confirmed) return;

    try {
      console.log(id);
      await deleteNVT(String(id)); // convert to string if needed by API
      getData(); // re-fetch data (not getAllCustomer again)
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };
       const customerColumns: Column<Project>[] = [
       { id: 'customerName', label: 'Customer Name', sortable: true },
       { id: 'introducerName', label: 'Introducer Name', sortable: true },
       { id: 'totalPayment', label: 'Total Payment', sortable: true },
       { id: 'initialPayment', label: 'Initial Payment', sortable: true },
       { id: 'emi', label: 'EMI', sortable: true },
     ];
  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          NVT
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={()=>navigate("create-nvt")}
        >
          New NVT
        </Button>
      </Box>
      <DataTable
                  title="NVT Table"
                  data={data}
                  columns={customerColumns}
                  searchBy="customerName"
                  // onEdit={handleEdith}
                  onDelete={handleDelete}
                  />
     
    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}