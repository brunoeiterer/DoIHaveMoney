// src/pages/Budget.tsx
import { useState } from "react";
import {
  Container,
  Group,
  Button,
  Title,
  Grid,
  Paper,
  ActionIcon,
  Text,
  Center,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { useBudget } from "../../hooks/useBudget";
import { LoadingState } from "../LoadingState";
import { useLocation, useNavigate, useParams } from "react-router";
import { ExpensesManager } from "./ExpensesManager";
import { CategoriesManager } from "./CategoriesManager";
import type { BudgetFile } from "../../lib/types/budgetFile";

interface BudgetState {
  budgetFile: BudgetFile;
}

export function Budget() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage("Budget");
  const location = useLocation();

  const state = location.state as BudgetState;
  const budgetName = state.budgetFile.name;

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const {
    expenses,
    categories,
    isLoading,
    addExpense,
    deleteExpense,
    addCategory,
    deleteCategory,
  } = useBudget(
    id,
    state.budgetFile.sheetIds["Data"],
    state.budgetFile.sheetIds["Categories"],
  );

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const date = new Date(year, month - 2, 1);
    setCurrentMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split("-").map(Number);
    const date = new Date(year, month, 1);
    setCurrentMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const formatDisplayMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString(navigator.language, {
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <Container size="lg" py="xl" pos="relative">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/budgets")}
      >
        {t("BackToBudgets")}
      </Button>

      <Center mb="sm">
        <Title order={2}>{budgetName}</Title>
      </Center>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          {" "}
          <CategoriesManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <ExpensesManager
            expenses={expenses}
            categories={categories}
            onAddExpense={addExpense}
            onDeleteExpense={deleteExpense}
          />
        </Grid.Col>
      </Grid>

      <Paper withBorder radius="md" mb="xl" mt="xl">
        <Group justify="space-between">
          <ActionIcon variant="subtle" size="lg" onClick={handlePrevMonth}>
            <IconChevronLeft size={20} />
          </ActionIcon>
          <Text fw={700} size="lg" style={{ textTransform: "capitalize" }}>
            {formatDisplayMonth(currentMonth)}
          </Text>
          <ActionIcon variant="subtle" size="lg" onClick={handleNextMonth}>
            <IconChevronRight size={20} />
          </ActionIcon>
        </Group>
      </Paper>
    </Container>
  );
}
