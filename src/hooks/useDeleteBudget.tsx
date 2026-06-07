import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import { deleteBudgetSpreadsheet } from "../lib/googleDriveApi";

export function useDeleteBudget() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (spreadsheetId: string) => {
      if (!accessToken) throw new Error("No access token available");
      return deleteBudgetSpreadsheet(spreadsheetId, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", accessToken] });
    },
  });
}
