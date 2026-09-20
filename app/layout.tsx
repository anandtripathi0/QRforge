import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://qrforge-crystal.lemony-quail-6417.chatgpt.site"),
  alternates: {canonical:"/"},
  manifest: "/manifest.webmanifest",
  title: "QRForge — Create, customize and download QR codes",
  description: "Free, private QR creation with custom colors, frames and logos.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
