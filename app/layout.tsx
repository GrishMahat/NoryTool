/** @format */
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Norytools",
    template: `%s | 'nory tools'`,
  },
  description: "Made by a random guy who is having fun making this too.",
  keywords: [
    "developer tools",
    "web tools",
    "json",
    "formatting",
    "validation",
  ],
  authors: [{ name: "Norysigth" }],
  creator: "Norysigth",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beta.nory.tech.com",
    title: "nory tools",
    description: "Made by a random guy who is having fun making this too.",
    siteName: "nory tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "nory tools",
    description: "Made by a random guy who is having fun making this too.",
    creator: "@norysight",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className='font-sans min-h-screen flex flex-col'>
        <ThemeProvider>
          {/* @ts-expect-error Async Server Component */}
          <ClerkProvider
            appearance={{
              baseTheme: dark,
            }}>
            <Navbar />
            <main className='flex-1'>{children}</main>
            <Footer />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
