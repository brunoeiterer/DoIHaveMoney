import {
  Avatar,
  Group,
  Menu,
  Select,
  Text,
  UnstyledButton,
  Image,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { useNavigate } from "react-router";
import brazil from "../assets/brazil.svg";
import unitedStates from "../assets/united-states.svg";

function getCountryFlag(country: string) {
  switch (country) {
    case "pt-BR":
      return <Image w={16} src={brazil} />;
    case "en-US":
      return <Image w={16} src={unitedStates} />;
    default:
      return null;
  }
}

export function TopBar() {
  const { user, signOut } = useAuth();
  const { t, language, changeLanguage } = useLanguage("TopBar");
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

          <Menu.Item closeMenuOnClick={false}>
            <Select
              data={["en-US", "pt-BR"]}
              value={language}
              onChange={(value) => changeLanguage(value!)}
              leftSection={getCountryFlag(language)}
              renderOption={({ option }) => {
                return (
                  <Group gap="sm">
                    {getCountryFlag(option.label)}
                    <Text size="sm">{option.value}</Text>
                  </Group>
                );
              }}
            />
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
