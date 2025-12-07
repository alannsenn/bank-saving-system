import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bank Saving System",
  description: "Bank saving system with deposito management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-white">Bank Saving System</a>
            <div className="flex gap-4">
              <a href="/customers" className="text-white hover:underline">Customers</a>
              <a href="/accounts" className="text-white hover:underline">Accounts</a>
              <a href="/deposito-types" className="text-white hover:underline">Deposito Types</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
