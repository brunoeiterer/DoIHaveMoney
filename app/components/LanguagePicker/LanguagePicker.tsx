'use client';

import { Menu, ActionIcon, Text, Group } from '@mantine/core';
import { MdTranslate } from 'react-icons/md';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguagePicker() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('LanguagePicker');

  const handleLanguageChange = (nextLocale: string) => {
    if(nextLocale === locale) {
      return;
    }
    
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Menu shadow="md" width={150} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" size="lg" radius="md" title="Change Language">
          <MdTranslate size={22} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('selectLanguage')}</Menu.Label>
        
        <Menu.Item 
          onClick={() => handleLanguageChange('en')}
          fw={locale === 'en' ? 700 : 400}
          bg={locale === 'en' ? 'var(--mantine-color-indigo-light)' : undefined}
        >
          <Group gap="xs">
            <Text size="sm">🇺🇸</Text>
            <Text size="sm">English</Text>
          </Group>
        </Menu.Item>

        <Menu.Item 
          onClick={() => handleLanguageChange('pt')}
          fw={locale === 'pt' ? 700 : 400}
          bg={locale === 'pt' ? 'var(--mantine-color-indigo-light)' : undefined}
        >
          <Group gap="xs">
            <Text size="sm">🇧🇷</Text>
            <Text size="sm">Português</Text>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}