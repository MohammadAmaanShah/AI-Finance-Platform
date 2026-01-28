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
          <footer className="bg-blue-50 py-12 mt-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Made with 💗 by Amaan Shah</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
