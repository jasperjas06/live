/* eslint-disable react/jsx-no-undef */
/* eslint-disable perfectionist/sort-imports */

import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { deleteProject, getAllProjects } from 'src/utils/api.service';
import { ActionMenu, Column, DataTable } from 'src/custom/dataTable/dataTable';

interface Project {
  _id?: any;
  projectName: string;
  stortName: string;
  duration: string;
  emiAmount: number;
  marketer: string;
  schema: string;
  returns: number;
  intrest: string;
  totalInvestimate: number;
  totalReturnAmount: number;
  createdAt: string;
  updatedAt: string;
}

const ProjectsTable = () => {
  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState<Project[]>([]);
  const navigate = useNavigate();

  const getProjectsData = async () => {
    try {
      const res = await getAllProjects();
      if (res?.status === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjectsData();
  }, []);

  type ProjectWithId = Project & { id: string };

const tableData: ProjectWithId[] = data.map((item) => ({
  ...item,
  id: item._id,
}));
 const projectColumns: Column<ProjectWithId>[] = [
  {
    id: 'projectName',
    label: 'Project Name',
    sortable: true,
  },
  // {
  //   id: 'description',
  //   label: 'Description',
  // },
  {
    id: 'duration',
    label: 'Duration',
  },
  {
    id: 'emiAmount',
    label: 'EMI Amount',
  },
  {
    id: 'returns',
    label: 'Returns',
  },
  {
    id: 'intrest',
    label: 'Interest',
  },
  // {
  //     id: 'id', // key used for rendering
  //     label: 'Actions',
  //     render: (_, row) => <ActionMenu row={row} onDelete={handleDelete} />,
  //   },
];
const handleDelete = async (id: string | number) => {
  const confirmed = window.confirm('Are you sure you want to delete this customer?');
  if (!confirmed) return;

  try {
    console.log(id)
    await deleteProject(String(id)); // convert to string if needed by API
    getProjectsData(); // re-fetch data (not getAllCustomer again)
  } catch (error) {
    console.error('Failed to delete customer:', error);
  }
};


  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Projects
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('create')}
        >
          New Project
        </Button>
      </Box>

      <Card>
        <DataTable
  title="Projects Table"
  data={data.map((item) => ({ ...item, id: item._id }))}
  columns={projectColumns}
  searchBy="projectName"
  onDelete={handleDelete}
/>

      </Card>
    </DashboardContent>
  );
};

export default ProjectsTable;
