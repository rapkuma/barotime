import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "바로타임 (BAROTIME) - 오차 없이 바로 맞는 초정밀 서버시간",
  description: "인터파크, 코레일, 멜론, 전국 대학교 수강신청 등 0.001초 밀리초 틱오버 초정밀 실시간 서버시간 & 커뮤니티",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Toaster>
          {children}
        </Toaster>
      </body>
    </html>
  );
}
