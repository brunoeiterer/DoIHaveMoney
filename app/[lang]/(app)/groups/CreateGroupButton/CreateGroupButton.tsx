'use client';

import { Button } from '@mantine/core';
import { Link } from '@/i18n/navigation';
import { MdGroupAdd } from 'react-icons/md';
import { useTranslations } from 'next-intl';

export default function CreateGroupButton() {
    const t = useTranslations('Groups.CreateGroupButton');

    return (
        <Button
              component={Link}
              href="/groups/new"
              variant="light"
              radius="md"
              leftSection={<MdGroupAdd size={16} />}
          >
              {t('createGroup')}
        </Button>
    )
}