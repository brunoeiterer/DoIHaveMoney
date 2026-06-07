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
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import type { Category } from "../../lib/types/category";

interface CategoriesManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
}

export function CategoriesManager({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoriesManagerProps) {
  const { t } = useLanguage("CategoriesManager");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    const isDuplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddCategory(trimmedName);
    } finally {
      setIsSubmitting(false);
    }

    setName("");
  };

  const handleDelete = async (id: number) => {
    setIsSubmitting(true);
    try {
      console.log("deleting");
      await onDeleteCategory(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md" h={"500px"}>
      <Group justify="space-between" mb="md">
        <Title order={4} mb="md">
          {t("Categories")}
        </Title>
      </Group>

      <form onSubmit={handleSubmit}>
        <Group align="flex-end" mb="xl" gap="xs">
          <TextInput
            placeholder={t("NewCategoryPlaceholder")}
            label={t("CategoryName")}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
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

      <Box pos="relative">
        <div
          style={{
            height: "300px",
            overflow: "auto",
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
                        onClick={() => handleDelete(category.id)}
                        aria-label={`Delete ${category.name}`}
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
        </div>

        {categories.length > 2 && (
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
