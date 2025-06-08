import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mario Imanuel - portfolio v1",
  description:
    "Aspiring web/motion designer & developer with 1+ year of experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-[#4208F5]`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
