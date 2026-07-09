export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface MessageResponse {
  message: string;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalTransactions: number;
  averageExpense: number;
  topCategory: string;
}

export interface RecentExpense {
  id: number;
  title: string;
  amount: number;
}

export interface CategorySummaryItem {
  category: string;
  total: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface EnrichedRecentExpense extends RecentExpense {
  category: string;
  date: string;
}

export interface CategoryTimeSeries {
  dates: string[];
  byCategory: { category: string; values: number[] }[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  email: string;
}

export interface AuthUser {
  user_id: number;
  email: string;
}
