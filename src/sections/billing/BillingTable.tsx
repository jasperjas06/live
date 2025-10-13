import type { Column} from 'src/custom/dataTable/dataTable';

import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Button, Typography } from '@mui/material';

import { getAllBilling } from 'src/utils/api.service';

import { permissions } from 'src/common/Permissions';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/custom/dataTable/dataTable';

import { Iconify } from 'src/components/iconify';
import { number } from 'yup';


type Customer = {
  id: string;
  customerName: string;
  marketerName: string;
  emiNo: number;
  emiId: string;
  paidAmount: string;
  paidDate : string;
};

const BillingTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);

  let { id } = useParams();
  console.log(permissions,"permissions")



  const getAllData = async () =>{
    try {
        const response = await getAllBilling();
        // console.log(response.data.data)
        if(response.status){
            let data = response.data.data
            data = data.map((item:any) => ({
                ...item,
                marketerName: item.introducer?.name || 'N/A',
                paidDate: item.emi?.paidDate?.split('T')[0] || 'N/A',
                emiId: item.emi?._id || 'N/A',
                paidAmount: item.emi?.paidAmt || 'N/A',
            }))
            setData(data)
        }
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(()=>{
    getAllData()
  },[])

   const customerColumns: Column<Customer>[] = [
    { id: 'customerName', label: 'Name', sortable: true },
    { id: 'marketerName', label: 'Marketer Name', sortable: true },
    { id: 'emiNo', label: 'Emi No', sortable: true },
    { id: 'emiId', label: 'Emi Id', sortable: true },
    { id: 'paidAmount', label: 'Paid Amount', sortable: true },
    { id: 'paidDate', label: 'Paid Date', sortable: true },
    // { id: 'age', label: 'Age', sortable: true },
    // { id: 'email', label: 'Email', sortable: true },
    // { id: 'phone', label: 'Phone', sortable: false },
  // 
  ];

//   const handleDelete = async (id: string | number) => {
//     const confirmed = window.confirm('Are you sure you want to delete this customer?');
//     if (!confirmed) return;
  
//     try {
//       await deletebilling(String(id)); // convert to string if needed by API
//       getAllData(); // re-fetch data (not getAllCustomer again)
//     } catch (error) {
//       console.error('Failed to delete customer:', error);
//     }
//   };
  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Billing
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
          disabled={permissions?.Billing?.create !== true}
        >
          New Billing
        </Button>
      </Box>
      <DataTable
                title="Customer Table"
                data={data}
                columns={customerColumns}
                searchBy="customerName"
                isDelete={false}
                isEdit={false}
                // onDropDown={false}
                // isDelete={permissions?.Billing?.delete === true ? true : false}
          // isEdit={permissions?.Billing?.update === true ? true : false}
          isView={permissions?.Billing?.read === true ? true : false}
                // onDelete={handleDelete}
              />
    </DashboardContent>
  );
};

export default BillingTable;
