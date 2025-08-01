import React from 'react';
import { User, Percent, Calendar, FileText, DollarSign } from 'lucide-react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Divider,
  Typography,
  CardContent,
} from '@mui/material';

const project = {
  _id: '687e5ded285deddc94e606f3',
  projectName: 'Green Valley Phase 2',
  shortName: 'GV-P2',
  description: 'Second phase of the eco-housing project with better amenities',
  duration: '24',
  emiAmount: 15000,
  marketer: 'john_mark',
  schema: 'Fixed Projects',
  returns: 12,
  intrest: '8%',
  totalInvestimate: 0,
  totalReturnAmount: 0,
  createdAt: '2025-07-21T15:34:05.608Z',
  updatedAt: '2025-07-21T15:34:05.608Z',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const Projects = () => (
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
            <Grid size={{ xs: 12, sm:6 }}>
              <Stack spacing={1.5}>
                <DetailItem icon={<User size={18} />} label="Marketer" value={project.marketer} />
                <DetailItem icon={<FileText size={18} />} label="Schema" value={project.schema} />
                <DetailItem icon={<Percent size={18} />} label="Interest Rate" value={project.intrest} />
                <DetailItem icon={<DollarSign size={18} />} label="EMI Amount" value={`₹${project.emiAmount.toLocaleString('en-IN')}`} />
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, sm:6 }}>
              <Stack spacing={1.5}>
                <DetailItem icon={<Calendar size={18} />} label="Duration (months)" value={project.duration} />
                <DetailItem label="Returns (%)" value={`${project.returns}%`} />
                <DetailItem label="Created At" value={formatDate(project.createdAt)} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

// Reusable DetailItem component
const DetailItem: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {icon && <Box sx={{ mr: 1, color: 'text.secondary' }}>{icon}</Box>}
    <Typography variant="subtitle2" sx={{ minWidth: 150, color: 'text.secondary' }}>
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default Projects;
