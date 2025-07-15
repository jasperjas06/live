/* eslint-disable react/jsx-no-undef */
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
} from '@mui/material';
import React, { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { UserTableToolbar } from '../user/user-table-toolbar';
import { Scrollbar } from 'src/components/scrollbar';
import { UserTableHead } from '../user/user-table-head';
import { useTable } from '../user/view';
import { useNavigate } from 'react-router-dom';
import { applyFilter, emptyRows, getComparator } from '../user/utils';
import { TableEmptyRows } from '../user/table-empty-rows';
import { TableNoData } from '../user/table-no-data'; // <-- Create this component
import { _lfcProjects } from 'src/_mock';
import { LFCProjectTableRow } from 'src/pages/LFC/lfc-project-table-row';

const LFCTable = () => {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const navigate = useNavigate();

  const lfcProjectsWithMeta = _lfcProjects.map((project) => ({
    ...project,
    id: project.customerId ?? '', // Use customerId as unique id
    status: 'active', // Provide a default 'status'
    name: project.customerName || '',
    role: '',
    company: '',
    avatarUrl: '',
    isVerified: false,
  }));

  const dataFiltered = applyFilter({
    inputData: lfcProjectsWithMeta,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          LFC 
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
        >
          New LFC 
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 1000 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={lfcProjectsWithMeta.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    lfcProjectsWithMeta.map((proj) => proj.id)
                  )
                }
                headLabel={[
  { id: 'customerId', label: 'Customer ID' },
  { id: 'customerName', label: 'Customer Name' },
  { id: 'pl', label: 'PL' },
  { id: 'introductionName', label: 'Introducer' },
  { id: 'ent', label: 'Ent' },
  { id: 'fustral', label: 'Fustral' },
  { id: 'payout', label: 'Payout' },
  { id: 'plotNo', label: 'Plot No' },
  { id: 'needHos', label: 'Need HOS' },
  { id: 'registration', label: 'Registration' },
  { id: 'conversion', label: 'Converted' },
]}

              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <LFCProjectTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    lfcProjectsWithMeta.length
                  )}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={lfcProjectsWithMeta.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
};

export default LFCTable;
