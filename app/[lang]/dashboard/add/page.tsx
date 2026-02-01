'use client';

import { Container, Paper, Title, TextInput, NumberInput, Select, Button, Stack, Group, ActionIcon } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { MdArrowBack, MdSave } from 'react-icons/md';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function AddExpensePage() {
  const t = useTranslations('AddExpense');

  const pathname = usePathname();

  // Centralized form control
  const form = useForm({
    initialValues: {
      description: '',
      amount: 0,
      category: '',
      date: new Date(),
      note: '',
    },
    validate: {
      description: (value) => (value.length < 2 ? t('errorDescription') : null),
      amount: (value) => (value <= 0 ? t('errorAmount') : null),
      category: (value) => (!value ? t('errorCategory') : null),
    },
  });

  return (
    <Container size="sm" py="xl">
      {/* Header with Back Button */}
      <Group mb="lg">
        <ActionIcon 
          component={Link} 
          href={`${pathname}/..`}
          variant="subtle"
          size="lg" 
          radius="md"
        >
          <MdArrowBack size={20} />
        </ActionIcon>
        <Title order={2}>{t('pageTitle')}</Title>
      </Group>

      <Paper withBorder p="xl" radius="md" shadow="sm">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stack gap="md">
            <TextInput
              label={t('labelDescription')}
              placeholder="e.g., Monthly Netflix"
              required
              {...form.getInputProps('description')}
            />

            <Group grow>
              <NumberInput
                label={t('labelAmount')}
                placeholder="0.00"
                decimalScale={2}
                fixedDecimalScale
                prefix="R$ "
                required
                {...form.getInputProps('amount')}
              />

              <DateInput
                label={t('labelDate')}
                placeholder="Pick date"
                required
                {...form.getInputProps('date')}
              />
            </Group>

            <Select
              label={t('labelCategory')}
              placeholder="Select category"
              data={['Food', 'Rent', 'Transport', 'Entertainment', 'Health']}
              required
              {...form.getInputProps('category')}
            />

            <Button 
              type="submit" 
              size="lg" 
              mt="md" 
              leftSection={<MdSave size={18} />}
              fullWidth
            >
              {t('saveButton')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}