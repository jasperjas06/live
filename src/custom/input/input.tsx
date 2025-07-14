// components/CustomInput.tsx
import React from 'react';
import TextField from '@mui/material/TextField';

interface CustomInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  error = false,
  helperText = '',
  fullWidth = true,
  variant = 'outlined',
  required
}) => {
  return ( 
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant={variant}
      required={required}
    />
  );
};

export default CustomInput;
