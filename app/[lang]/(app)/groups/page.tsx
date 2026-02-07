import { Container, Title, Group, Stack } from '@mantine/core';
import GroupsPanel from './GroupsPanel/GroupsPanel';
import { getTranslations } from 'next-intl/server';
import CreateGroupButton from './CreateGroupButton/CreateGroupButton';

export default async function GroupsPage() {
  const t = await getTranslations('Groups');

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify='space-between'>
          <Title order={1}>{t('groups')}</Title>
          <CreateGroupButton />
        </Group>
        <GroupsPanel />
      </Stack>
    </Container>
  );
}