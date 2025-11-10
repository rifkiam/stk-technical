import type { Metadata } from "next";
import { Inter, Michroma, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"] ,
  display: 'swap',
});
const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})
const michroma = Michroma({
  weight: "400",
  subsets: ['latin'],
  display: 'swap',
  fallback: ['poppins'],
  variable: '--font-michroma'
})

export const metadata: Metadata = {
  title: "STK Test - Rifqi Akhmad",
  description: "STK Technical Test Web App",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${poppins.className}`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
