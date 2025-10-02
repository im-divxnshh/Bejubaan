import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bejuwaan",
  description: "Dev Team MCA-KCMT",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
