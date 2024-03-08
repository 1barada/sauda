import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import Player from "@/components/player/Player";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sauda",
  description: "Music service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen flex flex-col">
            <div className="flex-auto grid grid-cols-layout grid-rows-layout divide-x">
              <SideBar/>
              <div className="flex flex-col divide-y">
                <Header/>
                {children}
              </div>
            </div>
            <Player className="h-100px"/>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
