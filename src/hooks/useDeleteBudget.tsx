import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBudgetSpreadsheet } from "../lib/googleDriveApi";
import { getAccessToken } from "../context/AuthContext/AuthGlobal";

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (spreadsheetId: string) => {
      return deleteBudgetSpreadsheet(spreadsheetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", getAccessToken()],
      });
    },
  });
}
