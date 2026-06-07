import {
    Badge,
    Center,
    Container,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext/AuthContext";
import { notifications } from "@mantine/notifications";
import type { GoogleJwt } from "../lib/types/googleJwt";
import { useNavigate } from "react-router";
import { FeatureItem } from "./FeatureItem";

export function Landing() {
    const { translations } = useLanguage('Login');
    const { signIn } = useAuth();
    const navigate = useNavigate();

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
                                signIn(profile.email, profile.name, profile.picture);
                                navigate('/authorization');
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
                            <FeatureItem>
                                {translations['GoogleSheetsStorage']}
                            </FeatureItem>

                            <FeatureItem>
                                {translations['PrivateByDefault']}
                            </FeatureItem>

                            <FeatureItem>
                                {translations['NoSubscriptions']}
                            </FeatureItem>
                        </Stack>
                    </Stack>
                </Paper>
            </Center>
        </Container>
    );
}