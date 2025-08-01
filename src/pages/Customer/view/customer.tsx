import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  Calendar,
  UserCircle,
  BadgeDollarSign
} from 'lucide-react';

import { 
  Box, 
  Grid, 
  Chip, 
  Paper, 
  Avatar, 
  Divider,
  Typography, 
  Stack
} from '@mui/material';

import { getACustomer } from 'src/utils/api.service'; 

interface Customer {
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
    return <Typography>Loading...</Typography>;
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
              Customer ID: {customer._id || 'N/A'}
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
      value={
        customer.address 
          ? `${customer.address}, ${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}`
          : 'N/A'
      } 
    />
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
                label="EMI Amount" 
                value={customer.emiAmount ? `₹${customer.emiAmount.toLocaleString('en-IN')}` : 'N/A'} 
              />
              <DetailItem label="Duration" value={customer.duration || 'N/A'} />
              <DetailItem label="Payment Terms" value={customer.paymentTerms || 'N/A'} />
              <DetailItem label="Marketer" value={customer.marketerName || 'N/A'} />
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