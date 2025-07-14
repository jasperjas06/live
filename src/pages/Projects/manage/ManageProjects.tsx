/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
  styled,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

// Yup validation schema
const projectSchema = yup.object().shape({
  volumeName: yup.string().required('Volume Name is required'),
  projectName: yup.string().required('Project Name is required'),
  description: yup.string().required(),
  stockName: yup.string().required(),
  duration: yup.string().required(),
  emiAmount: yup.number().typeError('EMI Amount must be a number').required('EMI Amount is required'),
  marketer: yup.string().required(),
  schema: yup.string().required('Schema is required'),
  returns: yup.number().typeError('Returns must be a number').required('Returns is required'),
  intrinsic: yup.string().required(),
  totalTrivestimate: yup.number().typeError('Total Trivestimate must be a number').required('Total Trivestimate is required'),
  totalReturnAmount: yup.number().typeError('Total Return Amount must be a number').required('Total Return Amount is required'),
  mod: yup.boolean().required(),
});

export interface ProjectFormData {
  volumeName: string;
  projectName: string;
  description: string;
  stockName: string;
  duration: string;
  emiAmount: number;
  marketer: string;
  schema: string;
  returns: number;
  intrinsic: string;
  totalTrivestimate: number;
  totalReturnAmount: number;
  mod: boolean;
}

const ProjectCreationForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      volumeName: '',
      projectName: '',
      description: '',
      stockName: '',
      duration: '',
      emiAmount: 0,
      marketer: '',
      schema: 'Fixed Projects',
      returns: 1,
      intrinsic: '',
      totalTrivestimate: 0,
      totalReturnAmount: 0,
      mod: false,
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    console.log('Submitted:', data);
    alert('Project Form Submitted');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        Project Creation Form
      </Typography>

      <StyledCard>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Volume Name"
                  {...register('volumeName')}
                  error={!!errors.volumeName}
                  helperText={errors.volumeName?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Project Name"
                  {...register('projectName')}
                  error={!!errors.projectName}
                  helperText={errors.projectName?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Description"
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Stock Name"
                  {...register('stockName')}
                  error={!!errors.stockName}
                  helperText={errors.stockName?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Duration"
                  {...register('duration')}
                  error={!!errors.duration}
                  helperText={errors.duration?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="EMI Amount"
                  {...register('emiAmount')}
                  error={!!errors.emiAmount}
                  helperText={errors.emiAmount?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Marketer"
                  {...register('marketer')}
                  error={!!errors.marketer}
                  helperText={errors.marketer?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Schema"
                  {...register('schema')}
                  error={!!errors.schema}
                  helperText={errors.schema?.message}
                  fullWidth
                  defaultValue="Fixed Projects"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Returns"
                  {...register('returns')}
                  error={!!errors.returns}
                  helperText={errors.returns?.message}
                  fullWidth
                  defaultValue={1}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Intrinsic"
                  {...register('intrinsic')}
                  error={!!errors.intrinsic}
                  helperText={errors.intrinsic?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Total Trivestimate"
                  {...register('totalTrivestimate')}
                  error={!!errors.totalTrivestimate}
                  helperText={errors.totalTrivestimate?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  label="Total Return Amount"
                  {...register('totalReturnAmount')}
                  error={!!errors.totalReturnAmount}
                  helperText={errors.totalReturnAmount?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="mod"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value || false} />}
                      label="MOD"
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Button variant="contained" size="large" color="primary" fullWidth type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default ProjectCreationForm;