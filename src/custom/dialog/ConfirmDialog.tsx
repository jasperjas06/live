import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import React, { useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  action: (reason?: string) => void;
  cancelText?: string;
  actionText?: string;
  requireReason?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  title,
  content,
  action,
  cancelText = 'Cancel',
  actionText = 'Delete',
  requireReason = false,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    action(requireReason ? reason : undefined);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningRoundedIcon color="error" />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mb: requireReason ? 2 : 0 }}>
          {content}
        </DialogContentText>
        {requireReason && (
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason for deletion"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            error={reason.trim() === ''}
            helperText={reason.trim() === '' ? 'Reason is required' : ''}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {cancelText}
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="error" 
          autoFocus={!requireReason}
          disabled={requireReason && reason.trim() === ''}
        >
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
