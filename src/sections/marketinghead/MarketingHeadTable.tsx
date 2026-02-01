import type { Column } from 'src/custom/dataTable/dataTable';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Typography } from '@mui/material';

import { deleteMarketingHead, getAllMarkingHead } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age : number
};

const MarketingHeadTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const getAllData = async () =>{
    try {
        const response = await getAllMarkingHead();
        // console.log(response.data.data)
        if(response.status){
            setData(response.data.data)
        }
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(()=>{
    getAllData()
  },[])

   const customerColumns: Column<Customer>[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'age', label: 'Age', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'phone', label: 'Phone', sortable: false },
  // 
  ];

  const handleDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const response: any = await deleteMarketingHead(String(deleteId));
        if (response) {
          toast.success('Marketing Head deleted successfully');
          getAllData();
        } else {
          toast.error('Failed to delete Marketing Head');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete Marketing Head');
      }
    }
    setOpenDialog(false);
    setDeleteId(null);
  };
  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Marketing Head
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
          disabled={permissions["Marketing Head"]?.create !== true}
        >
          New Marketing Head
        </Button>
      </Box>
      <DataTable
                title="Customer Table"
                data={data}
                columns={customerColumns}
                searchBy="name"
                onDelete={handleDelete}
                isDelete={permissions["Marketing Head"]?.delete === true ? true : false}
          isEdit={permissions["Marketing Head"]?.update === true ? true : false}
          isView={permissions["Marketing Head"]?.read === true ? true : false}
              />
        
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Confirm Delete"
          content="Are you sure you want to delete this Marketing Head? This action cannot be undone."
          action={handleConfirmDelete}
        />
    </DashboardContent>
  );
};

export default MarketingHeadTable;
