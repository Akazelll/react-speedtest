import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Speedtest Next App",
  description: "Check your internet speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        {/* Load Library Utama dari folder public */}
        <Script src='/ndt7.min.js' strategy='beforeInteractive' />
      </body>
    </html>
  );
}
