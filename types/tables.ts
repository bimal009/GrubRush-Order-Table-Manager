export type TableStatus = "Available" | "Reserved" | "Occupied";
export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

export interface Table {
  _id?: string;
  tableNo: number;
  isAvailable: boolean;
  tableStatus: TableStatus;
  orderStatus: OrderStatus;
  amount: number;
}


