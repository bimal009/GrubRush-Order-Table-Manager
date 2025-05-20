// User related types
export type CreateUserParams = {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
};

export type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
};



export type CreateCategoryParams = {
  categoryName: string;
};

export type CreateOrderParams = {
  tableId: string;
  buyerId: string;
  totalAmount: number;
  paymentStatus?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type foodFilterParams = PaginationParams & {
  query?: string;
  category?: string;
  sortBy?: 'title' | 'price' | 'startDateTime';
  sortOrder?: 'asc' | 'desc';
  isAvailable?: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
};

// Custom utility types
export type Maybe<T> = T | null | undefined;


export type CardProps = {
  title: string;
  content:string;
  value: string | number;
  icon: React.ReactNode;
  secondaryValue?: string | number;
};

