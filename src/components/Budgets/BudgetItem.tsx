import {
  ActionIcon,
  Button,
  CloseButton,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { IconTrash, IconUsersGroup } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDeleteBudget } from "../../hooks/useDeleteBudget";
import { LoadingState } from "../LoadingState";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { BudgetFile } from "../../lib/types/budgetFile";
import { MembersManager } from "./MembersManager";
import { useAuth } from "../../context/AuthContext/AuthContext";

interface BudgetItemProps {
  budgetFile: BudgetFile;
}

export function BudgetItem({ budgetFile }: BudgetItemProps) {
  const [isSelectedForDelete, setIsSelectedForDelete] = useState(false);
  const [isMembersSelected, setIsMembersSelected] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const navigate = useNavigate();
  const { t, tRich } = useLanguage("BudgetItem");

  const deleteBudget = useDeleteBudget();

  const { user } = useAuth();

  const handleSelectForDelete = () => {
    setIsMembersSelected(false);
    setIsSelectedForDelete(!isSelectedForDelete);
  };

  const handleSelectMembers = () => {
    setIsSelectedForDelete(false);
    setIsMembersSelected(!isMembersSelected);
  };

  return (
    <Stack>
      <Paper withBorder radius="md" shadow="sm">
        <Group wrap="nowrap" align="center" justify="space-between">
          <UnstyledButton
            onClick={() =>
              navigate(`/budgets/${budgetFile.id}`, {
                state: { budgetFile: budgetFile },
              })
            }
            style={{ flex: 1, padding: "1rem" }}
          >
            <Text size="lg" fw={600}>
              {budgetFile.name}
            </Text>
          </UnstyledButton>

          <Group wrap="nowrap" gap="xs">
            <ActionIcon
              key={`${budgetFile.id}-members`}
              variant="subtle"
              size="lg"
              radius="md"
              onClick={handleSelectMembers}
              aria-label="Manage members"
            >
              <IconUsersGroup size="1.2rem" stroke={1.5} />
            </ActionIcon>

            <ActionIcon
              key={`${budgetFile.id}-delete`}
              variant="subtle"
              size="lg"
              radius="md"
              onClick={handleSelectForDelete}
              aria-label="Delete budget"
            >
              <IconTrash size="1.2rem" stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
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
      <Collapse expanded={isMembersSelected}>
        {isLoading ? (
          <LoadingState />
        ) : (
          <MembersManager
            permissions={budgetFile.permissions}
            currentUserEmail={user?.email ?? ""}
            isOwner={false}
            budgetId={budgetFile.id}
            onRemoveMember={async () => {}}
            onClose={() => setIsMembersSelected(false)}
            setIsloading={setIsloading}
          />
        )}
      </Collapse>
    </Stack>
  );
}
