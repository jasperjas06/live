type EMIItem = {
  emiAmt?: number;
  paidAmt?: number;
  paidDate?: string | Date | null;
};

export const calculateEmiSummary = (data: any) => {
  const emiArray: any[] = Array.isArray(data?.emiList)
    ? data.emiList
    : Array.isArray(data?.emi)
    ? data.emi
    : [];

  const normalizeDate = (d?: string | Date | null) =>
    d ? new Date(d).toISOString().split("T")[0] : null;

  // Current Transaction Details
  const currentPaidAmount = Number(data?.enteredAmount ?? data?.emi?.paidAmt ?? data?.amountPaid ?? 0);
  const currentEmiNo = Number(data?.emi?.emiNo ?? data?.emiNo ?? 0);

  let totalAmount = 0;
  let previousPaidAmount = 0;

  for (const emi of emiArray) {
    // Total Amount is sum of all EMI amounts defined in the schedule/history
    totalAmount += Number(emi.emiAmt ?? 0);

    const emiNo = Number(emi.emiNo);

    // Previous Paid Amount logic:
    // Sum of paidAmt for all entries where emiNo is LESS than the current transaction's emiNo.
    // This correctly handles historical bills by ignoring future payments.
    if (emi.paidAmt && emiNo < currentEmiNo) {
      previousPaidAmount += Number(emi.paidAmt);
    }
     if (emiNo < currentEmiNo && emi.paidDate) {
      previousPaidAmount += Number(emi.emiAmt);
    }

  }


  previousPaidAmount = data.previousBilling ? data.previousBilling : previousPaidAmount

  // Balance = Total - (Previous + Current)
  const balanceAmount = totalAmount - (previousPaidAmount + currentPaidAmount);

  return {
    totalAmount,
    previousPaidAmount,
    currentPaidAmount,
    balanceAmount,
  };
};
