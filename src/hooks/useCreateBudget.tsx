import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import { createBudgetSpreadsheet } from "../lib/googleDriveApi";

export function useCreateBudget(folderId: string | null) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetName: string) => {
      if (!accessToken || !folderId)
        throw new Error("Missing credentials or folder ID");
      return createBudgetSpreadsheet(budgetName, folderId, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", accessToken] });
    },
  });
}
