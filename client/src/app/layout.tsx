import type { Metadata, Viewport } from "next";
import "@/../styles/globals.css";
import { siteConfig } from "@/config/site";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="light"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased static-class",
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
