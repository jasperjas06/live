/* eslint-disable react/jsx-no-undef */
/* eslint-disable perfectionist/sort-imports */

import {
  Box,
  Button,
  Card,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { Column, DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteProject, getAllProjects } from 'src/utils/api.service';

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
    render: (_, row) => row.projectName || 'N/A',
  },
  // {
  //   id: 'description',
  //   label: 'Description',
  // },
  {
    id: 'duration',
    label: 'Duration',
    render: (_, row) => row.duration || 'N/A',
  },
  {
    id: 'emiAmount',
    label: 'EMI Amount',
    render: (_, row) => row.emiAmount ? `₹${row.emiAmount.toLocaleString('en-IN')}` : '0',
  },
  {
    id: 'returns',
    label: 'Returns',
    render: (_, row) => {
      // Priority: totalReturnAmount (new) -> returns (old) -> N/A
      const returnValue = row.totalReturnAmount || row.returns;
      if (returnValue && returnValue !== 0) {
        return `₹${returnValue.toLocaleString('en-IN')}`;
      }
      return '0';
    },
  },
  {
    id: 'intrest',
    label: 'Interest',
    render: (_, row) => {
      // Priority: totalInvestimate (new) -> intrest (old) -> interest (old) -> N/A
      const investmentValue = row.totalInvestimate;
      if (investmentValue && investmentValue !== 0) {
        return `₹${investmentValue.toLocaleString('en-IN')}`;
      }
      
      // Fallback to old interest format (percentage)
      const interest = row.intrest || (row as any).interest;
      return interest && interest !== '0' ? interest : 'N/A';
    },
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
          preserveOrder={true}
/>

      </Card>
    </DashboardContent>
  );
};

export default ProjectsTable;
