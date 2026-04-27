import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AurumIndex | Real-time Gold API", // ชื่อที่จะขึ้นบน Tab browser
  description: "The most reliable gold price API for developers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {/* children คือเนื้อหาของหน้าต่างๆ (Home, Pricing, Dashboard) */}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
