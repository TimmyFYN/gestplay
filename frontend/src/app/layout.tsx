import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GestPlay | Next-Gen Gesture Controlled Board Games",
  description: "Experience the future of multiplayer board games with GestPlay. Control chess and tic-tac-toe using intuitive hand gestures.",
  openGraph: {
    title: "GestPlay | Gesture Controlled Board Games",
    description: "Experience the future of multiplayer board games with GestPlay. Control chess and tic-tac-toe using intuitive hand gestures.",
    url: "https://gestplay.vercel.app",
    siteName: "GestPlay",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 1024,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GestPlay | Gesture Controlled Board Games",
    description: "Experience the future of multiplayer board games with GestPlay. Control chess and tic-tac-toe using intuitive hand gestures.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
