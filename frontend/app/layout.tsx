import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./redux/StoreProvider";

export const metadata: Metadata = {
  title: "Nest-js JWT",
  description: "Created by Abdul Ahad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
