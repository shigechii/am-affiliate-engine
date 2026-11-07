import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootLayout } from "@/components/layout/RootLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DMMアフィリエイト セール＆最安値トラッカー",
  description: "DMMアフィリエイト商品のセール情報、割引率、価格変動履歴を自動トラッキング・検索できるWebポータル",
};

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}


