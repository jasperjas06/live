import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface CustomRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Option[];
  error?: boolean;
  helperText?: string;
  row?: boolean;
  disabled?: boolean;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error = false,
  helperText = '',
  row = false,
  disabled = false,
}) => {
  return (
    <FormControl component="fieldset" error={error} disabled={disabled} fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        name={name}
        value={value}
        onChange={onChange}
        row={row}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomRadioGroup;
