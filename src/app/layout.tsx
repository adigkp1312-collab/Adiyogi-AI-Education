import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adiyogi AI — Free AI-Powered Education For Every Indian",
  description:
    "AI that organizes free education from YouTube, NPTEL, Khan Academy, and open universities — personalized for you, in your language.",
  keywords: [
    "free education",
    "AI learning",
    "NPTEL",
    "YouTube courses",
    "Indian education",
    "voice learning",
    "Hindi education",
  ],
  openGraph: {
    title: "Adiyogi AI — Free AI-Powered Education For Every Indian",
    description:
      "AI that organizes free education from YouTube, NPTEL, Khan Academy, and open universities — personalized for you, in your language.",
    siteName: "Adiyogi AI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="mx-auto min-h-screen max-w-[1920px] scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="mx-auto flex flex-col overflow-x-clip antialiased">
        {children}
      </body>
    </html>
  );
}
