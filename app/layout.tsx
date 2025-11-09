import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "@/hooks/use-data";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnonNote - Get Honest Notes Anonymously",
  description: "Receive anonymous messages from your friends",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AnonNote",
  },
  icons: {
    icon: [
      {
        url: "/icon-192.jpg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/icon-512.jpg",
  },
  generator: "v0.app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ff6b6b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <AuthProvider>
          <DataProvider>
            {children}
            <Toaster />
            <Analytics />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
