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
} from '@mui/material';
import React, { useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { UserTableToolbar } from '../user/user-table-toolbar';
import { Scrollbar } from 'src/components/scrollbar';
import { UserTableHead } from '../user/user-table-head';
import { useTable } from '../user/view';
import { TableEmptyRows } from '../user/table-empty-rows';
import { TableNoData } from '../user/table-no-data';
import { applyFilter, emptyRows, getComparator } from '../user/utils';
import { _mods } from 'src/_mock';
import { MODTableRow } from 'src/pages/MOD/mod-table-row';
import { useNavigate } from 'react-router-dom';

// MOCK DATA


// ROW COMPONENT


// MAIN COMPONENT
const MODTable = () => {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const navigate = useNavigate()

  const dataFiltered = applyFilter({
  inputData: _mods.map((mod) => ({
    ...mod,
    role: '',
    company: '',
    avatarUrl: '',
    isVerified: false,
  })),
  comparator: getComparator(table.order, table.orderBy),
  filterName,
});


  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          MOD List
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={()=>navigate('create')}
        >
          New MOD
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
                rowCount={_mods.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _mods.map((row) => row.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'headBy', label: 'Head By' },
                  { id: 'head', label: 'Head' },
                  { id: 'phoneNumber', label: 'Phone' },
                  { id: 'address', label: 'Address' },
                  { id: 'status', label: 'Status' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <MODTableRow
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
                    _mods.length
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
          count={_mods.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
};

export default MODTable;
