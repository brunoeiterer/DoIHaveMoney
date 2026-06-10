import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import {
  addCategoryToSheet,
  addExpenseToSheet,
  addRecurringExpenseToSheet,
  deleteSheetRow,
  fetchBudgetData,
} from "../lib/googleDriveApi";
import { useState } from "react";
import type { Expense } from "../lib/types/expense";
import { getAccessToken } from "../context/AuthContext/AuthGlobal";

export function useBudget(spreadsheetId: string | undefined) {
  const queryClient = useQueryClient();

  const [dataSheetId, setDataSheetId] = useState<number>();
  const [categoriesSheetId, setCategoriesSheetId] = useState<number>();
  const [recurringDataSheetId, setRecurringDataSheetId] = useState<number>();

  const accessToken = getAccessToken();

  const query = useQuery({
    queryKey: ["budget", spreadsheetId],
    queryFn: async () => {
      if (!accessToken || !spreadsheetId) throw new Error("Missing auth or ID");
      const data = await fetchBudgetData(spreadsheetId);

      setDataSheetId(data.metadata.sheetMap["Data"]);
      setCategoriesSheetId(data.metadata.sheetMap["Categories"]);
      setRecurringDataSheetId(data.metadata.sheetMap["RecurringData"]);

      return data;
    },
    enabled: !!accessToken && !!spreadsheetId,
  });

  const addExpense = useMutation({
    mutationFn: async (expense: Expense) => {
      if (!accessToken || !spreadsheetId) throw new Error("Missing auth or ID");
      await addExpenseToSheet(spreadsheetId, expense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] });
    },
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      await addCategoryToSheet(spreadsheetId!, name!);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  const deleteExpense = useMutation({
    mutationFn: async (rowIndex: number) => {
      await deleteSheetRow(spreadsheetId!, dataSheetId!, rowIndex);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  const deleteCategory = useMutation({
    mutationFn: async (rowIndex: number) => {
      await deleteSheetRow(spreadsheetId!, categoriesSheetId!, rowIndex);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  const addRecurringExpense = useMutation({
    mutationFn: async (expense: Expense) => {
      if (!accessToken || !spreadsheetId) throw new Error("Missing auth or ID");
      await addRecurringExpenseToSheet(spreadsheetId, expense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] });
    },
  });

  const deleteRecurringExpense = useMutation({
    mutationFn: async (rowIndex: number) => {
      await deleteSheetRow(spreadsheetId!, recurringDataSheetId!, rowIndex);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] }),
  });

  return {
    budgetName: query.data?.metadata.title,
    expenses: query.data?.expenses || [],
    categories: query.data?.categories || [],
    recurringExpenses: query.data?.recurringExpenses || [],
    isLoading: query.isLoading,
    error: query.error,
    addExpense: addExpense.mutateAsync,
    addCategory: addCategory.mutateAsync,
    deleteExpense: deleteExpense.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    addRecurringExpense: addRecurringExpense.mutateAsync,
    deleteRecurringExpense: deleteRecurringExpense.mutateAsync,
    isExpensePending: addExpense.isPending || deleteExpense.isPending,
    isCategoryPending: addCategory.isPending || deleteCategory.isPending,
    isRecurringExpensePending:
      addRecurringExpense.isPending || deleteRecurringExpense.isPending,
  };
}
