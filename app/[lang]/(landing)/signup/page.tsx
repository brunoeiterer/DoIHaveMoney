'use client';

import { TextInput, PasswordInput, Anchor, Paper, Title, Text, Container, Group, Button, Stack, Box, Alert} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { MdErrorOutline, MdLogin } from 'react-icons/md';
import { createClient } from '@/lib/supabase/browser-client';
import { useState } from 'react';
import PasswordCriteria from '@/components/PasswordCriteria/PasswordCriteria';

export default function SignupPage() {
    const t = useTranslations('Signup');
    const [error, setError] = useState<string | null>();
    const [areAllCriteriaMet, setAreAllCriteriaMet] = useState<boolean>(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (email: string, password: string) => {
        setIsSubmitting(true);
        const client = createClient();
        const { data } = await client.auth.signUp({
            email: email,
            password: password
        });

        if(data?.user === null) {
            setError(t('signupFailed'));
        }
        else {
            setError(null);
            router.push(`${pathname}/../login`);
        }

        setIsSubmitting(false);
    }

    return (
        <Container size={420} my={40}>
            <Title ta="center" fw={900}>
                {t('welcome')}
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                {t('alreadyHaveAccount')}
                <Anchor component={Link} href={`${pathname}/../login`} size="sm" fw={700}>
                    {t('login')}
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
                            label={t('email')}
                            placeholder="you@doihavemoney.com"
                            required
                            {...form.getInputProps('email')}
                        />

                        <Box>
                            <PasswordInput
                                label={t('password')}
                                placeholder={t('yourPassword')}
                                required
                                {...form.getInputProps('password')}
                                mb='sm'
                            />

                            <PasswordCriteria
                                setAreAllCriteriaMet={setAreAllCriteriaMet}
                                password={form.getInputProps('password').value}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            mt="sm"
                            size="md"
                            disabled={!areAllCriteriaMet || form.getInputProps('email').value === ''}
                            leftSection={<MdLogin size={18} />}
                            loading={isSubmitting}
                        >
                            {t('signup')}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}