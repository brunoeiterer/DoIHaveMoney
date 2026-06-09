export interface BudgetFile {
  id: string;
  name: string;
  sheetIds: Record<string, number>;
  owners: Array<{ emailAddress: string; displayName: string }>;
}
