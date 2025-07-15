// components/project-table-row.tsx
import { TableRow, TableCell, Checkbox } from '@mui/material';

export function ProjectTableRow({ row, selected, onSelectRow }: any) {
  const {
    id,
    volumeName,
    projectName,
    stockName,
    duration,
    emiAmount,
    marketer,
    schema,
    returns,
    totalTrivestimate,
    totalReturnAmount,
    mod,
    status,
  } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell>{id}</TableCell>
      <TableCell>{volumeName}</TableCell>
      <TableCell>{projectName}</TableCell>
      <TableCell>{stockName}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell>₹{emiAmount}</TableCell>
      <TableCell>{marketer}</TableCell>
      <TableCell>{schema}</TableCell>
      <TableCell align="center">{returns}</TableCell>
      <TableCell align="center">{mod ? '✔' : '✖'}</TableCell>
      {/* <TableCell>{status}</TableCell> */}
    </TableRow>
  );
}
