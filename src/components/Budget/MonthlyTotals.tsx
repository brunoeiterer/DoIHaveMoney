import {
  Paper,
  Table,
  Text,
  ScrollArea,
  Group,
  Title,
  Badge,
} from "@mantine/core";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { Expense } from "../../lib/types/expense";

interface MonthlyTotalsProps {
  expenses: Expense[];
  recurringExpenses: Expense[];
  currentMonth: string;
}

export function MonthlyTotals({
  expenses,
  recurringExpenses,
  currentMonth,
}: MonthlyTotalsProps) {
  const { t } = useLanguage("MonthlyTotals");

  const currentMonthExpenses = expenses
    .filter((expense) => expense.date?.startsWith(currentMonth))
    .concat(recurringExpenses);

  const activeCategories = Array.from(
    new Set(currentMonthExpenses.map((e) => e.category)),
  );

  const groupedExpenses: Record<string, Expense[]> = {};
  const categoryTotals: Record<string, number> = {};
  let overallTotal = 0;

  activeCategories.forEach((category) => {
    const categoryItems = currentMonthExpenses.filter(
      (e) => e.category === category,
    );

    groupedExpenses[category] = categoryItems.sort((a, b) =>
      !a.date
        ? 1
        : !b.date
          ? -1
          : new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const total = categoryItems.reduce((sum, item) => sum + item.amount, 0);
    categoryTotals[category] = total;
    overallTotal += total;
  });

  const maxRows =
    activeCategories.length > 0
      ? Math.max(...activeCategories.map((cat) => groupedExpenses[cat].length))
      : 0;

  if (activeCategories.length === 0) {
    return (
      <Paper
        withBorder
        p="xl"
        radius="md"
        mt="xl"
        style={{ textAlign: "center" }}
      >
        <Text c="dimmed">{t("NoExpensesForMonth")}</Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder p="md" radius="md" mt="xl">
      <Group justify="space-between" mb="md">
        <Title order={4}>{t("MonthlyTotals")}</Title>
        <Group gap="xs">
          <Text size="sm" c="dimmed">
            {t("TotalSpent")}
          </Text>
          <Badge size="lg" color="red" variant="light">
            ${overallTotal.toFixed(2)}
          </Badge>
        </Group>
      </Group>

      <ScrollArea>
        <Table horizontalSpacing="sm" verticalSpacing="xs" withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {activeCategories.map((category) => (
                <Table.Th key={category} style={{ minWidth: 200 }}>
                  <Group justify="space-between">
                    <Text size="sm" fw={700}>
                      {category}
                    </Text>
                    <Text size="md" fw={600} c="red">
                      ${categoryTotals[category].toFixed(2)}
                    </Text>
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Array.from({ length: maxRows }).map((_, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {activeCategories.map((category) => {
                  const expense = groupedExpenses[category][rowIndex];

                  return (
                    <Table.Td
                      key={`${category}-${rowIndex}`}
                      style={{ verticalAlign: "top" }}
                    >
                      {expense ? (
                        <div>
                          <Group
                            justify="space-between"
                            wrap="nowrap"
                            align="flex-start"
                          >
                            <Text
                              size="sm"
                              style={{ flex: 1, wordBreak: "break-word" }}
                            >
                              {expense.description}
                            </Text>
                            <Text size="sm" fw={600}>
                              ${expense.amount.toFixed(2)}
                            </Text>
                          </Group>
                          {expense.date && (
                            <Text size="xs" c="dimmed">
                              {t("Day")} {expense.date.split("-")[2]}
                            </Text>
                          )}
                        </div>
                      ) : null}{" "}
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
