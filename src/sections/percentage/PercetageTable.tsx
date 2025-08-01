import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import { deletePercentage, getAllPercentage } from 'src/utils/api.service'

import { DashboardContent } from 'src/layouts/dashboard'
import { DataTable, type Column } from 'src/custom/dataTable/dataTable'
import ManagePercentage from 'src/pages/Percentage/manage/ManagePercentage'

import { Iconify } from 'src/components/iconify'

interface Project {
     id: string;
    name: string;
    rate: string;
}


const PercetageTable = () => {
    const navigate = useNavigate()
    const [open,setOpen] = useState<boolean>(false)
    const [data, setData] = useState<any>([])
    const [ID, setID] =  useState<string>("")
    const getAllData = async()=>{
        try {
            const response = await getAllPercentage()
            if(response.status){
                setData(response.data.data)
                console.log(response,"data")
            }
        } catch (error) {
          console.log(error)  
        }
    }
    useEffect(()=>{
        getAllData()
    },[open])

    const handleEdith = (id: any) =>{
        if(id){
            setID(id)
            setOpen(true)
        }
    }

    const handleDelete = async (id: string | number) => {
      const confirmed = window.confirm('Are you sure you want to delete this customer?');
      if (!confirmed) return;
    
      try {
        console.log(id)
        await deletePercentage(String(id)); // convert to string if needed by API
        getAllData(); // re-fetch data (not getAllCustomer again)
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    };

      const customerColumns: Column<Project>[] = [
      { id: 'name', label: 'Name', sortable: true },
      { id: 'rate', label: 'Rate', sortable: true },
    ];


    return(
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
          onClick={() => setOpen(true)}
        >
          New Project
        </Button>
      </Box>
      <DataTable
            title="Customer Table"
            data={data}
            columns={customerColumns}
            searchBy="name"
            onEdit={handleEdith}
            onDelete={handleDelete}
            isView = {false}
            />
      <ManagePercentage open={open} setOpen={setOpen} id={ID} />
      </DashboardContent>
    </div>
    )
}

export default PercetageTable
