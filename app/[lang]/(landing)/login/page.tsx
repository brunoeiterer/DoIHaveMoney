'use client';

import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Stack,
    Box,
    Alert
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { MdErrorOutline, MdLogin } from 'react-icons/md';
import { createClient } from '@/lib/supabase/browser-client';
import { useState } from 'react';

export default function LoginPage() {
    const t = useTranslations('Login');
    const [error, setError] = useState<string | null>();

    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (email: string, password: string) => {
        const client = createClient();
        const { data, error } = await client.auth.signInWithPassword({
            email: email,
            password: password
        });

        if(data?.user === null) {
            if(error?.code === 'invalid_credentials') {
                setError(t('invalidCredentials'));
            }
            else {
                setError(t('loginFailed'));
            }
        }
        else {
            setError(null);
        }
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center" fw={900}>
                {t('welcomeBack')}
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                {t('doNotHaveAccountYet')}
                <Anchor component={Link} href="/register" size="sm" fw={700}>
                    {t('createAccount')}
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                {error && (
                    <Alert 
                        variant="light" 
                        color="red" 
                        title={t('errorAlertTitle')}
                        icon={<MdErrorOutline size={18} />}
                        withCloseButton
                        onClose={() => setError(null)}
                        mb="lg"
                        radius="md"
                    >
                        {error}
                    </Alert>
                )}

                {/*
                <Group grow mb="md" mt="md">
                    <Button variant="default" radius="md">
                        Google
                    </Button>
                </Group>

                <Divider label="Or continue with email" labelPosition="center" my="lg" />
                */}

                <form onSubmit={form.onSubmit(async (values) => await onSubmit(values.email, values.password))}>
                    <Stack>
                        <TextInput
                            label="Email"
                            placeholder="you@doihavemoney.com"
                            required
                            {...form.getInputProps('email')}
                        />

                        <Box>
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                required
                                {...form.getInputProps('password')}
                            />
                            <Group justify="flex-end" mt={5}>
                                <Anchor component={Link} href="/forgot-password" size="xs" fw={700}>
                                    {t('forgotPassword')}
                                </Anchor>
                            </Group>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            mt="xl"
                            size="md"
                            leftSection={<MdLogin size={18} />}
                        >
                            {t('signIn')}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}