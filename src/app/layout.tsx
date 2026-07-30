import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyGeotab Vehicle Dashboard",
  description: "A scalable MyGeotab Add-In dashboard for vehicle lists."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
