import { Group, ThemeIcon, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <Group align="center" wrap="nowrap">
      <ThemeIcon
        variant="light"
        color="green"
        size="sm"
        style={{ flexShrink: 0 }}
      >
        <IconCheck size={14} />
      </ThemeIcon>

      <Text>{children}</Text>
    </Group>
  );
}
