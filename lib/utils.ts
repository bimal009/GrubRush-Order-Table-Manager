import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function errorHandler(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return "An unknown error occurred"
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Get color based on table status
export function getStatusColor(status: string): string {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800 border-green-300";
    case "Reserved":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Occupied":
      return "bg-red-100 text-red-800 border-red-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Shipped":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-300";
    case "Cancelled":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "Returned":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}


export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "An unknown error occurred.";
  }
}