import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../public/assets/fonts/pretendard/pretendard.css";
import "./globals.scss";
import { ModalProvider } from "@/contexts/ModalContext";
import Modal from "@/components/modal/Modal";
import StoreProvider from "@/app/StoreProvider";
import React from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Play Highlight",
  description: "Video streaming sites",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  return (
    <StoreProvider>
      <ModalProvider>
        <html lang={locale}>
          <body className={inter.className}>
            <NextIntlClientProvider
              locale={locale}
              messages={messages}
              children={
                <>
                  {children}
                  <Modal />
                </>
              }
            />
          </body>
        </html>
      </ModalProvider>
    </StoreProvider>
  );
}
