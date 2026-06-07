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
import { LoadingState } from "./LoadingState";

export function Landing() {
  const { t } = useLanguage("Login");
  const { signIn, isAuthenticating, accessToken } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticating) {
    return <LoadingState fullScreen />;
  }

  if (accessToken) {
    navigate("/budgets", { replace: true });
  }

  return (
    <Container size="sm">
      <Center mih="100vh">
        <Paper p="xl" radius="lg" w="100%" withBorder={false}>
          <Stack align="center" gap="lg">
            <Badge size="lg" variant="light">
              {t("BudgetTracker")}
            </Badge>

            <Title order={1} ta="center">
              Do I Have Money?
            </Title>

            <Text ta="center" size="xl">
              {t("Slogan")}
            </Text>

            <Text c="dimmed" ta="center">
              {t("Headline")}
            </Text>

            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const profile = jwtDecode<GoogleJwt>(
                  credentialResponse.credential!,
                );
                signIn(profile.email, profile.name, profile.picture);
                navigate("/authorization");
              }}
              onError={() => {
                notifications.show({
                  title: t("SignInFailedTitle"),
                  message: t("SignInFailedMessage"),
                });
              }}
              useOneTap
            />

            <Stack gap="sm">
              <FeatureItem>{t("GoogleSheetsStorage")}</FeatureItem>

              <FeatureItem>{t("PrivateByDefault")}</FeatureItem>

              <FeatureItem>{t("NoSubscriptions")}</FeatureItem>
            </Stack>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
