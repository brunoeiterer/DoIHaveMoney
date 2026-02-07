import { createClient } from '@/lib/supabase/server-client';
import { redirect, notFound } from 'next/navigation';

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const param = await params;

  const { data: membership, error } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', param.groupId)
    .eq('user_id', user.id)
    .single();

    console.log(error);
    console.log(membership);

  if (error || !membership) {
    return notFound(); 
  }

  return <>{children}</>;
}