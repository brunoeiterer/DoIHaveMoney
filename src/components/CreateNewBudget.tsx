import { ActionIcon, Group, Paper, TextInput } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { LoadingState } from "./LoadingState";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import type { BudgetFile } from "../lib/types/budgetFile";

interface CreateNewBudgetProps {
  budgets: BudgetFile[];
  onClose: () => void;
  handleCreateBudget: (name: string) => Promise<void>;
}

export function CreateNewBudget({
  budgets,
  onClose,
  handleCreateBudget,
}: CreateNewBudgetProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { t } = useLanguage("CreateNewBudget");

  const handleCreateSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError(t("NameEmptyError"));
      return;
    }

    const isDuplicate = budgets.some(
      (budget) => budget.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (isDuplicate) {
      setError(t("NameAlreadyExists"));
      return;
    }

    try {
      setIsCreating(true);
      await handleCreateBudget(name);

      onClose();
    } catch (err) {
      setError(t("CreateFailed"));
    }

    setIsCreating(false);
  };

  return isCreating ? (
    <LoadingState />
  ) : (
    <Paper withBorder p="sm" radius="md">
      <Group align="flex-start">
        <TextInput
          placeholder={t("NamePlaceholder")}
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
            setError(null);
          }}
          error={error}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreateSubmit();
            if (e.key === "Escape") onClose();
          }}
          style={{ flex: 1 }}
        />

        <Group gap="xs">
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            onClick={handleCreateSubmit}
          >
            <IconCheck size={18} />
          </ActionIcon>
          <ActionIcon color="gray" variant="subtle" size="lg" onClick={onClose}>
            <IconX size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}
