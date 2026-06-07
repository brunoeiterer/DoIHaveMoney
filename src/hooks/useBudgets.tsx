import { useState, useEffect, useRef } from 'react';

export interface BudgetFile {
    id: string;
    name: string;
}

export function useBudgets(accessToken: string | null) {
    const [budgets, setBudgets] = useState<BudgetFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [folderId, setFolderId] = useState<string | null>(null);

    const processedToken = useRef<string | null>(null);

    useEffect(() => {
        if (!accessToken) return;

        if (processedToken.current === accessToken) return;
        processedToken.current = accessToken;

        async function initializeDrive() {
            setIsLoading(true);
            setError(null);

            try {
                const folderQuery = encodeURIComponent(
                    "mimeType='application/vnd.google-apps.folder' and name='DoIHaveMoney' and trashed=false"
                );

                const folderRes = await fetch(
                    `https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id, name)`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                const folderData = await folderRes.json();
                let currentFolderId: string;

                if (!folderData.files || folderData.files.length === 0) {
                    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: 'DoIHaveMoney',
                            mimeType: 'application/vnd.google-apps.folder',
                        }),
                    });

                    const createData = await createRes.json();
                    currentFolderId = createData.id;
                } else {
                    currentFolderId = folderData.files[0].id;
                }

                setFolderId(currentFolderId);

                const filesQuery = encodeURIComponent(
                    `'${currentFolderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
                );

                const filesRes = await fetch(
                    `https://www.googleapis.com/drive/v3/files?q=${filesQuery}&fields=files(id, name)`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                const filesData = await filesRes.json();
                setBudgets(filesData.files || []);

            } catch (err) {
                console.error("Drive API Error:", err);
                setError("Failed to sync with Google Drive.");
                processedToken.current = null;
            } finally {
                setIsLoading(false);
            }
        }

        initializeDrive();
    }, [accessToken]);

    return { budgets, isLoading, error, folderId };
}