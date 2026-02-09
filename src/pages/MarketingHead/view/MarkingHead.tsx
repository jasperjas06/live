import type { ReactNode } from "react";
import { DataTable } from "src/custom/dataTable/dataTable";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  AttachMoney,
  Badge,
  Business,
  Email,
  LocationOn,
  Percent,
  Person,
  Phone
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Typography
} from "@mui/material";

import { getAMarketingHead, getMarketingHeadEstimates, getMarketingHeadFullHierarchy } from 'src/utils/api.service';

import estimateColumns from "src/custom/dataTable/estimatedColuumns";
import { DashboardContent } from "src/layouts/dashboard";

interface InfoCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  icon,
}) => (
  <Card sx={{ height: "100%", boxShadow: 2 }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {icon && (
          <Avatar
            sx={{ bgcolor: "primary.main", mr: 1, width: 32, height: 32 }}
          >
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

export const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  icon,
  loading,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
    {icon && <Box sx={{ mr: 2, color: "text.secondary" }}>{icon}</Box>}
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500} mt={0.5}>
        {loading ? <Skeleton width={120} /> : value || "N/A"}
      </Typography>
    </Box>
  </Box>
);

const MarketingHead = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [estimatesData, setEstimatesData] = useState<any[]>([]);
  const [estimatesLoading, setEstimatesLoading] = useState(true);
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // ← ADD THIS

  const getMarketingData = async () => {
    try {
      const response = await getAMarketingHead(id);
      if (response.status) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getEstimatesData = async () => {
    try {
      const response = await getMarketingHeadEstimates(id);
      if (response.status === 200 && response.data.data) {
        const dataWithIds = response.data.data.map(
          (item: any, index: number) => ({
            ...item,
            id: index + 1,
          })
        );
        setEstimatesData(dataWithIds);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEstimatesLoading(false);
    }
  };

  useEffect(() => {
    getMarketingData();
    if (isAdmin) {
      // ← ADD THIS CONDITION
      getEstimatesData();
    }
  }, [id]);

  if (!data)
    return (
      <DashboardContent>
        <Skeleton variant="rectangular" height={400} />
      </DashboardContent>
    );

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" fontWeight={600}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              `${data.name || "Marketing Head"} Details`
            )}
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
            <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {data?.percentageId?.rate || "0%"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commission Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight={600}
                      color="success.main"
                    >
                      {data?.status === "active" ? "Active" : "Inactive"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Status
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={600} color="info.main">
                      {data?.age || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight={600}
                      color="warning.main"
                    >
                      {data?.percentageId?.name || "N/A"}
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  mr: 2,
                  width: 56,
                  height: 56,
                  fontSize: "1.5rem",
                }}
              >
                {data?.name?.[0] || "M"}
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
            <DetailRow
              label="Gender"
              value={data?.gender}
              icon={<Badge fontSize="small" />}
              loading={loading}
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Age" value={data?.age} loading={loading} />
          </InfoCard>
        </Grid>

        {/* Contact Information */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard
            title="Contact Information"
            icon={<Phone fontSize="small" />}
          >
            <DetailRow
              label="Email Address"
              value={data?.email}
              icon={<Email fontSize="small" />}
              loading={loading}
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow
              label="Phone Number"
              value={data?.phone}
              icon={<Phone fontSize="small" />}
              loading={loading}
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow
              label="Address"
              value={data?.address}
              icon={<LocationOn fontSize="small" />}
              loading={loading}
            />
            <Divider sx={{ my: 1 }} />
            <DetailRow label="Status" value={data?.status} loading={loading} />
          </InfoCard>
        </Grid>

        {/* Commission Information */}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <InfoCard
            title="Commission Details"
            icon={<AttachMoney fontSize="small" />}
          >
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
{/*        {isAdmin && (
          <Grid size={{ xs: 12 }}>
            <InfoCard title="Sales & Estimates">
              {estimatesLoading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <DataTable
                  title="Estimates"
                  data={estimatesData}
                  columns={estimateColumns}
                  searchBy="customerName"
                  onDropDown={false}
                  isDelete={false}
                  isEdit={false}
                  isView={false}
                />
              )}
            </InfoCard>
          </Grid>
        )} */}
      </Grid>
            
      <HierarchySection id={id} />
    </DashboardContent>
  );
};


const HierarchySection = ({ id }: { id?: string }) => {
  const [hierarchyData, setHierarchyData] = useState<any>({ upline: [], downline: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        setLoading(true);
        const response = await getMarketingHeadFullHierarchy(id);
        if (response.status === 200 && response.data) {
          setHierarchyData(response.data);
        }
      } catch (error) {
        console.error("Error fetching hierarchy:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHierarchy();
    }
  }, [id]);

  const columns: any[] = [
    { id: 'name', label: 'Name', sortable: true, render: (value: any) => value || '-' },
    { id: 'phone', label: 'Phone', sortable: false, render: (value: any) => value || '-' },
    { id: 'level', label: 'Level', sortable: true, render: (value: any) => value || '-' },
    { id: 'leaderName', label: 'Leader Name', sortable: true, render: (value: any) => value || '-' },
    { id: 'status', label: 'Status', sortable: true, render: (value: any) => value || '-' },
  ];

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
          Upline
        </Typography>
        <DataTable
          title="Upline Marketing Heads"
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
          title="Downline Marketing Heads"
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
    </Box>
  );
};

export default MarketingHead;
