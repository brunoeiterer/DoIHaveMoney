import {
    Badge,
    Button,
    Center,
    Container,
    Loader,
    Paper,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useLanguage } from "../context/LanguageContext/LanguageContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useNavigate } from "react-router";
import { useBudgets } from "../hooks/useBudgets";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

export function Budgets() {
    const { translations } = useLanguage('Budgets'); 
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    
    const { budgets, isLoading, error, folderId } = useBudgets(accessToken);

    useEffect(() => {
        if (error) {
            notifications.show({
                title: translations['SyncErrorTitle'] || 'Sync Error',
                message: translations['SyncErrorMessage'] || error,
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
                            {translations['Dashboard'] || 'Dashboard'}
                        </Badge>

                        <Title order={1} ta="center">
                            {translations['YourBudgets'] || 'Your Budgets'}
                        </Title>

                        <Text c="dimmed" ta="center">
                            {translations['SelectOrCreate'] || 'Select an existing budget or create a new one to get started.'}
                        </Text>

                        {isLoading ? (
                            <Loader size="lg" mt="xl" type="dots" />
                        ) : (
                            <Stack w="100%" gap="sm" mt="md">
                                {budgets.length === 0 ? (
                                    <Text ta="center" fs="italic" c="dimmed" py="xl">
                                        {translations['NoBudgetsFound'] || 'No budgets found in your Drive.'}
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

                                <Button 
                                    size="lg" 
                                    mt="md" 
                                    fullWidth
                                    variant="filled"
                                    // You now have the folderId ready to be passed to your creation logic!
                                    onClick={() => console.log("Ready to create in folder:", folderId)}
                                >
                                    {translations['CreateNewBudget'] || '+ Create New Budget'}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </Center>
        </Container>
    );
}