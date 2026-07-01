import {
  Badge,
  Button,
  Center,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { CreateNewBudget } from "../CreateNewBudget";
import { useBudgets } from "../../hooks/useBudgets";
import { useCreateBudget } from "../../hooks/useCreateBudget";
import { LoadingState } from "../LoadingState";
import { IconFileImport, IconPlus } from "@tabler/icons-react";
import { BudgetItem } from "./BudgetItem";
import {
  DrivePicker,
  DrivePickerDocsView,
} from "@googleworkspace/drive-picker-react";

export function Budgets() {
  const { t } = useLanguage("Budgets");

  const { budgets, isFetching, error, folderId, refetch } = useBudgets();
  const createBudget = useCreateBudget(folderId ?? "");
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleCreateNewBudgetClose = () => {
    setIsCreating(false);
  };

  const handleCreateBudget = async (name: string) => {
    await createBudget.mutateAsync(name);
  };

  const handleImport = () => {
    setIsImporting(false);
    refetch();
  };

  useEffect(() => {
    if (error) {
      notifications.show({
        title: t("SyncErrorTitle"),
        message: t("SyncErrorMessage"),
        color: "red",
      });
    }
  }, [error, t]);

  return (
    <Container size="sm">
      <Center mih="100vh">
        <Paper p="xl" radius="lg" w="100%" withBorder={false}>
          <Stack align="center" gap="lg">
            <Badge size="lg" variant="light">
              {t("Budgets")}
            </Badge>

            <Title order={1} ta="center">
              {t("YourBudgets")}
            </Title>

            <Text c="dimmed" ta="center">
              {t("SelectOrCreate")}
            </Text>

            {isFetching ? (
              <LoadingState />
            ) : (
              <Stack w="100%" gap="sm" mt="md">
                {budgets.length === 0 ? (
                  <Text ta="center" fs="italic" c="dimmed" py="xl">
                    {t("NoBudgetsFound")}
                  </Text>
                ) : (
                  budgets.map((budget) => (
                    <BudgetItem key={budget.id} budgetFile={budget} />
                  ))
                )}

                {isCreating ? (
                  <CreateNewBudget
                    budgets={budgets}
                    onClose={handleCreateNewBudgetClose}
                    handleCreateBudget={handleCreateBudget}
                  />
                ) : (
                  <Button
                    size="lg"
                    mt="md"
                    fullWidth
                    variant="filled"
                    leftSection={<IconPlus />}
                    onClick={() => setIsCreating(true)}
                  >
                    {t("CreateNewBudget")}
                  </Button>
                )}
                <Button
                  size="lg"
                  mt="md"
                  fullWidth
                  variant="filled"
                  leftSection={<IconFileImport />}
                  onClick={() => setIsImporting(true)}
                >
                  {t("ImportBudget")}
                </Button>

                {isImporting && (
                  <DrivePicker
                    client-id="1044533121358-2rs5bvb5cinl5s4lj4srncvon1tavvk3.apps.googleusercontent.com"
                    app-id="1044533121358"
                    onPicked={handleImport}
                    onCanceled={() => setIsImporting(false)}
                  >
                    <DrivePickerDocsView
                      include-folders="true"
                      view-id="SPREADSHEETS"
                      mime-types="application/vnd.google-apps.spreadsheet"
                    />
                  </DrivePicker>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
