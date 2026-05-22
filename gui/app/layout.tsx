import type { Metadata } from "next";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Setpoint",
  description: "Volleyball club management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
