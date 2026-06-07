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
  const { t } = useLanguage("LoadingState");

  return (
    <Center mih={fullScreen ? "100vh" : "100%"} p="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" type="dots" />
        <Text c="dimmed" size="sm" ta="center">
          {message ?? t("Loading")}
        </Text>
      </Stack>
    </Center>
  );
}
