import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import { shareBudgetFile } from "../lib/googleDriveApi";

export function useShareBudget() {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async (shareData: { spreadSheetId: string; email: string }) => {
      if (!accessToken || !shareData.spreadSheetId)
        throw new Error("Missing auth or ID");

      await shareBudgetFile(shareData, accessToken);
    },
  }).mutateAsync;
}
