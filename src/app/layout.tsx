import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "onlytheflames",
  description:
    "Mario Imanuel Daruranto's portfolio v1. Aspiring web/motion designer & developer with 1+ year of experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased bg-primary"}>
        <main>{children}</main>
      </body>
    </html>
  );
}
``;
