import { useMutation } from "@tanstack/react-query";
import { shareBudgetFile } from "../lib/googleDriveApi";

export function useShareBudget() {
  return useMutation({
    mutationFn: async (shareData: { spreadSheetId: string; email: string }) => {
      if (!shareData.spreadSheetId) throw new Error("Missing ID");

      await shareBudgetFile(shareData);
    },
  }).mutateAsync;
}
