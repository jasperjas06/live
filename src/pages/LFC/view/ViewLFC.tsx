import { useParams } from 'react-router-dom'
import React, { useState, useEffect, ReactNode } from 'react'

import {
  Edit,
  Email,
  Phone,
  Person,
  Delete,
  Business,
  LocationOn,
  Visibility,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material'
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

import { getALFC } from 'src/utils/api.service'

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

const ViewLFC = () => {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await getALFC(id)
        if (res.status) setData(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  if (!data) return <DashboardContent><Skeleton variant="rectangular" height={400} /></DashboardContent>

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  // Calculate remaining budget
  const remainingBudget = data.inital - data.emi

  return (
    <DashboardContent maxWidth="xl">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight={600}>
            {loading ? <Skeleton width={200} /> : `Project Details - ${data.customer?.name || 'Project Details'}`}
          </Typography>
        </Box>
        {data.registration && (
          <Chip 
            label={data.registration.charAt(0).toUpperCase() + data.registration.slice(1)} 
            color={data.registration === 'open' ? 'success' : 'default'} 
          />
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Project Overview" icon={<Business fontSize="small" />}>
            <DetailRow label="Project ID" value={data._id} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Plot Number" value={data.plotNo} icon={<Business fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Total Sq Ft" value={data.totalSqFt} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Sq Ft Amount" value={formatCurrency(data.sqFtAmount)} loading={loading} />
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Financial Information" icon={<AttachMoney fontSize="small" />}>
            <DetailRow label="Initial Payment" value={formatCurrency(data.inital)} icon={<AttachMoney fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="EMI Amount" value={formatCurrency(data.emi)} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Remaining Amount" value={formatCurrency(remainingBudget)} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Customer EMI" value={formatCurrency(data.customer?.emiAmount)} loading={loading} />
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Customer Information" icon={<Person fontSize="small" />}>
            <DetailRow label="Name" value={data.customer?.name} icon={<Person fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Email" value={data.customer?.email} icon={<Email fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Phone" value={data.customer?.phone} icon={<Phone fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Payment Terms" value={data.customer?.paymentTerms} loading={loading} />
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Location & Details" icon={<LocationOn fontSize="small" />}>
            <DetailRow label="Address" value={data.customer?.address} icon={<LocationOn fontSize="small" />} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="City" value={data.customer?.city} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="State" value={data.customer?.state} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Pincode" value={data.customer?.pincode} loading={loading} />
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Project Configuration">
            <DetailRow label="Introducer Name" value={data.introductionName} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Marketer" value={data.customer?.marketerName} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Duration" value={data.customer?.duration} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Registration Status" value={data.registration} loading={loading} />
          </InfoCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard title="Additional Information">
            <DetailRow label="Created Date" value={formatDate(data.createdAt)} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Updated Date" value={formatDate(data.updatedAt)} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Conversion" value={data.conversion ? 'Yes' : 'No'} loading={loading} />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Needs MOD" value={data.needMod ? 'Yes' : 'No'} loading={loading} />
          </InfoCard>
        </Grid>

        {data.mod && (
          <Grid size={{ xs: 12 }}>
            <InfoCard title="MOD Information">
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    MOD Record
                  </Typography>
                  <Chip 
                    label={data.mod.status.charAt(0).toUpperCase() + data.mod.status.slice(1)} 
                    size="small" 
                    color={data.mod.status === 'active' ? 'success' : 'default'} 
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Site Name</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.siteName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Plot Number</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.plotNo || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Director Name</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.directorName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Director Phone</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.directorPhone || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">ED Name</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.EDName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">ED Phone</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.EDPhone || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Amount</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(data.mod.amount)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Introducer</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {data.mod.introducerName || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                  Date: {formatDate(data.mod.date)} | Created: {formatDate(data.mod.createdAt)}
                </Typography>
              </Paper>
            </InfoCard>
          </Grid>
        )}

        {data.nvt && data.nvt.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <InfoCard title="NVT Records">
              <Stack spacing={2}>
                {data.nvt.map((nvtRecord: any, i: number) => (
                  <Paper key={i} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        NVT Record #{i + 1}
                      </Typography>
                      <Chip 
                        label={nvtRecord.conversion ? 'Converted' : 'Pending'} 
                        size="small" 
                        color={nvtRecord.conversion ? 'success' : 'warning'} 
                      />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Initial Payment</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(nvtRecord.initialPayment)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Total Payment</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(nvtRecord.totalPayment)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">EMI</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(nvtRecord.emi)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">Introducer</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {nvtRecord.introducerName || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography variant="caption" color="text.secondary" mt={1} display="block">
                      Created: {formatDate(nvtRecord.createdAt)}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </InfoCard>
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  )
}

export default ViewLFC