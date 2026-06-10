import { Avatar, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { useNavigate } from "react-router";

export function TopBar() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage("TopBar");
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <Group justify="space-between" px="md" py="sm" bg="emerald.5">
      <Text fw={700}>Do I Have Money?</Text>

      <Menu shadow="md" width={250}>
        <Menu.Target>
          <UnstyledButton>
            <Avatar src={user?.pictureLink} alt={user?.name} radius="xl" />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{t("Account")}</Menu.Label>

          <Menu.Item disabled>
            <Text size="sm">{user?.name}</Text>
            <Text size="xs" c="dimmed">
              {user?.email}
            </Text>
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconLogout size={14} />}
            onClick={handleSignOut}
          >
            {t("SignOut")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
