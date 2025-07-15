import { TableRow, TableCell, Checkbox } from '@mui/material';

export function LFCProjectTableRow({ row, selected, onSelectRow }: any) {
  const {
    customerId,
    customerName,
    pl,
    introductionName,
    totalPayments,
    landDetails,
    registration,
    conversion,
    needHos,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell>{customerId}</TableCell>
      <TableCell>{customerName}</TableCell>
      <TableCell>{pl}</TableCell>
      <TableCell>{introductionName}</TableCell>
      <TableCell>₹{totalPayments.ent}</TableCell>
      <TableCell>₹{totalPayments.fustral}</TableCell>
      <TableCell>₹{totalPayments.payout}</TableCell>
      <TableCell>{landDetails.plotNo}</TableCell>
      <TableCell>{needHos ? 'Yes' : 'No'}</TableCell>
      <TableCell>{registration}</TableCell>
      <TableCell>{conversion ? '✔' : '✖'}</TableCell>
    </TableRow>
  );
}
