import { useState } from "react";
import {
  Paper,
  Title,
  Table,
  Group,
  TextInput,
  NumberInput,
  Select,
  ActionIcon,
  Text,
  ScrollArea,
} from "@mantine/core";
import { DateInput, type DateValue } from "@mantine/dates";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { Expense } from "../../lib/types/expense";
import type { Category } from "../../lib/types/category";

interface ExpensesManagerProps {
  expenses: Expense[];
  categories: Category[];
  onAddExpense: (expense: Expense) => Promise<void>;
  onDeleteExpense: (id: number) => Promise<void>;
}

export function ExpensesManager({
  expenses,
  categories,
  onAddExpense,
  onDeleteExpense,
}: ExpensesManagerProps) {
  const { t } = useLanguage("ExpensesManager");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState<string | number>(0);
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState<DateValue | null>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount || !category) return;

    setIsSubmitting(true);

    try {
      await onAddExpense({
        description: desc,
        amount: Number(amount),
        category: category,
        date: new Date().toISOString().split("T")[0],
      });
    } finally {
      setIsSubmitting(false);
    }

    setDesc("");
    setAmount(0);
    setCategory(null);
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      await onDeleteExpense(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md" h={"500px"}>
      <Group justify="space-between" mb="md">
        <Title order={4}>{t("Expenses")}</Title>
      </Group>

      <form onSubmit={handleSubmit}>
        <Group align="flex-end" mb="xl" gap="xs">
          <DateInput
            label={t("Date")}
            value={date}
            onChange={setDate}
            valueFormat="YYYY-MM-DD"
            style={{ width: 140 }}
            required
          />
          <TextInput
            placeholder={t("ExpensePlaceholder")}
            label={t("Description")}
            value={desc}
            onChange={(e) => setDesc(e.currentTarget.value)}
            style={{ flex: 2 }}
            required
          />
          <Select
            label={t("Category")}
            placeholder={t("SelectCategory")}
            data={categories.map((c) => ({ value: c.name, label: c.name }))}
            value={category}
            onChange={setCategory}
            style={{ flex: 1.5 }}
            required
          />
          <NumberInput
            placeholder="0.00"
            label={t("Amount")}
            value={amount}
            onChange={setAmount}
            hideControls
            decimalScale={2}
            style={{ flex: 1 }}
            required
          />
          <ActionIcon
            type="submit"
            size="lg"
            color="emerald"
            variant="filled"
            disabled={isSubmitting}
          >
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
      </form>

      <ScrollArea h={300}>
        <Table horizontalSpacing="sm" verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("Date")}</Table.Th>
              <Table.Th>{t("Description")}</Table.Th>
              <Table.Th>{t("Category")}</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>{t("Amount")}</Table.Th>
              <Table.Th aria-label="actions" />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {expenses.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: "center" }}>
                  <Text c="dimmed" py="md">
                    {t("NoExpensesThisMonth")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              expenses.map((expense) => (
                <Table.Tr key={expense.id}>
                  <Table.Td style={{ whiteSpace: "nowrap" }}>
                    {expense.date}
                  </Table.Td>{" "}
                  <Table.Td>{expense.description}</Table.Td>
                  <Table.Td>{expense.category}</Table.Td>
                  <Table.Td style={{ textAlign: "right", fontWeight: 600 }}>
                    ${expense.amount.toFixed(2)}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDelete(expense.id!)}
                      disabled={isSubmitting}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
