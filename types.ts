export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  description: string;
  sku: string;
  lastUpdated: string;
  // New fields for Motorcycle
  plateNumber?: string;
  color?: string;
  year?: string;
  dateAdded?: string;
  // New field for Condition/Tax Type
  condition?: string; // 'ក្រដាសពន្ធថ្មី' | 'ក្រដាសពន្ធមួយទឹក' | 'មួយទឹកផ្លាកលេខ'
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
  total: number;
  date: string;
  plateNumber?: string; // Added plate number to sale record
}

export interface Expense {
  id: string;
  title: string;
  category: 'Marketing' | 'Staff' | 'Rent' | 'Utilities' | 'Others';
  amount: number;
  date: string;
  description?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  EXPENSES = 'EXPENSES',
  AI_ASSISTANT = 'AI_ASSISTANT',
  REPORTS = 'REPORTS',
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  reason?: string;
}

export interface AIResponse {
  text: string;
  loading: boolean;
  error?: string;
}