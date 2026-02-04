import { AccordionControl, AccordionItem, AccordionPanel, Badge, Button, Group, Stack, Text } from "@mantine/core";

interface ExpenseItemProps {
    category: string;
    date: string;
    amount: number;
    currency: string;
    description: string;
}

export default function ExpenseItem({ category, date, amount, currency, description }: ExpenseItemProps) {
    return (
        <AccordionItem value={description}>
            <AccordionControl>
                <Group justify="space-between">
                    <Group>
                        <Badge variant="light">{category}</Badge>
                        <Text size="sm" fw={500}>{description}</Text>
                    </Group>
                    <Text fw={700} c="red.6">-{currency}{amount}</Text>
                </Group>
            </AccordionControl>
            <AccordionPanel>
                <Stack gap="xs">
                    <Text size="xs" c="dimmed">Date: {date}</Text>
                    <Text size="sm">{description}</Text>
                    <Button variant="subtle" size="xs" color="gray">Edit Transaction</Button>
                </Stack>
            </AccordionPanel>
        </AccordionItem>
    );
}