import { Center, Stack, Loader, Text } from "@mantine/core";
import { useLanguage } from "../context/LanguageContext/LanguageContext";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message,
  fullScreen = false,
}: LoadingStateProps) {
  const { translations } = useLanguage("LoadingState");

  message ??= translations["Loading"];

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
