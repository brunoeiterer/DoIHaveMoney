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
      await addExpenseToSheet(spreadsheetId, expense, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] });
    },
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      await addCategoryToSheet(spreadsheetId!, name, accessToken!);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  const deleteExpense = useMutation({
    mutationFn: async (rowIndex: number) => {
      await deleteSheetRow(spreadsheetId!, dataSheetId, rowIndex, accessToken!);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (rowIndex: number) => {
      await deleteSheetRow(
        spreadsheetId!,
        categoriesSheetId,
        rowIndex,
        accessToken!,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  return {
    expenses: query.data?.expenses || [],
    categories: query.data?.categories || [],
    isLoading: query.isFetching,
    error: query.error,
    addExpense: addExpense.mutateAsync,
    addCategory: addCategory.mutateAsync,
    deleteExpense: deleteExpense.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    isExpensePending: addExpense.isPending || deleteExpense.isPending,
    isCategoryPending: addCategory.isPending || deleteCategory.isPending,
  };
}
