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

// Event related types
export type CreateEventParams = {
  title: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  price?: number;
  isFree?: boolean;
  url?: string;
  categoryId?: string;
  organizerId: string;
};

export type CreateCategoryParams = {
  categoryName: string;
};

// Order related types
export type CreateOrderParams = {
  tableId: string;
  buyerId: string;
  totalAmount: number;
  paymentStatus?: string;
};

// Pagination and filtering types
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

// API response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
};

// Custom utility types
export type Maybe<T> = T | null | undefined;