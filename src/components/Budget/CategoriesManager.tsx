import { useState } from "react";
import {
  Paper,
  Title,
  Table,
  Group,
  TextInput,
  ActionIcon,
  Text,
} from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

interface CategoriesManagerProps {
  categories: any[];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent adding empty or duplicate categories
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicate) {
      // Optional: You could set an error state here instead of just returning
      return;
    }

    onAddCategory({ name: trimmedName });
    setName("");
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={4} mb="md">
        {t("Categories")}
      </Title>

      {/* Quick Add Form Row */}
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
          <ActionIcon type="submit" size="xl" color="blue" variant="filled">
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
      </form>

      {/* Categories List (Headerless Table) */}
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
    </Paper>
  );
}
