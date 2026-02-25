export type FinancialType = 'INCOME' | 'EXPENSE';

export interface FinanceCategory {
    id: string;
    name: string;
    type: FinancialType;
}

export interface FinancialRecord {
    id: string;
    projectId: string;
    type: FinancialType;
    amount: number;
    category: string; // Dynamic Category Name
    description: string;
    transactionDate: string; // ISO Date
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface FinancialSummary {
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
    createdBy?: string;
    taxIncluded: boolean;
    taxRate?: number; // Configurable tax rate
}
