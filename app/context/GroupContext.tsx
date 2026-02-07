'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GroupData } from '@/lib/utils/utils';

const GroupContext = createContext<GroupData | undefined>(undefined);

export function GroupProvider({
    children,
    value
}: {
    children: ReactNode;
    value: GroupData,
}) {
    return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export function useGroup() {
    const context = useContext(GroupContext);
    if (!context) throw new Error('useGroup must be used within a GroupProvider');
    return context;
}