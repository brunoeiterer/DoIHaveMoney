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
import { IconShare, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDeleteBudget } from "../../hooks/useDeleteBudget";
import { LoadingState } from "../LoadingState";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { BudgetFile } from "../../lib/types/budgetFile";
import { useShareBudget } from "../../hooks/useShareBudget";
import { isValidEmail } from "../../lib/utils";

interface BudgetItemProps {
  budgetFile: BudgetFile;
}

export function BudgetItem({ budgetFile }: BudgetItemProps) {
  const [isSelectedForDelete, setIsSelectedForDelete] = useState(false);
  const [isSelectedForSharing, setIsSelectedForSharing] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const navigate = useNavigate();
  const { t, tRich } = useLanguage("BudgetItem");

  const deleteBudget = useDeleteBudget();
  const shareBuget = useShareBudget();

  const handleSelectForDelete = () => {
    setIsSelectedForSharing(false);
    setIsSelectedForDelete(true);
  };

  const handleSelectForSharing = () => {
    setIsSelectedForDelete(false);
    setIsSelectedForSharing(true);
  };

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
          onClick={handleSelectForDelete}
        >
          <IconTrash />
        </Button>
        <Button
          key={`${budgetFile.id}-share`}
          variant="filled"
          size="xl"
          onClick={handleSelectForSharing}
        >
          <IconShare />
        </Button>
      </Group>
      <Collapse expanded={isSelectedForDelete}>
        {isLoading ? (
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
                    setIsloading(true);
                    await deleteBudget.mutateAsync(budgetFile.id);
                    setIsloading(false);
                  }
                }}
              />
              <Button
                color="red"
                disabled={deleteInput !== budgetFile.name}
                onClick={async () => {
                  setIsloading(true);
                  await deleteBudget.mutateAsync(budgetFile.id);
                  setIsloading(false);
                }}
              >
                {t("DeleteForever")}
              </Button>
            </Group>
          </Paper>
        )}
      </Collapse>
      <Collapse expanded={isSelectedForSharing}>
        {isLoading ? (
          <LoadingState />
        ) : (
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between" align="center">
              <Text size="sm" mb="sm" fw={500}>
                {t("EnterEmail")}
              </Text>
              <CloseButton
                mb="sm"
                onClick={() => setIsSelectedForSharing(false)}
              />
            </Group>

            <Group align="flex-start">
              <TextInput
                style={{ flex: 1 }}
                placeholder={t("Email")}
                value={emailInput}
                onChange={(e) => setEmailInput(e.currentTarget.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && isValidEmail(emailInput)) {
                    setIsloading(true);
                    await shareBuget({
                      spreadSheetId: budgetFile.id,
                      email: emailInput,
                    });
                    setIsloading(false);
                  }
                }}
              />
              <Button
                color="emerald"
                disabled={!isValidEmail(emailInput)}
                onClick={async () => {
                  setIsloading(true);
                  await shareBuget({
                    spreadSheetId: budgetFile.id,
                    email: emailInput,
                  });
                  setIsloading(false);
                }}
              >
                {t("Share")}
              </Button>
            </Group>
          </Paper>
        )}
      </Collapse>
    </Stack>
  );
}
