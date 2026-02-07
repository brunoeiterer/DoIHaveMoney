'use client';

import { createContext, useContext, ReactNode } from 'react';

interface GroupContextType {
  currency: string;
  groupName: string;
  groupId: string;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ 
  children, 
  value 
}: { 
  children: ReactNode; 
  value: GroupContextType 
}) {
  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroup must be used within a GroupProvider');
  return context;
}