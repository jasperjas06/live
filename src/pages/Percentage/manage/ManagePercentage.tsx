import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Grid,
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import {
  getAPercentage,
  createPercentage,
  updatePercentage,
} from 'src/utils/api.service';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  rate: yup
    .string()
    .required('Rate is required')
    .matches(/^\d+%$/, 'Rate must be in percentage format (e.g., 12%)'),
});

type FormData = {
  name: string;
  rate: string;
};

interface ManagePercentageProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  id?: string;
  onSuccess?: () => void;
}

const ManagePercentage = ({
  open,
  setOpen,
  id,
  onSuccess,
}: ManagePercentageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      rate: '',
    },
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await getAPercentage(id || '');
      if (response?.status && response?.data) {
        reset(response.data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && open) {
      getData();
    } else if (!id && open) {
      reset();
    }
  }, [id, open]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      let response;
      if (id) {
        response = await updatePercentage({ ...data, _id: id });
      } else {
        response = await createPercentage(data);
      }

      if (response?.status === 200) {
        toast.success(response.message)
        onSuccess?.();
        handleClose();
      } else {
        toast(response.message)
      }
    } catch (error:any) {
      toast.error(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{id ? 'Update' : 'Create'} Percentage</DialogTitle>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                  <TextField
                  required
                  label="Name"
                  fullWidth
                  {...register('name')}
                  error={!!errors.name}
                  placeholder="Enter Percentage Name"
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                  <TextField
                  required
                  label="Rate"
                  fullWidth
                  {...register('rate')}
                  error={!!errors.rate}
                  helperText={errors.rate?.message}
                  placeholder="Enter percentage (e.g., 12%)"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={22} /> : id ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default ManagePercentage;
