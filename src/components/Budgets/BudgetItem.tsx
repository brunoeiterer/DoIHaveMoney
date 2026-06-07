import {
  Button,
  CloseButton,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDeleteBudget } from "../../hooks/useDeleteBudget";
import { LoadingState } from "../LoadingState";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { BudgetFile } from "../../lib/types/budgetFile";

interface BudgetItemProps {
  budgetFile: BudgetFile;
}

export function BudgetItem({ budgetFile }: BudgetItemProps) {
  const [isSelectedForDelete, setIsSelectedForDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { t, tRich } = useLanguage("BudgetItem");

  const deleteBudget = useDeleteBudget();

  return (
    <Stack>
      <Group>
        <Button
          key={budgetFile.id}
          variant="default"
          size="xl"
          onClick={() =>
            navigate(`/budgets/${budgetFile.id}`, {
              state: {
                budgetFile: budgetFile,
              },
            })
          }
          style={{ flex: 1 }}
        >
          {budgetFile.name}
        </Button>
        <Button
          key={`${budgetFile.id}-delete`}
          variant="filled"
          size="xl"
          onClick={() => setIsSelectedForDelete(true)}
        >
          <IconTrash />
        </Button>
      </Group>
      <Collapse expanded={isSelectedForDelete}>
        {isDeleting ? (
          <LoadingState />
        ) : (
          <Paper
            withBorder
            p="md"
            radius="md"
            style={{ borderColor: "var(--mantine-color-red-6)" }}
          >
            <Group justify="space-between" align="center">
              <Text size="sm" mb="sm" fw={500}>
                {tRich("ConfirmDeletionInput", { name: budgetFile.name })}
              </Text>
              <CloseButton
                mb="sm"
                onClick={() => setIsSelectedForDelete(false)}
              />
            </Group>

            <Group align="flex-start">
              <TextInput
                style={{ flex: 1, borderColor: "var(--mantine-color-red-6)" }}
                placeholder={budgetFile.name}
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.currentTarget.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && deleteInput === budgetFile.name) {
                    setIsDeleting(true);
                    await deleteBudget.mutateAsync(budgetFile.id);
                    setIsDeleting(false);
                  }
                }}
              />
              <Button
                color="red"
                disabled={deleteInput !== budgetFile.name}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteBudget.mutateAsync(budgetFile.id);
                  setIsDeleting(false);
                }}
              >
                {t("DeleteForever")}
              </Button>
            </Group>
          </Paper>
        )}
      </Collapse>
    </Stack>
  );
}
