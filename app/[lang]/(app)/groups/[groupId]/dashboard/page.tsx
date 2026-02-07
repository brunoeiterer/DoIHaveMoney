'use client';

import { Container, Grid, GridCol, Paper, Title, Text, Group, Button, MultiSelect, Stack, Box } from '@mantine/core';
import { DateInput, DateValue } from '@mantine/dates';
import { Link, usePathname } from '@/i18n/navigation';
import { MdAdd, MdFilterListAlt } from 'react-icons/md';
import Expenses from '@/components/Expenses/Expenses';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';

export default function Dashboard() {
  const pathname = usePathname();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ startDate, setStartDate ] = useState<DateValue>(null);
  const [ endDate, setEndDate ] = useState<DateValue>(null);
  const [ currency, setCurrency ] = useState<string>();

  useEffect(() => {
      async function fetchGroups() {
          setIsLoading(true);

          const supabase = createClient();
          const { data, error } = await supabase.from('groups').select();

          if (!error) {
              // setGroups(data);
          }

          setIsLoading(false);
      }

      fetchGroups();
  }, []);

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
              <DateInput label="Start Date" placeholder="Pick date" value={startDate} />
              <DateInput label="End Date" placeholder="Pick date" value={endDate} />
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
          <Expenses startDate={startDate} endDate={endDate} currency="" />
        </GridCol>
      </Grid>
    </Container>
  );
}