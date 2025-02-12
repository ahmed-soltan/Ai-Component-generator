import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { ContainerWrapper } from "@/components/container-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Component Generator",
  description: "Generate Tailwind UI components effortlessly with AI.",
  keywords: ["AI", "UI Generator", "Tailwind", "React", "Next.js"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ContainerWrapper>
            <Navbar />
            <main>{children}</main>
          </ContainerWrapper>
        </Providers>
      </body>
    </html>
  );
}
