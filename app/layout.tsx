import "@/styles/globals.css";

import { fontGeist, fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { extractRouterConfig } from "uploadthing/server";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import ContactBtn from "@/components/layout/contact-btn";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import { ourFileRouter } from "./api/uploadthing/core";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background relative min-h-screen font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          fontGeist.variable,
        )}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <ModalProvider>{children}</ModalProvider>
            <Analytics />
            <Toaster richColors closeButton />
            <TailwindIndicator />
            <ContactBtn />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
