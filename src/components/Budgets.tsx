import {
    Badge,
    Button,
    Center,
    Container,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { CreateNewBudget } from "./CreateNewBudget";
import { useBudgets } from "../hooks/useBudgets";
import { useCreateBudget } from "../hooks/useCreateBudget";
import { LoadingState } from "./LoadingState";
import { IconPlus } from "@tabler/icons-react";

export function Budgets() {
    const { translations } = useLanguage('Budgets');
    const navigate = useNavigate();

    const { budgets, isLoading, error, folderId } = useBudgets();
    const createBudget = useCreateBudget(folderId);
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateNewBudgetClose = () => {
        setIsCreating(false);
    };

    const handleCreateBudget = async (name: string) => {
        await createBudget.mutateAsync(name);
    }

    useEffect(() => {
        if (error) {
            notifications.show({
                title: translations['SyncErrorTitle'],
                message: translations['SyncErrorMessage'],
                color: 'red'
            });
        }
    }, [error, translations]);

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
                            {translations['Budgets']}
                        </Badge>

                        <Title order={1} ta="center">
                            {translations['YourBudgets']}
                        </Title>

                        <Text c="dimmed" ta="center">
                            {translations['SelectOrCreate']}
                        </Text>

                        {isLoading ? (
                            <LoadingState />
                        ) : (
                            <Stack w="100%" gap="sm" mt="md">
                                {budgets.length === 0 ? (
                                    <Text ta="center" fs="italic" c="dimmed" py="xl">
                                        {translations['NoBudgetsFound']}
                                    </Text>
                                ) : (
                                    budgets.map((budget) => (
                                        <Button
                                            key={budget.id}
                                            variant="default"
                                            size="xl"
                                            fullWidth
                                            onClick={() => navigate(`/budget/${budget.id}`)}
                                        >
                                            {budget.name}
                                        </Button>
                                    ))
                                )}

                                {isCreating ?
                                    <CreateNewBudget budgets={budgets} onClose={handleCreateNewBudgetClose} handleCreateBudget={handleCreateBudget} /> :
                                    <Button
                                        size="lg"
                                        mt="md"
                                        fullWidth
                                        variant="filled"
                                        leftSection={<IconPlus />}
                                        onClick={() => setIsCreating(true)}
                                    >
                                        {translations['CreateNewBudget']}
                                    </Button>
                                }
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </Center>
        </Container>
    );
}