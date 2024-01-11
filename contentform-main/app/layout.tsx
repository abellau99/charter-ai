import FlowbiteContext from "@/context/FlowbiteContext";
import { Inter } from "@next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`${inter.className} text-tc-primary`}>
        <Providers>
          <FlowbiteContext>{children}</FlowbiteContext>
        </Providers>
      </body>
    </html>
  );
}
