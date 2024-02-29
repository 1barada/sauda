import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

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
          <main className="grid grid-cols-layout grid-rows-layout min-h-screen">
            <SideBar/>
            <div className="flex flex-col">
              <Header/>
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
