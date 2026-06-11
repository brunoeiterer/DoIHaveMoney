import { getAccessToken } from "../context/AuthContext/AuthGlobal";
import type { Category } from "./types/category";
import type { Expense } from "./types/expense";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function createBudgetSpreadsheet(
  budgetName: string,
  folderId: string,
) {
  const accessToken = getAccessToken();

  const driveRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: budgetName,
      mimeType: "application/vnd.google-apps.spreadsheet",
      parents: [folderId],
    }),
  });

  if (!driveRes.ok)
    throw new ApiError("Failed to create file in Drive", driveRes.status);

  const file = await driveRes.json();
  const spreadsheetId = file.id;

  const sheetsRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            updateSheetProperties: {
              properties: { sheetId: 0, title: "Data" },
              fields: "title",
            },
          },
          {
            addSheet: {
              properties: { title: "Categories" },
            },
          },
          {
            addSheet: {
              properties: { title: "RecurringData" },
            },
          },
        ],
      }),
    },
  );

  if (!sheetsRes.ok)
    throw new ApiError("Failed to format spreadsheet", sheetsRes.status);

  return spreadsheetId;
}

export async function deleteBudgetSpreadsheet(
  spreadsheetId: string,
): Promise<void> {
  const accessToken = getAccessToken();

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheetId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!res.ok) {
    throw new ApiError("Failed to delete spreadsheet", res.status);
  }
}

export async function fetchBudgetData(spreadsheetId: string) {
  const accessToken = getAccessToken();

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet`,
  );
  url.searchParams.append("ranges", "Data");
  url.searchParams.append("ranges", "Categories");
  url.searchParams.append("ranges", "RecurringData");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new ApiError("Failed to fetch budget data", res.status);

  const data = await res.json();

  const dataSheetValues = data.valueRanges[0].values || [];
  const categoriesSheetValues = data.valueRanges[1].values || [];
  const recurringDataSheetValues = data.valueRanges[2].values || [];

  const expenses: Expense[] = dataSheetValues.map(
    (row: any[], index: number) => ({
      id: index,
      date: row[0] || "",
      description: row[1] || "",
      category: row[2] || "",
      amount: parseFloat(row[3] || "0"),
    }),
  );

  expenses.reverse();

  const categories: Category[] = categoriesSheetValues.map(
    (row: any[], index: number) => ({
      id: index,
      name: row[0] || "",
    }),
  );

  categories.reverse();

  const recurringExpenses: Expense[] = recurringDataSheetValues.map(
    (row: any[], index: number) => ({
      id: index,
      description: row[0] || "",
      category: row[1] || "",
      amount: parseFloat(row[2] || "0"),
    }),
  );

  recurringExpenses.reverse();

  const metadata = await getSpreadsheetMetadata(spreadsheetId);

  return { metadata, expenses, categories, recurringExpenses };
}

export async function addExpenseToSheet(spreadsheetId: string, expense: any) {
  const accessToken = getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data!A:C:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [expense.date, expense.description, expense.category, expense.amount],
        ],
      }),
    },
  );
  if (!res.ok) throw new ApiError("Failed to add expense", res.status);
  return res.json();
}

export async function addRecurringExpenseToSheet(
  spreadsheetId: string,
  expense: any,
) {
  const accessToken = getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/RecurringData!A:C:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          expense.date
            ? [
                expense.date,
                expense.description,
                expense.category,
                expense.amount,
              ]
            : [expense.description, expense.category, expense.amount],
        ],
      }),
    },
  );
  if (!res.ok) throw new ApiError("Failed to add expense", res.status);
  return res.json();
}

export async function addCategoryToSheet(spreadsheetId: string, name: string) {
  const accessToken = getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Categories!A:A:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [[name]] }),
    },
  );

  if (!res.ok) throw new ApiError("Failed to add category", res.status);
}

export async function deleteSheetRow(
  spreadsheetId: string,
  sheetId: number,
  rowIndex: number,
) {
  const accessToken = getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      }),
    },
  );

  if (!res.ok) throw new ApiError("Failed to delete row", res.status);
}

export async function getSpreadsheetMetadata(spreadsheetId: string) {
  const accessToken = getAccessToken();

  let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`;
  let res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new ApiError("Failed to get metadata", res.status);

  let data = await res.json();

  const sheetMap: Record<string, number> = {};
  data.sheets.forEach((s: any) => {
    sheetMap[s.properties.title] = s.properties.sheetId;
  });

  url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title`;
  res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new ApiError("Failed to get metadata", res.status);

  data = await res.json();

  const title = data.properties.title as string;

  return { title, sheetMap };
}

export async function shareBudgetFile(shareData: {
  spreadSheetId: string;
  email: string;
}) {
  const accessToken = getAccessToken();

  const url = `https://www.googleapis.com/drive/v3/files/${shareData.spreadSheetId}/permissions?sendNotificationEmail=true`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "writer",
      type: "user",
      emailAddress: shareData.email,
    }),
  });

  if (!response.ok)
    throw new ApiError("Failed to share budget", response.status);

  return response.json();
}
