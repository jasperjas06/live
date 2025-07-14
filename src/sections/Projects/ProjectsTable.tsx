/* eslint-disable react/jsx-no-undef */
/* eslint-disable perfectionist/sort-imports */

import { Box, Button, Card, Table, TableBody, TableContainer, TablePagination, Typography } from '@mui/material';
import React, { useState } from 'react'
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { UserTableToolbar } from '../user/user-table-toolbar';
import { Scrollbar } from 'src/components/scrollbar';
import { UserTableHead } from '../user/user-table-head';
import { useTable } from '../user/view';
import { useNavigate } from 'react-router-dom';
import { _nvtUsers } from 'src/_mock';
import { applyFilter, emptyRows, getComparator } from '../user/utils';
import { NVTTableRow } from 'src/pages/NVT/nvt-table-row';
import { TableEmptyRows } from '../user/table-empty-rows';
import { TableNoData } from '../user/table-no-data';

// eslint-disable-next-line arrow-body-style
const ProjectsTable = () => {
    const table = useTable();
  const [filterName, setFilterName] = useState('');
  const navigate = useNavigate()

   const nvtUsersWithProps = _nvtUsers.map((user) => ({
      ...user,
      role: '', // or a default value
      company: '', // or a default value
      avatarUrl: '', // or a default value
      isVerified: false, // or a default value
    }));
  
    const dataFiltered = applyFilter({
      inputData: nvtUsersWithProps,
      comparator: getComparator(table.order, table.orderBy),
      filterName,
    });
  
    const notFound = !dataFiltered.length && !!filterName;
  
  return (
    <div>
          <DashboardContent>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                Projects
              </Typography>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={()=>navigate("create")}
              >
                New Project
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
                  <Table sx={{ minWidth: 800 }}>
                    <UserTableHead
                      order={table.order}
                      orderBy={table.orderBy}
                      rowCount={_nvtUsers.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked) =>
                        table.onSelectAllRows(
                          checked,
                          _nvtUsers.map((user) => user.id)
                        )
                      }
                      headLabel={[
                        { id: 'name', label: 'Name' },
                        { id: 'customerId', label: 'Customer ID' },
                        { id: 'phoneNumber', label: 'Phone Number' },
                        { id: 'introducer', label: 'Introducer' },
                        { id: 'totalPayment', label: 'Total Payment' },
                        { id: 'initialPayment', label: 'Initial Payment' },
                        { id: 'emi', label: 'EMI' },
                        { id: 'conversion', label: 'Conversion', align: 'center' },
                        { id: 'mod', label: 'MOD', align: 'center' },
                        { id: 'status', label: 'Status' },
                        { id: '' },
                      ]}
                    />
                    <TableBody>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <NVTTableRow
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
                          _nvtUsers.length
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
                count={_nvtUsers.length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
              />
            </Card>
          </DashboardContent>
    </div>
  )
}

export default ProjectsTable
