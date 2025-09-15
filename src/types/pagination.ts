export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ProductPaginationQuery extends PaginationQuery {
  categoryId?: string;
  status?: 'active' | 'inactive';
  visibility?: 'visible' | 'hidden';
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderPaginationQuery extends PaginationQuery {
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortOrder: 'desc' as const,
};

export const PAGINATION_LIMITS = [10, 20, 50];

export function buildPaginationQuery(query: PaginationQuery): URLSearchParams {
  const params = new URLSearchParams();
  
  if (query.page && query.page > 1) {
    params.set('page', query.page.toString());
  }
  
  if (query.limit && query.limit !== DEFAULT_PAGINATION.limit) {
    params.set('limit', query.limit.toString());
  }
  
  if (query.sortBy) {
    params.set('sortBy', query.sortBy);
  }
  
  if (query.sortOrder && query.sortOrder !== DEFAULT_PAGINATION.sortOrder) {
    params.set('sortOrder', query.sortOrder);
  }
  
  if (query.search) {
    params.set('search', query.search);
  }
  
  return params;
}

export function buildProductPaginationQuery(query: ProductPaginationQuery): URLSearchParams {
  const params = buildPaginationQuery(query);
  
  if (query.categoryId) {
    params.set('categoryId', query.categoryId);
  }
  
  if (query.status) {
    params.set('status', query.status);
  }
  
  if (query.visibility) {
    params.set('visibility', query.visibility);
  }
  
  if (query.stockStatus) {
    params.set('stockStatus', query.stockStatus);
  }
  
  if (query.minPrice !== undefined) {
    params.set('minPrice', query.minPrice.toString());
  }
  
  if (query.maxPrice !== undefined) {
    params.set('maxPrice', query.maxPrice.toString());
  }
  
  return params;
}

export function buildOrderPaginationQuery(query: OrderPaginationQuery): URLSearchParams {
  const params = buildPaginationQuery(query);
  
  if (query.status) {
    params.set('status', query.status);
  }
  
  if (query.paymentStatus) {
    params.set('paymentStatus', query.paymentStatus);
  }
  
  if (query.startDate) {
    params.set('startDate', query.startDate);
  }
  
  if (query.endDate) {
    params.set('endDate', query.endDate);
  }
  
  return params;
}
