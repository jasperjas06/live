/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/self-closing-comp */
/* eslint-disable default-case */
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';

import {
  Box,
  Table,
  Paper,
  TableRow,
  Checkbox,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  TableContainer,
  TableSortLabel,
  InputAdornment,
  TablePagination,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import {MoreVerticalIcon} from "lucide-react"

type Order = 'asc' | 'desc';

export type Column<T> = {
  id: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string | number;
};

type DataTableProps<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  searchBy?: keyof T;
  isView?:boolean;
  isDelete?:boolean;
  onDelete?: (id: string | number) => Promise<void> | void;
  onEdit?: (id: string | number) => void;
  onView?: (id: string | number) => void;
};

export function DataTable<T extends { id: string | number }>({
  title = 'Data Table',
  data,
  columns,
  searchBy,
  onDelete,
  onEdit,
  onView,
  isView = true,
  isDelete = true,
}: DataTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0].id);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const handleSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = data.map((d) => d.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleRowClick = (id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((sid) => sid !== id);
    }

    setSelected(newSelected);
  };

  const filteredData = searchBy
    ? data.filter((row) =>
        String(row[searchBy]).toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    return order === 'asc'
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ 
      borderRadius: 3, 
      boxShadow: '0 0 20px rgba(0,0,0,0.05)', 
      p: 2, 
      width: '100%',
      overflowX: 'auto'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          sx={{ 
            width: isMobile ? '100%' : '300px', 
            backgroundColor: '#F9FAFB', 
            borderRadius: 2 
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#667085" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 14L11.1 11.1" stroke="#667085" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: isMobile ? 600 : 800 }}>
          <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
            <TableRow>
              {/* <TableCell padding="checkbox" sx={{ width: '48px' }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < data.length}
                  checked={data.length > 0 && selected.length === data.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell> */}
              {columns.map((col) => (
                <TableCell 
                  key={String(col.id)}
                  sx={{ 
                    width: col.width || 'auto',
                    minWidth: col.width ? undefined : '120px'
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={order}
                      onClick={() => handleSort(col.id)}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        {col.label}
                      </Typography>
                    </TableSortLabel>
                  ) : (
                    <Typography variant="subtitle2" fontWeight={600}>
                      {col.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
              <TableCell sx={{ width: '48px' }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <TableRow 
                key={row.id} 
                hover 
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={() => handleRowClick(row.id)}
                  />
                </TableCell> */}
                {columns.map((col) => (
                  <TableCell key={String(col.id)}>
                    {col.render
                      ? col.render(row[col.id], row)
                      : <Typography variant="body2">{String(row[col.id])}</Typography>}
                  </TableCell>
                ))}
                <TableCell>
                  <ActionMenu 
                    row={row} 
                    onDelete={onDelete} 
                    onEdit={onEdit}
                    onView={onView}
                    isView={isView}
                    isDelete={isDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ 
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1
          }
        }}
      />
    </Paper>
  );
}

// Enhanced ActionMenu Component
type ActionMenuProps<T> = {
  row: T & { _id?: any; id?: string | number };
  onDelete?: (id: string | number) => Promise<void> | void;
  onEdit?: (id: string | number) => void;
  onView?: (id: string | number) => void;
  isView?: boolean;
  isDelete?: boolean;
};

export function ActionMenu<T>({ row, onDelete, onEdit, onView,isView = true, isDelete= true }: ActionMenuProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = async (action: 'view' | 'edit' | 'delete') => {
    handleClose();
    const id = row._id || row.id;
    
    if (!id) return;

    switch (action) {
      case 'view':
        if (onView) {
          onView(id);
        } else {
          navigate(`view/${id}`);
        }
        break;
      case 'edit':
        if (onEdit) {
          onEdit(id);
        } else {
          navigate(`edit/${id}`);
        }
        break;
      case 'delete':
        if (onDelete) {
          try {
            setIsDeleting(true);
            await onDelete(id);
          } finally {
            setIsDeleting(false);
          }
        } else if (window.confirm('Are you sure you want to delete this item?')) {
          console.log('Delete logic here for ID:', id);
        }
        break;
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        sx={{ padding: '6px' }}
      >
        <MoreVerticalIcon  />
      </IconButton>
      
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '160px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
         {isView && (
          <MenuItem onClick={() => handleAction('view')} dense>
            View
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction('edit')} dense>
          Edit
        </MenuItem>
        {
          isDelete && 
        <MenuItem 
          onClick={() => handleAction('delete')} 
          dense
          disabled={isDeleting}
          sx={{ color: 'error.main' }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </MenuItem>
        }
      </Menu>
    </div>
  );
}