import type { Column } from 'src/custom/dataTable/dataTable';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  Typography
} from '@mui/material';

import { deleteCustomer, getAllEstimateByCustomerId } from 'src/utils/api.service';

import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

type Customer = {
  id: string;
  name: string;
  marketer: string;
  status: string;
  saleType: string;
  noEmiPaid: number;
  noOfInstallments: number;
  noEmiPending: number;
};

const CustomerDetails = () => {

    const { id } = useParams();
    console.log(useParams(),"params");
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);

  const getCustomerData = async () => {
    try {
      const res = await getAllEstimateByCustomerId({
        cusId: id
      });
      if (res?.status === 200) {
        let newData = res?.data.data.map((item: any) => {
          return {
            id: item.general?._id,
            name: item?.general?.customer?.name || 'N/A',
            marketer: item?.general?.marketer?.name || 'N/A',
            status: item?.general?.status || 'N/A',
            saleType: item.plot.length > 0 ? 'Plot' : item.flat.length > 0 ? 'Flat' : 'N/A',
            noEmiPaid: item.emi.filter((emi: any) => emi.paidDate).length || "0",
            noOfInstallments: item.general?.noOfInstallments || "N/A",
            noEmiPending: item.emi.filter((emi: any) => !emi.paidDate).length || item.emi.length,
          }
        })
        setData(newData)
      }
    } catch (error) {
      setData([])
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, [id]);

 const customerColumns: Column<Customer>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'saleType', label: 'Sale Type', sortable: true },
  { id: 'marketer', label: 'Marketer', sortable: false },
  { id: "status", label: "Status", sortable: false },
  { id: 'noOfInstallments', label: 'No of Installments', sortable: true },
  { id: 'noEmiPaid', label: 'Paid EMI', sortable: true },
  { id: 'noEmiPending', label: 'Pending EMI', sortable: true },
];

const handleDelete = async (id: string | number) => {
  const confirmed = window.confirm('Are you sure you want to delete this customer?');
  if (!confirmed) return;

  try {
    await deleteCustomer(String(id)); // convert to string if needed by API
    getCustomerData(); // re-fetch data (not getAllCustomer again)
  } catch (error) {
    console.error('Failed to delete customer:', error);
  }
};

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Estimate Details
        </Typography>
        {data.length === 0 && (
          <Button
            variant="contained"
            color="inherit"
            onClick={() => navigate("create")}
          >
            Add New Estimate
          </Button>
        )}
      </Box>

      <Card>
        <DataTable
          title="Customer Table"
          data={data}
          columns={customerColumns}
          searchBy="name"
          // onDelete={handleDelete}
          // onView={}
          // isView={false}
          isDelete={false}
          isEdit={false}
        />
      </Card>
    </DashboardContent>
  );
};

export default CustomerDetails;