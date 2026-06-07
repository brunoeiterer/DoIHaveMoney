import { Center, Stack, Loader, Text } from "@mantine/core";

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export function LoadingState({
    message = "Loading...",
    fullScreen = false
}: LoadingStateProps) {
    return (
        <Center mih={fullScreen ? "100vh" : "100%"} p="xl">
            <Stack align="center" gap="md">
                <Loader size="lg" type="dots" />

                {message && (
                    <Text c="dimmed" size="sm" ta="center">
                        {message}
                    </Text>
                )}
            </Stack>
        </Center>
    );
}