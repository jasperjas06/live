import type { ReactNode } from 'react';

import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Paper,
  Avatar,
  Divider,
  Skeleton,
  Typography,
  IconButton,
  CardContent
} from '@mui/material'
import {
  Edit,
  Email,
  Phone,
  Badge,
  Person,
  Delete,
  Percent,
  Business,
  LocationOn,
  Visibility,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material'

import { getAMarketingHead } from 'src/utils/api.service'

import { DashboardContent } from 'src/layouts/dashboard'

interface InfoCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, children, icon }) => (
  <Card sx={{ height: '100%', boxShadow: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
            {icon}
          </Avatar>
        )}
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

interface DetailRowProps {
  label: string;
  value?: string | number | null;
  icon?: ReactNode;
  loading?: boolean;
}

export const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon, loading }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
    {icon && <Box sx={{ mr: 2, color: 'text.secondary' }}>{icon}</Box>}
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500} mt={0.5}>
        {loading ? <Skeleton width={120} /> : value || 'N/A'}
      </Typography>
    </Box>
  </Box>
);

const MarketingHead = () => {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const getMarketingData = async () => {
    try {
      const response = await getAMarketingHead(id)
      if (response.status) {
        setData(response.data.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMarketingData()
  }, [id])

  if (!data) return <DashboardContent><Skeleton variant="rectangular" height={400} /></DashboardContent>

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success'
      case 'inactive': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  return (
    <DashboardContent maxWidth="xl">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={600}>
            {loading ? <Skeleton width={200} /> : `${data.name || 'Marketing Head'} Details`}
          </Typography>

        </Box>
        {data.status && (
          <Chip 
            label={data.status.charAt(0).toUpperCase() + data.status.slice(1)} 
            color={getStatusColor(data.status)}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Profile Overview */}
         {/* Performance Summary */}
        <Grid size={{ xs: 12 }}>
          <InfoCard title="Performance Summary">
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={600} color="primary.main">
                      {data?.percentageId?.rate || '0%'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commission Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={600} color="success.main">
                      {data?.status === 'active' ? 'Active' : 'Inactive'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Status
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={600} color="info.main">
                      {data?.age || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={600} color="warning.main">
                      {data?.percentageId?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Plan Type
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </InfoCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Profile Overview" icon={<Person fontSize="small" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2, 
                  width: 56, 
                  height: 56,
                  fontSize: '1.5rem'
                }}
              >
                {data?.name?.[0] || 'M'}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {loading ? <Skeleton width={120} /> : data?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Marketing Head
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <DetailRow label="Gender" value={data?.gender} icon={<Badge fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Age" value={data?.age} loading={loading} />
          </InfoCard>
        </Grid>
              
        {/* Contact Information */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Contact Information" icon={<Phone fontSize="small" />}>
            <DetailRow label="Email Address" value={data?.email} icon={<Email fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Phone Number" value={data?.phone} icon={<Phone fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Address" value={data?.address} icon={<LocationOn fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Status" value={data?.status} loading={loading} />
          </InfoCard>
        </Grid>

        {/* Commission Information */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Commission Details" icon={<AttachMoney fontSize="small" />}>
            <DetailRow 
              label="Commission Rate" 
              value={data?.percentageId?.rate} 
              icon={<Percent fontSize="small" />} 
              loading={loading} 
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow 
              label="Commission Plan" 
              value={data?.percentageId?.name} 
              icon={<Business fontSize="small" />} 
              loading={loading} 
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow 
              label="Commission ID" 
              value={data?.percentageId?._id} 
              loading={loading} 
            />
          </InfoCard>
        </Grid>

        {/* System Information */}
        {/* <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="System Information" icon={<CalendarToday fontSize="small" />}>
            <DetailRow 
              label="Created Date" 
              value={formatDate(data?.createdAt)} 
              icon={<CalendarToday fontSize="small" />} 
              loading={loading} 
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow 
              label="Last Updated" 
              value={formatDate(data?.updatedAt)} 
              loading={loading} 
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow 
              label="Record ID" 
              value={data?._id} 
              loading={loading} 
            />
          </InfoCard>
        </Grid> */}

       
      </Grid>
    </DashboardContent>
  )
}

export default MarketingHead