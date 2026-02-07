'use client';

import { 
  AccordionItem, 
  AccordionControl, 
  Group, 
  Badge, 
  Text, 
  AccordionPanel, 
  Stack, 
  Button
} from "@mantine/core";
import { Link } from "@/i18n/navigation";
import { MdOpenInNew, MdPerson } from "react-icons/md";
import { useTranslations } from "next-intl";

interface GroupItemProps {
    id: string;
    name: string;
    currency: string;
    members: string[];
    role: string;
}

export default function GroupItem({ id, name, currency, members, role }: GroupItemProps) {
    const t = useTranslations('Groups.GroupItem');

    return (
        <AccordionItem value={id}>
            <AccordionControl>
                <Group justify="space-between" wrap="nowrap" pr="md">
                    <Group gap="sm">
                        <Text
                            fw={500}
                            size='md'
                            style={{ lineHeight: 1 }}
                        >
                            {name}
                        </Text>
                        <Badge
                            variant="dot"
                            size="sm"
                            styles={{ 
                                root: {
                                    marginTop: '0.275rem'
                                }
                            }}
                            >
                                {currency}
                            </Badge>
                    </Group>
                    
                    {role === 'admin' && <Badge
                        color='blue'
                        variant="light"
                        size="sm"
                        styles={{ 
                                root: {
                                    marginTop: '0.275rem'
                                }
                            }}
                        >
                            {role}
                    </Badge>
                    }
                </Group>
            </AccordionControl>
            
            <AccordionPanel>
                <Stack gap="md">
                    <Stack gap={4}>
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase">{t('members').toUpperCase()}</Text>
                        {members.map((member) => (
                            <Group key={member} gap="xs">
                                <MdPerson size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                <Text size="xs">{member}</Text>
                            </Group>
                        ))}
                    </Stack>

                    <Button 
                        component={Link} 
                        href={`/groups/${id}/dashboard`}
                        fullWidth 
                        variant="light"
                        leftSection={<MdOpenInNew size={16} />}
                    >
                        {t('accessDashboard')}
                    </Button>
                </Stack>
            </AccordionPanel>
        </AccordionItem>
    );
}