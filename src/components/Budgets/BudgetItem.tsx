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

interface BudgetItemProps {
  id: string;
  name: string;
}

export function BudgetItem({ id, name }: BudgetItemProps) {
  const [isSelectedForDelete, setIsSelectedForDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { tRich } = useLanguage("BudgetItem");

  const deleteBudget = useDeleteBudget();

  return (
    <Stack>
      <Group>
        <Button
          key={id}
          variant="default"
          size="xl"
          onClick={() => navigate(`/budget/${id}`)}
          style={{ flex: 1 }}
        >
          {name}
        </Button>
        <Button
          key={`${id}-delete`}
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
                {tRich("ConfirmDeletionInput", { name })}
              </Text>
              <CloseButton
                mb="sm"
                onClick={() => setIsSelectedForDelete(false)}
              />
            </Group>

            <Group align="flex-start">
              <TextInput
                style={{ flex: 1, borderColor: "var(--mantine-color-red-6)" }}
                placeholder={name}
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.currentTarget.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && deleteInput === name) {
                    setIsDeleting(true);
                    await deleteBudget.mutateAsync(id);
                    setIsDeleting(false);
                  }
                }}
              />
              <Button
                color="red"
                disabled={deleteInput !== name}
                onClick={async () => {
                  setIsDeleting(true);
                  await deleteBudget.mutateAsync(id);
                  setIsDeleting(false);
                }}
              >
                Delete Forever
              </Button>
            </Group>
          </Paper>
        )}
      </Collapse>
    </Stack>
  );
}
