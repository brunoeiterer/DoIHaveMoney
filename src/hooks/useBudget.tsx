import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import {
  addCategoryToSheet,
  addExpenseToSheet,
  deleteSheetRow,
  fetchBudgetData,
} from "../lib/googleDriveApi";

export function useBudget(
  spreadsheetId: string | undefined,
  dataSheetId: number,
  categoriesSheetId: number,
) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budget", spreadsheetId],
    queryFn: async () => {
      if (!accessToken || !spreadsheetId) throw new Error("Missing auth or ID");
      return fetchBudgetData(spreadsheetId, accessToken);
    },
    enabled: !!accessToken && !!spreadsheetId,
  });

  const addExpense = useMutation({
    mutationFn: async (expense: {
      date: string;
      description: string;
      category: string;
      amount: number;
    }) => {
      if (!accessToken || !spreadsheetId) throw new Error("Missing auth or ID");
      return addExpenseToSheet(spreadsheetId, expense, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] });
    },
  });

  const addCategory = useMutation({
    mutationFn: (newCat: { name: string }) =>
      addCategoryToSheet(spreadsheetId!, newCat.name, accessToken!),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  // 2. Delete Expense (Data sheet)
  const deleteExpense = useMutation({
    mutationFn: (rowIndex: number) =>
      deleteSheetRow(spreadsheetId!, dataSheetId, rowIndex, accessToken!),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  const deleteCategory = useMutation({
    mutationFn: (rowIndex: number) =>
      deleteSheetRow(spreadsheetId!, categoriesSheetId, rowIndex, accessToken!),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  return {
    expenses: query.data?.expenses || [],
    categories: query.data?.categories || [],
    isLoading: query.isLoading,
    error: query.error,
    addExpense: addExpense.mutate,
    addCategory: addCategory.mutate,
    deleteExpense: deleteExpense.mutate,
    deleteCategory: deleteCategory.mutate,
    isAddingExpense: addExpense.isPending,
  };
}
