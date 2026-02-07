import { createClient } from '@/lib/supabase/server-client';
import { Container, Title, Text, SimpleGrid, Button, Stack } from '@mantine/core';
import { Link, redirect } from '@/i18n/navigation';
import { MdGroupAdd } from 'react-icons/md';
import { useParams } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import GroupItem from '@/components/GroupItem/GroupItem';

export default async function GroupsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('groups')
    .select('id, name, currency, group_members (*) ')
    .order('created_at', { ascending: false });

  if (!data || data.length === 0) {
    redirect({ href: '/groups/new', locale: await getLocale() });
  }

  if (data?.length === 1) {
    redirect({ href: `/${data[0].id}/dashboard`, locale: await getLocale() });
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>Select a budget</Title>
        <Text c="dimmed">Choose a group to view your expenses or create a new one.</Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {data?.map((group) => (
            <GroupItem key={group.id} name={group.name} currency={group.currency} members={group.group_members.map(member => member.user_id)} role='admin' />
          ))}
          
          {/* A consistent "Add New" card or button */}
          <Button 
            component={Link} 
            href="/groups/new" 
            variant="light" 
            h={120} 
            radius="md"
            leftSection={<MdGroupAdd size={24} />}
          >
            Create New Group
          </Button>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}