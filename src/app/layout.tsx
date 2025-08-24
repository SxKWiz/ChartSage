import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from "@/contexts/settings-context";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import ChartSageLogo from "@/components/chart-sage-logo";
import Link from "next/link";
import { Home, History, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "ChartSage",
  description: "Crypto AI chart analyzer app",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          "h-full bg-background font-body antialiased",
          inter.variable
        )}
      >
        <SettingsProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <Link href="/" className="flex items-center gap-2">
                  <ChartSageLogo className="w-8 h-8 text-primary" />
                  <span className="text-xl font-semibold">ChartSage</span>
                </Link>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/">
                        <Home />
                        Home
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/history">
                        <History />
                        History
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/settings">
                        <Settings />
                        Settings
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <p className="text-xs text-muted-foreground px-2">
                  &copy; {new Date().getFullYear()} ChartSage
                </p>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  );
}
