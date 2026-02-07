'use client';

import { useState } from 'react';
import { TextInput, Select, Button, Paper, Title, Text, Container, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from '@/lib/supabase/browser-client';
import { useRouter } from '@/i18n/navigation';
import { MdGroupAdd, MdAttachMoney } from 'react-icons/md';

import { Database } from '@/lib/supabase/database.types';
import { useTranslations } from 'next-intl';

export default function CreateGroupPage() {
    const currencies = useTranslations().raw('Currencies');
    const t = useTranslations('Groups.New');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm({
        initialValues: {
            name: '',
            currency: '',
        }
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);

        const { data, error } = await supabase
            .from('groups')
            .insert({
                name: values.name,
                currency: values.currency,
            } as Database['public']['Tables']['groups']['Insert'])
            .select('id')
            .single();

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        router.push(`/${data.id}/dashboard`);
    };

    return (
        <Container size="xs" py={60}>
            <Paper withBorder shadow="md" p={30} radius="md">
                <Stack gap="xs" mb="xl" ta="center">
                    <Title order={2}>{t('createANewGroup')}</Title>
                    <Text c="dimmed" size="sm">
                        {t('description')}
                    </Text>
                </Stack>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label={t('groupName')}
                            placeholder={t('groupNameExample')}
                            required
                            {...form.getInputProps('name')}
                        />

                        <Select
                            label={t('currency')}
                            placeholder={t('pickOne')}
                            data={Object.keys(currencies).map(key => ({ value: key, label: currencies[key] }))}
                            leftSection={<MdAttachMoney />}
                            searchable
                            required
                            {...form.getInputProps('currency')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            mt="xl"
                            loading={loading}
                            leftSection={<MdGroupAdd size={18} />}
                        >
                            {t('createGroup')}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}