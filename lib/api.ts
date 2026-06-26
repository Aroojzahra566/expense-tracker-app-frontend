import type {
  CategorySummaryItem,
  DashboardSummary,
  Expense,
  ExpenseInput,
  MessageResponse,
  RecentExpense,
} from "@/lib/types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown
  ) {
    super(typeof detail === "string" ? detail : "API request failed");
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error
      ? error.message
      : "Something went wrong. Please try again.";
  }

  if (error.status === 404) {
    return typeof error.detail === "string"
      ? error.detail
      : "Expense not found.";
  }

  if (error.status === 422) {
    const { detail } = error;
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (item && typeof item === "object" && "msg" in item) {
            return String((item as { msg: string }).msg);
          }
          return "Invalid field value";
        })
        .join(". ");
    }
    if (typeof detail === "string") return detail;
    return "Validation failed. Please check your input.";
  }

  if (error.status === 0) return error.message;

  return typeof error.detail === "string" ? error.detail : error.message;
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body.detail ?? res.statusText);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        0,
        "Request timed out — is the backend running at http://localhost:8000?"
      );
    }
    throw new ApiError(
      0,
      `Network error — could not reach ${url}. Make sure the FastAPI backend is running.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function getExpenses(params?: {
  category?: string;
  date?: string;
}): Promise<Expense[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.date) search.set("date", params.date);
  const qs = search.toString();
  return fetchApi<Expense[]>(`/expenses${qs ? `?${qs}` : ""}`);
}

export function getExpense(id: number): Promise<Expense> {
  return fetchApi<Expense>(`/expenses/${id}`);
}

export function createExpense(data: ExpenseInput): Promise<MessageResponse> {
  return fetchApi<MessageResponse>("/expenses", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date,
      description: data.description ?? "",
    }),
  });
}

export function updateExpense(
  id: number,
  data: ExpenseInput
): Promise<MessageResponse> {
  return fetchApi<MessageResponse>(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date,
      description: data.description ?? "",
    }),
  });
}

export function deleteExpense(id: number): Promise<MessageResponse> {
  return fetchApi<MessageResponse>(`/expenses/${id}`, {
    method: "DELETE",
  });
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchApi<DashboardSummary>("/dashboard/summary");
}

export function getRecentExpenses(): Promise<RecentExpense[]> {
  return fetchApi<RecentExpense[]>("/dashboard/recent");
}

export function getCategorySummary(): Promise<CategorySummaryItem[]> {
  return fetchApi<CategorySummaryItem[]>("/dashboard/category-summary");
}

export function getCategories(): Promise<string[]> {
  return fetchApi<string[]>("/categories");
}

export async function getDashboardData() {
  const [summary, recent, categorySummary, expenses] = await Promise.all([
    getDashboardSummary(),
    getRecentExpenses(),
    getCategorySummary(),
    getExpenses(),
  ]);

  return {
    summary,
    recent: recent ?? [],
    categorySummary: categorySummary ?? [],
    expenses: expenses ?? [],
  };
}
