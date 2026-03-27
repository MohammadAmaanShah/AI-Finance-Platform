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
          <footer className="bg-white/10 py-12">
            <div className=" font-sans font-semibold  container mx-auto px-4 text-center text-gray-600">
              <p>
                Made by{" "}
                <span className="font-bold  text-blue-500">Amaan Shah</span>
              </p>
              <p>All rights reserved © {new Date().getFullYear()}</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
