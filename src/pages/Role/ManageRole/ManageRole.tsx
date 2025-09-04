import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';

import { getRoleById, updateRole } from 'src/utils/api.service';

// ✅ Validation Schema (only Role Name)
const roleSchema = yup.object().shape({
  role: yup.string().required('Role name is required'),
});

export interface RoleFormData {
  role: string;
}

interface RoleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitRole?: (data: RoleFormData) => Promise<void> | void;
  id?: string | number; // Optional ID for editing existing roles
}

const RoleDialog: React.FC<RoleDialogProps> = ({ open, setOpen, onSubmitRole,id }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormData>({
    resolver: yupResolver(roleSchema),
    defaultValues: {
      role: '',
    },
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const getDataById = async () => {
    try {
    const resposnse = await getRoleById(id);
    if(resposnse){
      const roleData = resposnse.data.data;
      reset({
        role: roleData.name || '',
      });
    } else {
      toast.error('Failed to fetch role data');
    }
    } catch (error) {
      console.error('Error fetching role data:', error);
      toast.error('Failed to fetch role data');
    }
  };
  // useEffect(()=>{id && getDataById()},[id])
  useEffect(() => {
    if (open && id) {
      getDataById();
    }
  }, [open, id]);

  // React.useEffect(() => {
  //   if (open) {
  //     // If editing, fetch existing data
  //     if (id) {
  //       getDataById(id);
  //     }
  //   }
  // }, [open]);

  // ✅ Submit Handler
const onSubmit = async (data: RoleFormData) => {
  try {
    setIsLoading(true);

    if (id) {
      // 🔹 Update role (include id)
      const updatedData = { name: data.role, _id:id };
      await updateRole(updatedData);
      toast.success('Role updated successfully');
    } else if (onSubmitRole) {
      // 🔹 Create role (no id)
      const newData:any = { name: data.role };
      await onSubmitRole(newData);
      toast.success('Role created successfully');
    }

    handleClose();
  } catch (error: any) {
    console.error('Submission error:', error);
    toast.error(error?.response?.data?.message || error?.message || 'Failed to save role');
  } finally {
    setIsLoading(false);
  }
};


  return (
 <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>{id ? 'Edit Role' : 'Create Role'}</DialogTitle>

  <form onSubmit={handleSubmit(onSubmit)}>
    <DialogContent>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <TextField
          label="Role Name"
          {...register('role')}
          error={!!errors.role}
          helperText={errors.role?.message}
          fullWidth
          variant="outlined"
          autoFocus
        />
      )}
    </DialogContent>

    <DialogActions>
      <Button onClick={handleClose} color="inherit" disabled={isLoading}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
        {id ? 'Update' : 'Save'}
      </Button>
    </DialogActions>
  </form>
</Dialog>

  );
};

export default RoleDialog;
