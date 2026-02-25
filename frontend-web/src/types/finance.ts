export type FinancialType = 'INCOME' | 'EXPENSE';

export const FinancialCategory = {
    PROJECT_REVENUE: 'PROJECT_REVENUE',
    MAINTENANCE_FEE: 'MAINTENANCE_FEE',
    CONSULTING: 'CONSULTING',
    OTHERS_INCOME: 'OTHERS_INCOME',

    HOSTING: 'HOSTING',
    OUTSOURCING: 'OUTSOURCING',
    LABOR: 'LABOR',
    SOFTWARE: 'SOFTWARE',
    TAX: 'TAX',
    OFFICE: 'OFFICE',
    OTHERS_EXPENSE: 'OTHERS_EXPENSE',
} as const;

export type FinancialCategory = typeof FinancialCategory[keyof typeof FinancialCategory];

export interface FinancialRecord {
    id: string;
    projectId: string;
    type: FinancialType;
    amount: number;
    category: FinancialCategory;
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
    category: FinancialCategory;
    description: string;
    transactionDate: string; // YYYY-MM-DD
    createdBy?: string;
    taxIncluded: boolean;
}
