import { TableRow, TableCell, Checkbox } from '@mui/material';

export function CustomerTableRow({ row, selected, onSelectRow }: any) {
  const {
    customerId,
    name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    marketerName,
    paymentTerms,
    emiAmount,
    duration,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell>{customerId}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{phone}</TableCell>
      <TableCell>{address}</TableCell>
      <TableCell>{city}</TableCell>
      <TableCell>{state}</TableCell>
      <TableCell>{pincode}</TableCell>
      <TableCell>{marketerName}</TableCell>
      <TableCell>{paymentTerms}</TableCell>
      <TableCell>₹{emiAmount}</TableCell>
      <TableCell>{duration}</TableCell>
    </TableRow>
  );
}
