import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBudgetSpreadsheet } from "../lib/googleDriveApi";
import { getAccessToken } from "../context/AuthContext/AuthGlobal";

export function useCreateBudget(folderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetName: string) => {
      if (!folderId) throw new Error("Missing folder ID");
      return createBudgetSpreadsheet(budgetName, folderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets", getAccessToken()],
      });
    },
  });
}
