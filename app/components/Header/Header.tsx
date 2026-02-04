'use client';

import { Group, Button, Text, Menu, Avatar, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { MdLogout, MdSettings, MdDarkMode, MdLightMode } from 'react-icons/md';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import LanguagePicker from '../LanguagePicker/LanguagePicker';

interface HeaderProps {
  variant: 'loggedIn' | 'loggedOut';
  currentGroup?: string;
}

export function Header({ variant, currentGroup }: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const t = useTranslations('Header');

  const onLogout = async () => {
    const client = createClient();
    await client.auth.signOut();
  };

  return (
    <Group justify="space-between" h="100%" m="lg" px="md">
      <Group>
        <Text fw={900} size="xl" c="indigo.6" component={Link} href="/">
          {t('appName')}
        </Text>
        
        {variant === 'loggedIn' && currentGroup && (
          <>
            <Text c="dimmed" fw={300}>/</Text>
            <Text size="sm" fw={600}>{currentGroup}</Text>
          </>
        )}
      </Group>

      <Group>
        {variant === 'loggedIn' ? (
          <>
            <ActionIcon onClick={() => toggleColorScheme()} variant="subtle" color="gray">
              {colorScheme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar color="indigo" radius="xl" style={{ cursor: 'pointer' }}>JD</Avatar>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{t('userSettings')}</Menu.Label>
                <Menu.Item leftSection={<MdSettings />}>{t('settings')}</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<MdLogout />} onClick={onLogout}>
                  {t('logout')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        ) : (
          <>
            <LanguagePicker />
            <Button variant="subtle" component={Link} href="/login">{t('login')}</Button>
            <Button component={Link} href="/register">{t('getStarted')}</Button>
          </>
        )}
      </Group>
    </Group>
  );
}