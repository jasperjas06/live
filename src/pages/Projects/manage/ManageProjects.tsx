/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Divider,
  styled,
  CircularProgress,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { createProjects, getAProject, updateProject } from 'src/utils/api.service';
import toast from 'react-hot-toast';


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  backgroundColor: '#fff',
}));

const projectSchema = yup.object().shape({
  projectName: yup.string().required('Project Name is required'),
  description: yup.string().required(),
  shortName: yup.string().required(),
  duration: yup.string().required(),
  emiAmount: yup
    .number()
    .typeError('EMI Amount must be a number')
    .required('EMI Amount is required'),
  marketer: yup.string().required(),
  schema: yup.string().required('Schema is required'),
  returns: yup
    .number()
    .typeError('Returns must be a number')
    .required('Returns is required'),
  intrest: yup.string().required(),
  totalInvestimate: yup
    .number()
    .typeError('Total Investimate must be a number')
    .required('Total Investimate is required'),
  totalReturnAmount: yup
    .number()
    .typeError('Total Return Amount must be a number')
    .required('Total Return Amount is required'),
});

export interface ProjectFormData {
  projectName: string;
  description: string;
  shortName: string;
  duration: string;
  emiAmount: number;
  marketer: string;
  schema: string;
  returns: number;
  intrest: string;
  totalInvestimate: number;
  totalReturnAmount: number;
}

const ProjectCreationForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      projectName: '',
      description: '',
      shortName: '',
      duration: '',
      emiAmount: 0,
      marketer: '',
      schema: 'Fixed Deposit',
      returns: 1,
      intrest: '',
      totalInvestimate: 0,
      totalReturnAmount: 0,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = id ? { ...data, _id: id } : data;
      const response = id
        ? await updateProject(payload)
        : await createProjects(data);

      if (response?.status === 200) {
        toast.success(response.message)
        navigate(-1)
        // alert(`Project ${id ? 'updated' : 'created'} successfully.`);
      } else {
       toast(response.message)
      }
    } catch (error:any) {
      console.error('Submission Error:', error);
      toast.error(error)
    }
  };

  const fetchProjectData = async () => {
    if (id) {
      setLoading(true);
      try {
        const response = await getAProject(id);
        const data = response?.data?.data;
        if (data) reset(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        {id ? 'Update Project' : 'Create Project'}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <StyledCard>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
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
                    label="Short Name"
                    {...register('shortName')}
                    error={!!errors.shortName}
                    helperText={errors.shortName?.message}
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
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Returns"
                    {...register('returns')}
                    error={!!errors.returns}
                    helperText={errors.returns?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Intrest"
                    {...register('intrest')}
                    error={!!errors.intrest}
                    helperText={errors.intrest?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  <TextField
                    label="Total Investimate"
                    {...register('totalInvestimate')}
                    error={!!errors.totalInvestimate}
                    helperText={errors.totalInvestimate?.message}
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
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    fullWidth
                    type="submit"
                  >
                    {id ? 'Update Project' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </StyledCard>
      )}
    </DashboardContent>
  );
};

export default ProjectCreationForm;
