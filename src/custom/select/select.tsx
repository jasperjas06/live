import type {
  SelectChangeEvent} from '@mui/material';

import React from 'react';

import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';

interface Option {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  label: string;
  value: string | number;
  name: string;
  options: Option[];
  onChange: (e: SelectChangeEvent<string | number>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  name,
  options,
  onChange,
  error = false,
  helperText = '',
  fullWidth = true,
  disabled = false,
}) => (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      variant="outlined"
      size="medium"
      sx={{ minWidth: 200 }} // Optional if parent container manages width
    >
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );

export default CustomSelect;
