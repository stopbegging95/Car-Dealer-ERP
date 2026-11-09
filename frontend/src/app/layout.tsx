import type { Metadata } from "next";
import "./globals.css";
import { MasterDataProvider } from "@/context/MasterDataContext";
import { HomePageProvider } from "@/context/HomePageContext";

export const metadata: Metadata = {
  title: "CarDeals CMS",
  description: "Car Deals Content Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <MasterDataProvider>
          <HomePageProvider>{children}</HomePageProvider>
        </MasterDataProvider>
      </body>
    </html>
  );
}

