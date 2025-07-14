// components/nvt-table-row.tsx
import { TableRow, TableCell, Checkbox } from '@mui/material';

export function NVTTableRow({ row, selected, onSelectRow }: any) {
  const {
    name,
    customerId,
    phoneNumber,
    introducer,
    totalPayment,
    initialPayment,
    emi,
    conversion,
    mod,
    status,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell>{name}</TableCell>
      <TableCell>{customerId}</TableCell>
      <TableCell>{phoneNumber}</TableCell>
      <TableCell>{introducer}</TableCell>
      <TableCell>₹{totalPayment}</TableCell>
      <TableCell>₹{initialPayment}</TableCell>
      <TableCell>₹{emi}</TableCell>
      <TableCell align="center">{conversion === 'yes' ? '✔' : '✖'}</TableCell>
      <TableCell align="center">{mod ? '✔' : '✖'}</TableCell>
      <TableCell>{status}</TableCell>
    </TableRow>
  );
}
