import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../public/assets/fonts/pretendard/pretendard.css";
import "./globals.scss";
import Header from "@/components/common/Header";
import React from "react";
import { ModalProvider } from "@/contexts/ModalContext";
import Modal from "@/components/modal/Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Play Highlight",
  description: "Video streaming sites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ModalProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Modal />
        </body>
      </html>
    </ModalProvider>
  );
}
