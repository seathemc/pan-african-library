import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Audit pass XVI (2026-05-15): expanded root metadata with OpenGraph +
// Twitter cards. Previously had only title + description so social
// link-previews used generic stock metadata.
export const metadata: Metadata = {
  metadataBase: new URL('https://wisdom.pan-african-library.example'),
  title: {
    default: "Wisdom — Africa's greatest thinkers, writers, and fighters. One library.",
    template: "%s · Wisdom",
  },
  description:
    "Building pan-African optimism through knowledge. The most comprehensive archive of African and diaspora thought — reviving the past, visualizing the future, building in the present.",
  keywords: [
    'pan-African literature', 'African literature', 'Agenda 2063',
    'African Union', 'African futures', 'Afrofuturism', 'Black studies',
    'African philosophy', 'Harlem Renaissance', 'African diaspora',
    'Mo Ibrahim Index', 'African development',
  ],
  authors: [{ name: 'Wisdom Pan-African Library' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Wisdom',
    title: "Wisdom — Africa's greatest thinkers, writers, and fighters. One library.",
    description:
      '500+ pan-African and diaspora works. Live Agenda 2063 progress. Three futures for Africa by 2043.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wisdom — Africa's greatest thinkers, writers, and fighters.",
    description:
      '500+ pan-African and diaspora works. Live Agenda 2063 progress. Three futures for Africa.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Anti-flicker: apply stored theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.remove('dark');else document.documentElement.classList.add('dark')}catch{}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
