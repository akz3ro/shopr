import { DisableDraftMode } from "@/components/DisableDraftMode";
import Header from "@/components/header/Header";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { VisualEditing } from "next-sanity";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopr",
  description:
    "Shopr is a Next.js e-commerce tutorial project built with Sanity CMS, Clerk Auth, and Tailwind CSS. It is a simple e-commerce store that allows users to browse products, add them to a cart, and checkout. The store is built with a serverless architecture and is deployed on Vercel. The project is open-source and can be used as a starting point for building your own e-commerce application.",

  keywords: [
    "Next.js",
    "Sanity CMS",
    "Clerk Auth",
    "Tailwind CSS",
    "e-commerce",
    "serverless",
    "Vercel",
    "open-source",
    "Shopr",
    "tutorial",
    "e-commerce tutorial",
    "e-commerce store",
    "e-commerce application",
  ],

  authors: [
    {
      name: "Shopr",
      url: "https://shopr-akzero.vercel.app",
    },
  ],
  creator: "Ak-ZeRo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased debug-screens`}
        >
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}

          <div>
            <Header />
            {children}
          </div>
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
