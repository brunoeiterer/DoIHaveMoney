import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import { addExpenseToSheet, fetchBudgetData } from "../lib/googleDriveApi";

export function useBudget(spreadsheetId: string | undefined) {
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
      amount: number;
    }) => {
      if (!accessToken || !spreadsheetId) throw new Error("Missing auth or ID");
      return addExpenseToSheet(spreadsheetId, expense, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", spreadsheetId] });
    },
  });

  return {
    expenses: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addExpense: addExpense.mutate,
    isAddingExpense: addExpense.isPending,
  };
}
