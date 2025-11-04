import { Column } from "./dataTable";

const estimateColumns: Column<any>[] = [
  { id: "customerName", label: "Customer Name", sortable: true },
  { id: "estimateCount", label: "Estimate Count", sortable: true },
  { id: "noOfInstallments", label: "Total Installments", sortable: true },
  { id: "paidInstallments", label: "Paid Installments", sortable: true },
  { id: "percentage", label: "Commission %", sortable: true },
  { id: "totalAmountPaid", label: "Total Amount Paid", sortable: true },
  { id: "amountEarned", label: "Amount Earned", sortable: true },
];

export default estimateColumns