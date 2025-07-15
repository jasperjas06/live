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
import { _customers } from 'src/_mock';
import { CustomerTableRow } from 'src/pages/Customer/customer-table-row';
import { useNavigate } from 'react-router-dom';



// MAIN COMPONENT
const CustomerTable = () => {
  const table = useTable();
  const [filterName, setFilterName] = useState('');
  const navigate = useNavigate()

  const dataFiltered = applyFilter({
    inputData: _customers.map((customer) => ({
      id: customer.customerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      marketerName: customer.marketerName,
      paymentTerms: customer.paymentTerms,
      emiAmount: customer.emiAmount,
      duration: customer.duration,
      // Provide default values for missing UserProps fields
      role: 'customer',
      status: 'active',
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
          Customers
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={()=>navigate("create")}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Customer
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
                rowCount={_customers.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _customers.map((row) => row.customerId)
                  )
                }
                headLabel={[
                  { id: 'customerId', label: 'Customer ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'address', label: 'Address' },
                  { id: 'city', label: 'City' },
                  { id: 'state', label: 'State' },
                  { id: 'pincode', label: 'Pincode' },
                  { id: 'marketerName', label: 'Marketer' },
                  { id: 'paymentTerms', label: 'Payment Terms' },
                  { id: 'emiAmount', label: 'EMI Amount' },
                  { id: 'duration', label: 'Duration' },
                ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CustomerTableRow
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
                    _customers.length
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
          count={_customers.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
};

export default CustomerTable;
