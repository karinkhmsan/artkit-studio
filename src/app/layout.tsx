import type { Metadata } from "next";
import { StudioShell } from "@/components/studio-shell";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteTitle = "ArtKit Studio — A little space to make art";
const siteDescription = "A calm, private workspace for artists. Explore gesture drawing, color and value, and creative prompts in English or Thai.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ArtKit Studio — A little space to make art", template: "%s | ArtKit Studio" },
  description: siteDescription,
  applicationName: "ArtKit Studio",
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "ArtKit Studio", title: siteTitle, description: siteDescription, locale: "en_US", alternateLocale: ["th_TH"] },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('artkit-theme');if(t==='light')document.documentElement.dataset.theme='light';var l=localStorage.getItem('artkit-language');if(l==='th')document.documentElement.lang='th'}catch(e){}` }} />
      </head>
      <body><StudioShell>{children}</StudioShell></body>
    </html>
  );
}