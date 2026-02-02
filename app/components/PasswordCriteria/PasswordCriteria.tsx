'use client';

import { List, ListItem, ThemeIcon, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { MdCircle } from 'react-icons/md';

interface PasswordCriteriaProps {
    password: string;
    setAreAllCriteriaMet: (areAllCriteriaMet: boolean) => void;
}

export default function PasswordCriteria({ password, setAreAllCriteriaMet }: PasswordCriteriaProps) {
    const t = useTranslations('PasswordCriteria');

    const labels = {
        length: t('passwordLengthCriteria'),
        lowercase: t('passwordLowerCaseCriteria'),
        uppercase: t('passwordUpperCaseCriteria'),
        digit: t('passwordNumberCriteria'),
        symbol: t('passwordSymbolCriteria'),
    };

    const passwordCriteria = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        digit: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };

    useEffect(() => setAreAllCriteriaMet(Object.values(passwordCriteria).every(criteria => criteria)), [password]);
    
    return (
        <List p={0}>
            {Object.keys(labels).map((criteria, index) => {
                const color = passwordCriteria[criteria as keyof typeof passwordCriteria] ? 'lime.6' : 'red.6';
                const icon = 
                    <ThemeIcon c={color} variant='light' size={10}>
                        <MdCircle />
                    </ThemeIcon>;

                return (
                    <ListItem icon={icon} key={index}>
                        <Text size="sm">
                            {labels[criteria as keyof typeof labels]}
                        </Text>
                    </ListItem>
                )}
            )}
        </List>
    );
}