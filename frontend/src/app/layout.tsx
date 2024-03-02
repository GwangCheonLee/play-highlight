import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../public/assets/fonts/pretendard/pretendard.css";
import "./globals.scss";
import Header from "@/components/layout/Header";
import Modal from "@/components/modal/Modal";
import StoreProvider from "@/app/StoreProvider";

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
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Header />
          {children}
          <Modal />
        </StoreProvider>
      </body>
    </html>
  );
}
