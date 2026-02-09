import {
  BadgeDollarSign,
  Briefcase,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  UserCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from '@mui/material';

import { getACustomer } from 'src/utils/api.service';

interface ReferencePerson {
  _id: string;
  id: string;
  name: string;
  phone: string;
  status?: string;
}

interface Customer {
  id: string;
  customerCode: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  duration: string;
  emiAmount: number;
  paymentTerms: string;
  marketerName: string;
  createdAt: string;
  updatedAt: string;
  project: string; // Updated to string as per JSON
  projectId?: { // Optional in case it exists in some responses
    duration: string;
    emiAmount: number;
  };
  ddId?: ReferencePerson;
  cedId?: ReferencePerson;
}

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchData = async () => {
    try {
      if (id) {
        const response = await getACustomer(id);
        setCustomer(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div className='flex items-center justify-center h-screen'>Loading...</div>;
  }

  if (!customer) {
    return <Typography>Customer not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
                Customer Details
              </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
            <UserCircle size={32} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              {customer.name || 'N/A'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Customer ID: {customer?.id || customer?.customerCode || customer._id || 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid size={{ xs: 12,  md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <User style={{ marginRight: 8 }} /> Personal Information
            </Typography>
            <Box sx={{ pl: 2 }}>
  <Stack spacing={1.5}>
    <DetailItem icon={<Mail size={18} />} label="Email" value={customer.email || 'N/A'} />
    <DetailItem icon={<Phone size={18} />} label="Phone" value={customer.phone || 'N/A'} />
    <DetailItem 
      icon={<MapPin size={18} />} 
      label="Address" 
      value={[
        customer.address,
        customer.city,
        customer.state,
        customer.pincode && `Pincode: ${customer.pincode}`
      ].filter(Boolean).join(', ') || 'N/A'} 
    />
  </Stack>
</Box>
          </Grid>
          
          {/* Reference Details (DD & CED) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Briefcase style={{ marginRight: 8 }} /> Reference Details
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Stack spacing={1.5}>
                {customer.ddId && (
                  <Box sx={{ mb: 1 }}>
                     <Typography variant="subtitle2" color="primary" gutterBottom>Direct Director (DD)</Typography>
                     <DetailItem label="Name" value={customer.ddId.name || 'N/A'} />
                     <DetailItem label="ID" value={customer.ddId.id || 'N/A'} />
                     <DetailItem label="Phone" value={customer.ddId.phone || 'N/A'} />
                  </Box>
                )}
                {customer.ddId && customer.cedId && <Divider sx={{ my: 1, borderStyle: 'dashed' }} />}
                {customer.cedId && (
                  <Box>
                     <Typography variant="subtitle2" color="primary" gutterBottom>Chief Executive Director (CED)</Typography>
                     <DetailItem label="Name" value={customer.cedId.name || 'N/A'} />
                     <DetailItem label="ID" value={customer.cedId.id || 'N/A'} />
                     <DetailItem label="Phone" value={customer.cedId.phone || 'N/A'} />
                  </Box>
                )}
                {!customer.ddId && !customer.cedId && <Typography variant="body2" color="text.secondary">No reference details available</Typography>}
              </Stack>
            </Box>
          </Grid>

          {/* Financial Information */}
          <Grid size={{ xs: 12,  md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <BadgeDollarSign style={{ marginRight: 8 }} /> Financial Details
            </Typography>
            <Box sx={{ pl: 2 }}>
              <DetailItem 
                label="Project" 
                value={
                  customer.project || 
                  (customer as any).projectId?.projectName || 
                  (customer as any).projectId?.id || 
                  'N/A'
                } 
              />
              <DetailItem 
                label="EMI Amount" 
                value={customer?.emiAmount ? `₹${customer?.emiAmount.toLocaleString('en-IN')}` : customer?.projectId?.emiAmount ? `₹${customer?.projectId?.emiAmount.toLocaleString('en-IN')}` : 'N/A'} 
              />
              <DetailItem label="Duration" value={customer.duration || customer?.projectId?.duration || 'N/A'} />
              <DetailItem label="Payment Terms" value={customer.paymentTerms || 'N/A'} />
              <DetailItem 
                label="Marketer/CED" 
                value={
                  customer.marketerName || 
                  (customer as any).cedId?.name || 
                  'N/A'
                } 
              />
            </Box>
          </Grid>

          {/* Timeline Information */}
          <Grid size={{ xs: 12,  }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Calendar style={{ marginRight: 8 }} /> Timeline
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              pl: 2
            }}>
              <Chip 
                icon={<Calendar size={16} />}
                label={`Created: ${formatDate(customer.createdAt)}`}
                variant="outlined"
                sx={{ pl: 1 }}
              />
              <Chip 
                icon={<Clock size={16} />}
                label={`Created Time: ${formatTime(customer.createdAt)}`}
                variant="outlined"
                sx={{ pl: 1 }}
              />
              <Chip 
                icon={<Calendar size={16} />}
                label={`Updated: ${formatDate(customer.updatedAt)}`}
                variant="outlined"
                sx={{ pl: 1 }}
              />
              <Chip 
                icon={<Clock size={16} />}
                label={`Updated Time: ${formatTime(customer.updatedAt)}`}
                variant="outlined"
                sx={{ pl: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

// Reusable component for detail items
const DetailItem: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
      {icon && <Box sx={{ mr: 1, color: 'text.secondary' }}>{icon}</Box>}
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Typography variant="body1" sx={{ ml: 2 }}>
      {value}
    </Typography>
  </Box>
);


export default CustomerProfile;