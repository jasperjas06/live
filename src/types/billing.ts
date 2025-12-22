export interface IBilling {
  _id: string;
  customerName: string;
  mobileNo?: string;
  billingId?: string;
  remarks?: string;
  transactionType?: string;
  modeOfPayment?: string;
  saleType?: string;
  status?: string;
  introducer?: {
    _id: string;
    name: string;
  };
  emi?: {
    _id: string;
    paidDate: string;
    paidAmt: number;
  };
  emiNo?: number;
  marketerName?: string;
  paidDate?: string;
  emiId?: string;
  paidAmount?: string | number;
}

export interface BillingPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BillingResponse {
  data: IBilling[];
  pagination?: BillingPagination;
}

export interface BillingListParams {
  customerId?: string;
  generalId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
