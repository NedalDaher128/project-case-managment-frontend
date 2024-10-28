import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cairo } from 'next/font/google'
import Navbar from "../components/navbar/navbar";
import Footer from "@/components/footer";
import { Toaster } from 'react-hot-toast';

import "./globals.css";

export const metadata: Metadata = {
  title: "لوحة تحكم ادارة قضايا",
  description: "لوحة تحكم ادارة قضايا",
};

const roboto = Cairo({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Navbar/>
        <Toaster position="top-right" />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
