import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "AI-Finance-Platform",
  description: "One stop finance Platfom",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={` ${inter.className}`}>
          <Toaster richColors />
          <Header />
          <div className="min-h-screen overflow-x-hidden">{children}</div>
          <fotter className="bg-blue-400 text-center h-20 ">
            Made with love by Amaan
          </fotter>
        </body>
      </html>
    </ClerkProvider>
  );
}
