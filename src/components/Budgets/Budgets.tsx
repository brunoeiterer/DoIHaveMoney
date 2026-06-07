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
import { IconPlus } from "@tabler/icons-react";
import { BudgetItem } from "./BudgetItem";

export function Budgets() {
  const { t } = useLanguage("Budgets");

  const { budgets, isFetching, error, folderId } = useBudgets();
  const createBudget = useCreateBudget(folderId);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNewBudgetClose = () => {
    setIsCreating(false);
  };

  const handleCreateBudget = async (name: string) => {
    await createBudget.mutateAsync(name);
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
                    <BudgetItem
                      key={budget.id}
                      id={budget.id}
                      name={budget.name}
                    />
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
              </Stack>
            )}
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
