import { useState } from "react";
import {
  Paper,
  Title,
  Table,
  Group,
  TextInput,
  ActionIcon,
  Text,
  Box,
} from "@mantine/core";
import {
  IconTrash,
  IconPlus,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { Category } from "../../lib/types/category";

interface CategoriesManagerProps {
  categories: Category[];
  onAddCategory: (category: { name: string }) => void;
  onDeleteCategory: (id: number) => void;
}

export function CategoriesManager({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoriesManagerProps) {
  const { t } = useLanguage("CategoriesManager");
  const [name, setName] = useState("");
  const [opened, setOpened] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicate) {
      return;
    }

    onAddCategory({ name: trimmedName });
    setName("");
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="md">
        <Title order={4} mb="md">
          {t("Categories")}
        </Title>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => setOpened((o) => !o)}
          aria-label="Toggle expenses table"
        >
          {opened ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
        </ActionIcon>
      </Group>

      <form onSubmit={handleSubmit}>
        <Group align="flex-end" mb="xl" gap="xs">
          <TextInput
            placeholder={t("NewCategoryPlaceholder", {
              fallback: "e.g., Groceries",
            })}
            label={t("CategoryName")}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            style={{ flex: 1 }}
            required
          />
          <ActionIcon type="submit" size="lg" color="emerald" variant="filled">
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
      </form>

      <Box pos="relative">
        <div
          style={{
            maxHeight: opened ? "2000px" : "180px",
            overflow: "hidden",
          }}
        >
          <Table horizontalSpacing="sm" verticalSpacing="xs">
            <Table.Tbody>
              {categories.length === 0 ? (
                <Table.Tr>
                  <Table.Td style={{ textAlign: "center" }}>
                    <Text c="dimmed" py="md">
                      {t("NoCategoriesYet")}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                categories.map((category) => (
                  <Table.Tr key={category.id}>
                    <Table.Td fw={500}>{category.name}</Table.Td>
                    <Table.Td style={{ textAlign: "right", width: "50px" }}>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteCategory(category.id)}
                        aria-label={`Delete ${category.name}`}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>

        {!opened && categories.length > 2 && (
          <Box
            pos="absolute"
            bottom={0}
            left={0}
            right={0}
            h={80}
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--mantine-color-paper, var(--mantine-color-body)))",
              pointerEvents: "none",
            }}
          />
        )}
      </Box>
    </Paper>
  );
}
