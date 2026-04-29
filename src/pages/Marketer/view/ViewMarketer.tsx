import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';

import { getAMarketer, getMarketerHierarchy,upgradeMarketerHead } from 'src/utils/api.service';
import type { Column } from 'src/custom/dataTable/dataTable';
import ConfirmDialog from 'src/custom/dialog/ConfirmDialog'
import { DataTable } from 'src/custom/dataTable/dataTable';
import { DashboardContent } from 'src/layouts/dashboard';

const ViewMarketer = () => {
  const { id } = useParams();
   const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const [hierarchyData, setHierarchyData] = useState<any>({ upline: [], downline: [] });
  const [hierarchyLoading, setHierarchyLoading] = useState(true); 
    const [promoting, setPromoting] = useState(false);
  const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

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

  
  const handlePromoteMarketer = async () => {
    if (!id) return;
    try {
      setPromoting(true);
      const response = await upgradeMarketerHead(id);
      if (response.status === 200) {
        toast.success(response.message || 'Marketer promoted successfully');
        const newId = response.data?.data?._id || id;
        navigate(`/marketing-head/view/${newId}`, { replace: true });
        return;
      }
      toast.error(response.message || 'Failed to promote marketer');
    } catch (error) {
      console.error('Error promoting marketer:', error);
      toast.error('Failed to promote marketer');
    } finally {
      setPromoting(false);
      setOpenPromoteDialog(false);
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Marketer Details
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenPromoteDialog(true)}
            disabled={promoting || loading || !id}
          >
            {promoting ? 'Promoting...' : 'Promote Marketer'}
          </Button>
        )}
      </Box>

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
      <ConfirmDialog
        open={openPromoteDialog}
        onClose={() => setOpenPromoteDialog(false)}
        title="Promote Marketer"
        content={`You are moving ${data?.name ? `"${data.name}"` : 'this marketer'}${data?.level ? ` from Level ${data.level}` : ''} to Level 1. Other marketers under them will move up by one level. This action cannot be undone. Are you sure you want to continue?`}
        action={handlePromoteMarketer}
        actionText={promoting ? 'Promoting...' : 'Promote'}
      />
    </DashboardContent>
  );
};

export default ViewMarketer;
