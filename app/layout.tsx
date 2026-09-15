import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SpectRoom - A safe space for meaningful connections",
  description:
    "SpectRoom is a dating and connection app thoughtfully designed for autistic adults and the broader neurodivergent community. Connect at your own pace with privacy-first 2 factor authentication security.",
  keywords: [
    "SpectRoom",
    "neurodivergent dating",
    "autistic adults",
    "safe dating app",
    "social discovery",
  ],
  icons: {
    icon: "/assets/app-icon.png",
    apple: "/assets/app-icon.png",
  },
  openGraph: {
    title: "SpectRoom - A safe space for meaningful connections",
    description:
      "A safe, understanding space built around you. Connect with people who appreciate your unique perspective.",
    type: "website",
    images: ["/assets/app-icon.png"],
  },
};

const themeInitScript = `(()=>{try{var k='spectroom-theme';var t=localStorage.getItem(k);if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative min-h-screen w-full overflow-x-clip bg-cream font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
