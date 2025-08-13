// src/app/[locale]/layout.tsx

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { Providers } from "@/providers/HeroProviders";
import StoreProvider from "@/providers/StoreProvider";
import StockManagementLayout from "@/components/layout/StockManagementLayout";

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    return (
        <NextIntlClientProvider>
            <StoreProvider>
                <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
                    <StockManagementLayout>{children}</StockManagementLayout>
                </Providers>
            </StoreProvider>
        </NextIntlClientProvider>
    );
}
