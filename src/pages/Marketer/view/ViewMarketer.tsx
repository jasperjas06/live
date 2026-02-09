import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';

import { getAMarketer, getMarketerHierarchy } from 'src/utils/api.service';
import type { Column } from 'src/custom/dataTable/dataTable';
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

const ViewMarketer = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const [hierarchyData, setHierarchyData] = useState<any>({ upline: [], downline: [] });
  const [hierarchyLoading, setHierarchyLoading] = useState(true); 

  const getData = async () => {
    try {
      const response = await getAMarketer(id);
      if (response.status) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  
  const getHierarchy = async () => {
    try {
      setHierarchyLoading(true);
      const response = await getMarketerHierarchy(id);
      if (response.status === 200 && response.data?.data) {
        setHierarchyData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    } finally {
      setHierarchyLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getHierarchy();
  }, [id]);

  const DetailRow = ({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
      {icon && <Box sx={{ mr: 2, color: 'text.secondary' }}>{icon}</Box>}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" fontSize="0.875rem">{label}</Typography>
        <Typography variant="body1" fontWeight={500} mt={0.5}>
          {loading ? <Skeleton width={120} /> : value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );

  
  const columns: Column<any>[] = [
    { id: 'name', label: 'Name', sortable: true, render: (value: any) => value || '-' },
    { id: 'phone', label: 'Phone', sortable: false, render: (value: any) => value || '-' },
    { id: 'level', label: 'Level', sortable: true, render: (value: any) => value || '-' },
    { id: 'leaderName', label: 'Leader Name', sortable: true, render: (value: any) => value || '-' },
    { id: 'status', label: 'Status', sortable: true, render: (value: any) => value || '-' },
  ];

  return (
    <DashboardContent>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Marketer Details
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Info
              </Typography>
              <DetailRow label="Name" value={data?.name} icon={<PersonIcon />} />
              <DetailRow label="Phone" value={data?.phone} icon={<PhoneIcon />} />
              <DetailRow label="Address" value={data?.address} icon={<HomeIcon />} />
              <DetailRow label="Status" value={data?.status} icon={<AccountCircleIcon />} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Head By
              </Typography>
              <DetailRow label="Name" value={data?.headBy?.name} icon={<PersonIcon />} />
              <DetailRow label="Email" value={data?.headBy?.email} icon={<EmailIcon />} />
              <DetailRow label="Phone" value={data?.headBy?.phone} icon={<PhoneIcon />} />
              <DetailRow label="Gender" value={data?.headBy?.gender} />
              <DetailRow label="Age" value={data?.headBy?.age} />
              <DetailRow label="Address" value={data?.headBy?.address} />
              <DetailRow label="Status" value={data?.headBy?.status} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
          Upline
        </Typography>
        <DataTable
          title="Upline Marketers"
          data={hierarchyData.upline || []}
          columns={columns}
          disableSearch
          defaultRowsPerPage={5}
          onDropDown={false}
          isDelete={false}
          isEdit={false}
          isView={false}
        />
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
          Downline
        </Typography>
        <DataTable
          title="Downline Marketers"
          data={hierarchyData.downline || []}
          columns={columns}
          disableSearch
          defaultRowsPerPage={5}
          onDropDown={false}
          isDelete={false}
          isEdit={false}
          isView={false}
        />
      </Box>
    </DashboardContent>
  );
};

export default ViewMarketer;
