import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adiyogi AI - Learn Anything For Free",
  description:
    "A voice-first AI that organizes free education from YouTube, NPTEL, Khan Academy, and open universities for every Indian.",
  keywords: [
    "free education",
    "AI learning",
    "NPTEL",
    "YouTube courses",
    "Indian education",
    "voice learning",
    "Hindi education",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-white antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
