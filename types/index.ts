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

export interface ICategory {
  _id: string;
  name: string;
}

export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: ICategory
  image?: string
  isAvailable: boolean
  preparationTime?: number // in minutes
  createdAt: Date
  updatedAt: Date
}

export type CreateMenuParams = Omit<MenuItem, 'category' | '_id' | 'createdAt' | 'updatedAt'> & {
    category: string;
};