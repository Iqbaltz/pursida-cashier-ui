import ProgressBarProvider from "@/components/progressbar-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";

export const metadata: Metadata = {
  title: "POS Demo Cashier App",
  description: "POS Demo Cashier App",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["POS", "Cashier", "App"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "Foundasi" },
    {
      name: "Foundasi",
      url: "https://www.foundasi.com/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icon-128x128.png" },
    { rel: "icon", url: "/icon-128x128.png" },
  ],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBarProvider>{children}</ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
