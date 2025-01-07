import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookiesProvider } from "next-client-cookies/server";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Split My Trip",
  description: "The easiest way to split trip expenses between your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <CookiesProvider>
          <main>{children}</main>
        </CookiesProvider>
        <Toaster />
      </body>
    </html>
  );
}
