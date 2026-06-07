import {
    Badge,
    Button,
    Center,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import {
    IconBrandGoogleDrive,
} from "@tabler/icons-react";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { FeatureItem } from "./FeatureItem";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import { LoadingState } from "./LoadingState";
import { notifications } from "@mantine/notifications";

export function Authorization() {
    const { translations } = useLanguage('Authorization');
    const { email, name, pictureLink, setAccessToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        scope: 'https://www.googleapis.com/auth/drive.file',
        hint: email,
        onSuccess: async (codeResponse) => {
            try {
                const response = await fetch('/api/auth-exchange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: codeResponse.code,
                        userProfile: {
                            email,
                            name,
                            pictureLink
                        }
                    })
                });

                const data = await response.json();
                setAccessToken(data.accessToken);

                navigate('/budgets');
            }
            catch {
                notifications.show({
                    title: translations['ErrorTitle'],
                    message: translations['ErrorMessage'],
                    color: 'red'
                });
            }
        },
        onError: () => {
            notifications.show({
                title: translations['ErrorTitle'],
                message: translations['ErrorMessage'],
                color: 'red'
            });
            setIsLoading(false);
        },
        onNonOAuthError: () => {
            notifications.show({
                title: translations['ErrorTitle'],
                message: translations['ErrorMessage'],
                color: 'red'
            });
            setIsLoading(false);
        }

    });

    const handleConnectClick = () => {
        setIsLoading(true);
        googleLogin();
    }

    return (
        isLoading ? 
        <LoadingState /> :
        
        <Center mih="calc(100vh - 60px)">
            <Paper
                p="xl"
                radius="lg"
                w="100%"
            >
                <Stack align="center" gap="lg">
                    <ThemeIcon
                        size={80}
                        radius="xl"
                        variant="light"
                    >
                        <IconBrandGoogleDrive size={40} />
                    </ThemeIcon>

                    <Badge variant="light">
                        {translations['Setup']}
                    </Badge>

                    <Title order={2} ta="center">
                        {translations['ConnectGoogleDriveAndSheets']}
                    </Title>

                    <Text ta="center" c="dimmed">
                        {translations['ConnectionRequirementExplanation']}
                    </Text>

                    <FeatureItem>
                        {translations['StorageLine']}
                    </FeatureItem>

                    <Button
                        size="lg"
                        leftSection={
                            <IconBrandGoogleDrive size={18} />
                        }
                        onClick={handleConnectClick}
                    >
                        {translations['ButtonText']}
                    </Button>

                    <Text size="xs" c="dimmed" ta="center">
                        {translations['RevokeAccessNotice']}
                    </Text>
                </Stack>
            </Paper>
        </Center>
    );
}