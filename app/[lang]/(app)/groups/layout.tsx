import "@mantine/core/styles.css";
import React from "react";
import {
    MantineProvider,
    ColorSchemeScript,
    mantineHtmlProps,
} from "@mantine/core";
import { theme } from "../../../../theme";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "@/components/Header/Header";
import { GroupProvider } from "@/context/GroupContext";
import { getGroupData } from "@/lib/utils/utils";

export const metadata = {
    title: "Mantine Next.js template",
    description: "I am using Mantine with Next.js!",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const groupData = await getGroupData();

    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <NextIntlClientProvider>
                        <GroupProvider value={groupData}>
                            <Header variant="loggedIn" currentGroup="TestGroup" />
                            {children}
                        </GroupProvider>
                    </NextIntlClientProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
