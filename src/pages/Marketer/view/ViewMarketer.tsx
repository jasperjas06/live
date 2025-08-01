import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Box,
  Card,
  Grid,
  Skeleton,
  Typography,
  CardContent,
} from '@mui/material';

import { getAMarketer } from 'src/utils/api.service';

import { DashboardContent } from 'src/layouts/dashboard';

const ViewMarketer = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getData();
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

  return (
    <DashboardContent>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Marketer Details
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Basic Info
              </Typography>
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
    </DashboardContent>
  );
};

export default ViewMarketer;
