import { Accordion, Skeleton, Stack, Title } from "@mantine/core"
import ExpenseItem from "../ExpenseItem/ExpenseItem"
import { useTranslations } from "use-intl"
import { createClient } from "@/lib/supabase/browser-client";
import { useEffect, useState } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { DateValue } from "@mantine/dates";
import { useParams } from "next/navigation";

interface ExpensesProps {
    startDate: DateValue;
    endDate: DateValue;
    currency: string;
}

function LoadingSkeleton() {
  return (
    <Stack>
      {[1, 2, 3].map((i) => <Skeleton key={i} h={60} radius="md" />)}
    </Stack>
  );
}

export default function Expenses({ startDate, endDate, currency }: ExpensesProps) {
    const t = useTranslations('Expenses');

    const [expenses, setExpenses] = useState<Tables<'expenses'>[]>([]);
    const [loading, setLoading] = useState(true);

    const params = useParams<{ groupId: string}>();
    const currentGroupId = params.groupId;

    useEffect(() => {
        async function fetchExpenses() {
            setLoading(true);

            const supabase = await createClient();

            let query = supabase
                .from('expenses')
                .select('*')
                .eq('group_id', currentGroupId)
                .order('date', { ascending: false });

            if (startDate) {
                query = query.gte('date', startDate);
            }
            if (endDate) {
                query = query.lte('date', endDate);
            }

            const { data, error } = await query;

            if (!error) {
                setExpenses(data);
            }

            setLoading(false);
        }

        fetchExpenses();
    }, [currentGroupId, startDate, endDate]);

    if (loading) return <LoadingSkeleton />;

    return (
        <>
            <Title order={4} mt="lg">{t('Transactions')}</Title>
            <Accordion variant="separated">
                {expenses.map((expense, index) => 
                    <ExpenseItem
                        key={index}
                        date={expense.date}
                        amount={expense.amount}
                        currency={currency}
                        description={expense.description}
                        category={expense.category_id}
                        />
                )}
            </Accordion>
        </>
    )
}