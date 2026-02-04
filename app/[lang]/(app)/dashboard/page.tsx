'use client';

import { Container, Grid, GridCol, Paper, Title, Text, Group, Button, MultiSelect, Stack, Accordion, Box } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Link, usePathname } from '@/i18n/navigation';
import { MdAdd, MdFilterListAlt } from 'react-icons/md';
import ExpenseItem from '@/components/ExpenseItem/ExpenseItem';

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Stack gap={0}>
          <Title order={2}>Financial Overview</Title>
          <Text c="dimmed">Welcome back, here is your spending summary.</Text>
        </Stack>
        <Button
          component={Link}
          href={`${pathname}/add`}
          leftSection={<MdAdd size={18} />}
          radius="md"
        >
          Add Expense
        </Button>
      </Group>

      <Grid gutter="md">
        {/* 2. Filters Sidebar (or Top Bar) */}
        <GridCol span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md" h='100%'>
            <Group mb="md">
              <MdFilterListAlt size={18} />
              <Text fw={700}>Filters</Text>
            </Group>
            <Stack gap="sm">
              <DateInput label="Start Date" placeholder="Pick date" />
              <DateInput label="End Date" placeholder="Pick date" />
              <MultiSelect
                label="Categories"
                placeholder="All Categories"
                data={['Food', 'Rent', 'Transport', 'Entertainment']}
              />
            </Stack>
          </Paper>
        </GridCol>

        {/* 3. Main Content: Chart & List */}
        <GridCol span={{ base: 12, md: 8 }} h='100%'>
          <Stack gap="md">
            {/* Chart Placeholder */}
            <Paper withBorder p="xl" radius="md" h={300}>
              <Text fw={700} mb="xl">Expense Distribution</Text>
              <Box ta="center" pt="xl" c="dimmed">
                {/* We will implement the Pie Chart here next */}
                [Pie Chart Placeholder]
              </Box>
            </Paper>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 12 }} h='100%'>
          <Title order={4} mt="lg">Transactions</Title>
          <Accordion variant="separated">
            <ExpenseItem
              category="Food"
              date="2026-02-01"
              amount={150.00}
              currency="R$"
              description="Weekly grocery shopping at Carrefour"
            />
            <ExpenseItem
              category="Entertainment"
              date="2026-01-28"
              amount={80.00}
              currency="R$"
              description="Movie tickets and popcorn"
            />
            <ExpenseItem
              category="Entertainment"
              date="2026-01-28"
              amount={80.00}
              currency="R$"
              description="Movie tickets and popcorn"
            />
            <ExpenseItem
              category="Entertainment"
              date="2026-01-28"
              amount={80.00}
              currency="R$"
              description="Movie tickets and popcorn"
            />
          </Accordion>
        </GridCol>
      </Grid>
    </Container>
  );
}