import { useState } from "react";
import {
  Paper,
  Title,
  Table,
  Group,
  ActionIcon,
  Text,
  ScrollArea,
  Badge,
  CloseButton,
} from "@mantine/core";
import { IconTrash, IconLogout } from "@tabler/icons-react";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

interface MembersManagerProps {
  permissions: { role: string; emailAddress: string }[];
  currentUserEmail: string;
  isOwner: boolean;
  onRemoveMember: (permissionId: string) => Promise<void>;
  onClose: () => void;
}

export function MembersManager({
  permissions,
  currentUserEmail,
  isOwner,
  onRemoveMember,
  onClose,
}: MembersManagerProps) {
  const { t } = useLanguage("MembersManager");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemove = async (permissionId: string) => {
    setIsSubmitting(true);
    try {
      await onRemoveMember(permissionId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md" h={"500px"}>
      <Group justify="space-between" mb="md">
        <Title order={4}>{t("Members")}</Title>
        <CloseButton mb="sm" onClick={() => onClose()} />
      </Group>

      <ScrollArea h={300}>
        <Table horizontalSpacing="sm" verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("User")}</Table.Th>
              <Table.Th>{t("Role")}</Table.Th>
              <Table.Th aria-label="actions" />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {permissions.map((member) => {
              const isMe = member.emailAddress === currentUserEmail;
              const isMemberOwner = member.role === "owner";

              const canRemove =
                (!isMemberOwner && isOwner) || (isMe && !isMemberOwner);

              return (
                <Table.Tr key={member.emailAddress}>
                  <Table.Td>
                    <Group gap="sm">
                      <Text size="sm" fw={isMe ? 600 : 400}>
                        {member.emailAddress}
                      </Text>
                      {isMe && (
                        <Badge size="xs" mt={2} variant="light" color="blue">
                          {t("You")}
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      color={isMemberOwner ? "violet" : "gray"}
                      variant={isMemberOwner ? "filled" : "light"}
                    >
                      {t(member.role)}
                    </Badge>
                  </Table.Td>

                  <Table.Td style={{ textAlign: "right" }}>
                    {canRemove && (
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => handleRemove(member.emailAddress)}
                        disabled={isSubmitting}
                        title={isMe ? t("LeaveBudget") : t("RemoveMember")}
                      >
                        {isMe ? (
                          <IconLogout size={16} />
                        ) : (
                          <IconTrash size={16} />
                        )}
                      </ActionIcon>
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
