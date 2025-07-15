import { Checkbox, TableCell, TableRow } from "@mui/material";

export function MODTableRow({ row, selected, onSelectRow }: any) {
  const { id, name, headBy, head, phoneNumber, address, status } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>
      <TableCell>{id}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{headBy}</TableCell>
      <TableCell>{head}</TableCell>
      <TableCell>{phoneNumber}</TableCell>
      <TableCell>{address}</TableCell>
      <TableCell>{status}</TableCell>
    </TableRow>
  );
}
