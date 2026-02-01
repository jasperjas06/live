import type { Column } from 'src/custom/dataTable/dataTable';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import { deleteMarketer, getAllMarketer } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';

type Customer = {
  id: string;
  name: string;
  phone: string;
  headbyName: string;
};

const MarketerTable = () => {
  const navigate = useNavigate();
  const [data,setData] = useState<any>([])
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

const getAllData = async () => {
  try {
    const response = await getAllMarketer();
    if (response.status) {
      const updatedData = response.data.data.map((item:any) => ({
        ...item,
        headbyName: item.headBy?.name || 'N/A',
      }));
      setData(updatedData);
    }
  } catch (error) {
    console.log(error);
  }
};



  useEffect(()=>{
    getAllData()
  },[])

  const handleDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response: any = await deleteMarketer(deleteId);
        if (response) {
          toast.success('Marketer deleted successfully');
          getAllData();
        } else {
          toast.error('Failed to delete marketer');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete marketer');
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
  };

  const customerColumns: Column<Customer>[] = [
      { id: 'name', label: 'Name', sortable: true },
      { id: 'phone', label: 'Phone', sortable: false },
      {
    id: 'headbyName',
    label: 'Head By',
    sortable: false,
  },
    // 
    ];

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Marketer
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
          disabled={permissions?.Marketer?.create !== true}
        >
          New Marketer
        </Button>
      </Box>
        <DataTable
                        title="Customer Table"
                        data={data}
                        columns={customerColumns}
                        searchBy="name"
                        isDelete={permissions?.Marketer?.delete === true ? true : false}
          isEdit={permissions?.Marketer?.update === true ? true : false}
          isView={permissions?.Marketer?.read === true ? true : false}
          preserveOrder={true}
          onDelete={handleDelete}
        />
        
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Confirm Delete"
          content="Are you sure you want to delete this marketer? This action cannot be undone."
          action={handleConfirmDelete}
        />
    </DashboardContent>
  );
};

export default MarketerTable;
