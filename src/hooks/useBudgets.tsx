import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext/AuthContext";
import type { BudgetFile } from "../lib/types/budgetFile";
import { getSpreadsheetMetadata } from "../lib/googleDriveApi";

interface FetchBudgetsResponse {
  folderId: string;
  budgets: BudgetFile[];
}

interface DriveFile {
  id: string;
  name: string;
  parents?: string[];
  permissions: { role: string; emailAddress: string }[];
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

      const query =
        "trashed = false and mimeType = 'application/vnd.google-apps.spreadsheet'";
      const fields =
        "files(id, name, parents, permissions(role, emailAddress))";
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await response.json();
      const allFiles: DriveFile[] = data.files || [];

      await Promise.all(
        allFiles.map(async (file) => {
          const isInsideLocalFolder = file.parents?.includes(currentFolderId);

          if (!isInsideLocalFolder) {
            await fetch(
              `https://www.googleapis.com/drive/v3/files/${file.id}?addParents=${currentFolderId}`,
              {
                method: "PATCH",
                headers: { Authorization: `Bearer ${accessToken}` },
              },
            );
          }
        }),
      );

      const budgetsWithMetadata = await Promise.all(
        allFiles.map(
          async (file: {
            id: string;
            name: string;
            permissions: { role: string; emailAddress: string }[];
          }) => {
            const metadata = await getSpreadsheetMetadata(file.id, accessToken);
            return {
              ...file,
              sheetIds: metadata.sheetMap,
            };
          },
        ),
      );

      return {
        budgets: budgetsWithMetadata,
        folderId: currentFolderId,
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
