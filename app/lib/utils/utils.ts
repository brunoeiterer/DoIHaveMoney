import { createClient } from "../supabase/server-client";

export const getGroupData = async (groupId: string | null = null) => {
    const supabase = await createClient();
    let query = supabase
        .from('groups')
        .select('id, name, currency, group_members (*), categories (*)')
        .order('created_at', { ascending: false });

    if(groupId) {
        query = query.eq('group_id', groupId)
    }

    const { data } = await query;
    
    return data;
};

export const getUser = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return user;
}

export type GroupData = Awaited<ReturnType<typeof getGroupData>>;