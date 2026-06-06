import {
    Badge,
    Center,
    Container,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Group,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext/AuthContext";
import type { GoogleJwt } from "../../lib/types/GoogleJwt";
import { notifications } from "@mantine/notifications";

export function Landing() {
    const { translations } = useLanguage('Login');
    const { signIn } = useAuth();

    return (
        <Container size="sm">
            <Center mih="100vh">
                <Paper
                    p="xl"
                    radius="lg"
                    w="100%"
                    withBorder={false}
                >
                    <Stack align="center" gap="lg">
                        <Badge size="lg" variant="light">
                            {translations['BudgetTracker']}
                        </Badge>

                        <Title order={1} ta="center">
                            Do I Have Money?
                        </Title>

                        <Text ta="center" size="xl">
                            {translations['Slogan']}
                        </Text>

                        <Text c="dimmed" ta="center">
                            {translations['Headline']}
                        </Text>

                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                const profile = jwtDecode<GoogleJwt>(credentialResponse.credential!);
                                signIn(profile.name, profile.email, profile.picture);
                            }}
                            onError={() => {
                                notifications.show({
                                    title: translations['SignInFailedTitle'],
                                    message: translations['SignInFailedMessage']
                                })
                            }}
                            useOneTap
                        />

                        <Stack gap="sm">
                            <Group gap="xs">
                                <ThemeIcon size="sm" variant="light">
                                    <IconCheck size={14} />
                                </ThemeIcon>
                                <Text size="sm">{translations['GoogleSheetsStorage']}</Text>
                            </Group>

                            <Group gap="xs">
                                <ThemeIcon size="sm" variant="light">
                                    <IconCheck size={14} />
                                </ThemeIcon>
                                <Text size="sm">{translations['PrivateByDefault']}</Text>
                            </Group>

                            <Group gap="xs">
                                <ThemeIcon size="sm" variant="light">
                                    <IconCheck size={14} />
                                </ThemeIcon>
                                <Text size="sm">{translations['NoSubscriptions']}</Text>
                            </Group>
                        </Stack>
                    </Stack>
                </Paper>
            </Center>
        </Container>
    );
}