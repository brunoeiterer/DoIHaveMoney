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
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { FeatureItem } from "./FeatureItem";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import { LoadingState } from "./LoadingState";
import { notifications } from "@mantine/notifications";
import { setAuthSession } from "../context/AuthContext/AuthGlobal";

export function Authorization() {
  const { t } = useLanguage("Authorization");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/drive.file",
    hint: user?.email,
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch("/api/auth-exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: codeResponse.code,
            userProfile: user,
          }),
        });

        const data = await response.json();
        setAuthSession(data.accessToken, data.userProfile);

        navigate("/budgets");
      } catch {
        notifications.show({
          title: t("ErrorTitle"),
          message: t("ErrorMessage"),
          color: "red",
        });
      }
    },
    onError: () => {
      notifications.show({
        title: t("ErrorTitle"),
        message: t("ErrorMessage"),
        color: "red",
      });
      setIsLoading(false);
    },
    onNonOAuthError: () => {
      notifications.show({
        title: t("ErrorTitle"),
        message: t("ErrorMessage"),
        color: "red",
      });
      setIsLoading(false);
    },
  });

  const handleConnectClick = () => {
    setIsLoading(true);
    googleLogin();
  };

  return isLoading ? (
    <LoadingState />
  ) : (
    <Center mih="calc(100vh - 60px)">
      <Paper p="xl" radius="lg" w="100%">
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius="xl" variant="light">
            <IconBrandGoogleDrive size={40} />
          </ThemeIcon>

          <Badge variant="light">{t("Setup")}</Badge>

          <Title order={2} ta="center">
            {t("ConnectGoogleDriveAndSheets")}
          </Title>

          <Text ta="center" c="dimmed">
            {t("ConnectionRequirementExplanation")}
          </Text>

          <FeatureItem>{t("StorageLine")}</FeatureItem>

          <Button
            size="lg"
            leftSection={<IconBrandGoogleDrive size={18} />}
            onClick={handleConnectClick}
          >
            {t("ButtonText")}
          </Button>

          <Text size="xs" c="dimmed" ta="center">
            {t("RevokeAccessNotice")}
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}
