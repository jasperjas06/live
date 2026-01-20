export interface ICustomer {
  _id: string;
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  projectId?: {
    _id: string;
    projectName: string;
    shortName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CustomerResponse {
  data: ICustomer[];
  pagination?: CustomerPagination;
}

export interface CustomerListParams {
  search?: string;
  page?: number;
  limit?: number;
}
