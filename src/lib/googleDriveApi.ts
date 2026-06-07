import type { Category } from "./types/category";
import type { Expense } from "./types/expense";

export async function createBudgetSpreadsheet(
  budgetName: string,
  folderId: string,
  accessToken: string,
) {
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

  if (!driveRes.ok) throw new Error("Failed to create file in Drive");
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
        ],
      }),
    },
  );

  if (!sheetsRes.ok) throw new Error("Failed to format spreadsheet");

  return spreadsheetId;
}

export async function deleteBudgetSpreadsheet(
  spreadsheetId: string,
  token: string,
): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheetId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to delete spreadsheet: ${res.statusText}`);
  }
}

export async function fetchBudgetData(spreadsheetId: string, token: string) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet`,
  );
  url.searchParams.append("ranges", "Data");
  url.searchParams.append("ranges", "Categories");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch budget data");

  const data = await res.json();

  const dataSheetValues = data.valueRanges[0].values || [];
  const categoriesSheetValues = data.valueRanges[1].values || [];

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

  return { expenses, categories };
}

export async function addExpenseToSheet(
  spreadsheetId: string,
  expense: any,
  token: string,
) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data!A:C:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [expense.date, expense.description, expense.category, expense.amount],
        ],
      }),
    },
  );
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}

export async function addCategoryToSheet(
  spreadsheetId: string,
  name: string,
  token: string,
) {
  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Categories!A:A:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [[name]] }),
    },
  );
}

export async function deleteSheetRow(
  spreadsheetId: string,
  sheetId: number,
  rowIndex: number,
  token: string,
) {
  return fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
}

export async function getSpreadsheetMetadata(
  spreadsheetId: string,
  token: string,
) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  const sheetMap: Record<string, number> = {};
  data.sheets.forEach((s: any) => {
    sheetMap[s.properties.title] = s.properties.sheetId;
  });

  return sheetMap;
}
