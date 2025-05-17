import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next";
import Providers from "@/providers/queryProviders";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "GrubRush",
  description: "GrubRush is a platform for finding and sharing restaurant recommendations.",
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider >

        <body
          className={`${poppins.className} antialiased`}
        >
          <Providers>

            <NuqsAdapter>
              {children}
            </NuqsAdapter>
          </Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
