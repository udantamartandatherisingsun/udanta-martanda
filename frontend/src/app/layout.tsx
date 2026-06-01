import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Courier_Prime, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-hindi",
});

export const metadata: Metadata = {
  title: "Udant Martand | India's First Hindi Newspaper",
  description: "Independent Journalism Since 1826. Reborn Digital in 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${lora.variable} ${courier.variable} ${notoHindi.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
