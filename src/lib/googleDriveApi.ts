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
            updateCells: {
              start: { sheetId: 0, rowIndex: 0, columnIndex: 0 },
              rows: [
                {
                  values: [
                    { userEnteredValue: { stringValue: "Date" } },
                    { userEnteredValue: { stringValue: "Description" } },
                    { userEnteredValue: { stringValue: "Amount" } },
                  ],
                },
              ],
              fields: "userEnteredValue",
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
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data!A2:C`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error("Failed to fetch budget data");
  const data = await res.json();

  return (data.values || []).map((row: any[], index: number) => ({
    id: index,
    date: row[0],
    description: row[1],
    amount: parseFloat(row[2] || "0"),
  }));
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
        values: [[expense.date, expense.description, expense.amount]],
      }),
    },
  );
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}
