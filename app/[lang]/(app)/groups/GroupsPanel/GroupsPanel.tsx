'use client';

import { Accordion } from '@mantine/core';
import GroupItem from '@/components/GroupItem/GroupItem';
import { useGroup } from '@/context/GroupContext';

export default function GroupsPanel() {
    const groupData = useGroup();

    return (
        <Accordion>
            {groupData.map((group) => (
                <GroupItem
                    id={group.id}
                    key={group.id}
                    name={group.name}
                    currency={group.currency}
                    members={group.group_members.map(member => member.user_id)}
                    role='admin'
                />
            ))}
        </Accordion>
    )
}