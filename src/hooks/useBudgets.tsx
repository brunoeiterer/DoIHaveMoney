import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import type { BudgetFile } from "../lib/types/budgetFile";

interface FetchBudgetsResponse {
  folderId: string;
  budgets: BudgetFile[];
}

export function useBudgets() {
  const { accessToken } = useAuth();

  const { data, isFetching, error } = useQuery<FetchBudgetsResponse, Error>({
    queryKey: ["budgets", accessToken],

    queryFn: async () => {
      if (!accessToken) throw new Error("No access token provided");

      const folderQuery = encodeURIComponent(
        "mimeType='application/vnd.google-apps.folder' and name='DoIHaveMoney' and trashed=false",
      );

      const folderRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id, name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (!folderRes.ok)
        throw new Error("Failed to check Drive folder existence");
      const folderData = await folderRes.json();

      let currentFolderId: string;

      if (!folderData.files || folderData.files.length === 0) {
        const createRes = await fetch(
          "https://www.googleapis.com/drive/v3/files",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "DoIHaveMoney",
              mimeType: "application/vnd.google-apps.folder",
            }),
          },
        );

        if (!createRes.ok)
          throw new Error("Failed to create app folder in Google Drive");
        const createData = await createRes.json();
        currentFolderId = createData.id;
      } else {
        currentFolderId = folderData.files[0].id;
      }

      const filesQuery = encodeURIComponent(
        `'${currentFolderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
      );

      const filesRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${filesQuery}&fields=files(id, name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (!filesRes.ok)
        throw new Error("Failed to fetch budgets from Google Drive");
      const filesData = await filesRes.json();

      return {
        folderId: currentFolderId,
        budgets: filesData.files || [],
      };
    },

    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });

  return {
    budgets: data?.budgets || [],
    folderId: data?.folderId || null,
    isFetching,
    error: error ? error.message : null,
  };
}
