import { Calendar, DollarSign, FileText, Percent, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { getAProject } from "src/utils/api.service";

interface Project {
  _id: string;
  projectName: string;
  shortName: string;
  description: string;
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Projects = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("No project ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAProject(id);

        if (response.status === 200 && response.data) {
          setProject(response.data.data);
          setError(null);
        } else {
          setError(response.message || "Failed to fetch project details");
        }
      } catch (err) {
        setError("An error occurred while fetching project details");
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Project not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Project Overview
      </Typography>

      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={500} gutterBottom>
            {project.projectName} ({project.shortName})
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {project.description}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <DetailItem
                  icon={<User size={18} />}
                  label="Marketer"
                  value={project.marketer}
                />
                <DetailItem
                  icon={<FileText size={18} />}
                  label="Schema"
                  value={project.schema}
                />
                <DetailItem
                  icon={<Percent size={18} />}
                  label="Interest Rate"
                  value={project.intrest}
                />
                <DetailItem
                  icon={<DollarSign size={18} />}
                  label="EMI Amount"
                  value={
                    project.emiAmount
                      ? `₹${project.emiAmount.toLocaleString("en-IN")}`
                      : "N/A"
                  }
                />
                <DetailItem
                  icon={<DollarSign size={18} />}
                  label="Total Investment"
                  value={
                    project.totalInvestimate
                      ? `₹${project.totalInvestimate.toLocaleString("en-IN")}`
                      : "N/A"
                  }
                />
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <DetailItem
                  icon={<Calendar size={18} />}
                  label="Duration (months)"
                  value={project.duration}
                />
                {/* <DetailItem label="Returns (%)" value={project.returns !== undefined && project.returns !== null ? `${project.returns}%` : 'N/A'} /> */}
                <DetailItem
                  icon={<DollarSign size={18} />}
                  label="Total Return Amount"
                  value={
                    project.totalReturnAmount
                      ? `₹${project.totalReturnAmount.toLocaleString("en-IN")}`
                      : "N/A"
                  }
                />
                {project?.createdAt && (
                  <DetailItem
                    label="Created At"
                    value={formatDate(project.createdAt)}
                  />
                )}
                {project?.updatedAt && (
                  <DetailItem
                    label="Updated At"
                    value={formatDate(project.updatedAt)}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

// Reusable DetailItem component
const DetailItem: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    {icon && <Box sx={{ mr: 1, color: "text.secondary" }}>{icon}</Box>}
    <Typography
      variant="subtitle2"
      sx={{ minWidth: 150, color: "text.secondary" }}
    >
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default Projects;
