import { AccordionItem, AccordionControl, Group, Badge, Text, AccordionPanel, Stack } from "@mantine/core";

interface GroupItemProps {
    name: string;
    currency: string;
    members: string[];
    role: string;
}

export default function GroupItem({ name, currency, members, role }: GroupItemProps) {
    return (
        <AccordionItem value={name}>
            <AccordionControl>
                <Group justify="space-between">
                    <Group>
                        <Badge variant="light">{currency}</Badge>
                    </Group>
                </Group>
            </AccordionControl>
            <AccordionPanel>
                <Stack gap="xs">
                    {members.map((member, index) => 
                    <>
                        <Text key={index} size="xs" c="dimmed">{member}</Text>
                        {/*<Text size="sm">{role}</Text>*/}
                    </>)}
                </Stack>
            </AccordionPanel>
        </AccordionItem>
    );
}