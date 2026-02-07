'use client';

import { useState } from 'react';
import { 
  TextInput, 
  Select, 
  Button, 
  Paper, 
  Title, 
  Text, 
  Container, 
  Stack 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from '@/lib/supabase/browser-client';
import { useRouter } from '@/i18n/navigation';
import { MdGroupAdd, MdAttachMoney } from 'react-icons/md';

import { Database } from '@/lib/supabase/database.types';

export default function CreateGroupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm({
    initialValues: {
      name: '',
      currency: 'USD',
    }
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('groups')
      .insert({
        name: values.name,
        currency: values.currency,
      } as Database['public']['Tables']['groups']['Insert']);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    //router.push(`/${data.id}/dashboard`);
  };

  return (
    <Container size="xs" py={60}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack gap="xs" mb="xl" ta="center">
          <Title order={2}>Create a new group</Title>
          <Text c="dimmed" size="sm">
            Groups allow you to share expenses with partners or track different budgets.
          </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Group Name"
              placeholder="e.g. Home, Vacation 2026, Business"
              required
              {...form.getInputProps('name')}
            />

            <Select
              label="Default Currency"
              placeholder="Pick one"
              data={[
                { value: 'USD', label: 'USD - US Dollar ($)' },
                { value: 'BRL', label: 'BRL - Brazilian Real (R$)' },
                { value: 'EUR', label: 'EUR - Euro (€)' },
                { value: 'GBP', label: 'GBP - British Pound (£)' },
              ]}
              leftSection={<MdAttachMoney />}
              {...form.getInputProps('currency')}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={loading}
              leftSection={<MdGroupAdd size={18} />}
            >
              Create Group
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}