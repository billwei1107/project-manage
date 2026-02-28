export type FinancialType = 'INCOME' | 'EXPENSE';

export interface FinanceCategory {
    id: string;
    name: string;
    type: FinancialType;
}

export interface FinancialRecordResponse {
    id: string;
    projectId: string;
    type: FinancialType;
    amount: number;
    category: string; // Dynamic Category Name
    description: string;
    transactionDate: string; // ISO Date
    receiptUrl?: string; // Uploaded image path
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface FinancialSummaryResponse {
    budget: number;
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    burnRate: number; // Percentage
}

export interface FinancialRecordRequest {
    projectId: string;
    type: FinancialType;
    amount: number;
    category: string;
    description: string;
    transactionDate: string; // YYYY-MM-DD
    receiptUrl?: string;
    createdBy?: string;
    taxIncluded: boolean;
    taxRate?: number; // Configurable tax rate
}
