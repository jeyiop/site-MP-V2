import type { Metadata } from "next";
import { Figtree, Red_Hat_Mono, Manrope, Space_Grotesk, IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { ClientHeader } from "../components/ClientHeader";
import Footer from "../components/Footer";
import { StructuredData } from "../components/StructuredData";
import { EditorWrapper } from "../components/EditorWrapper";
import { MainWrapper } from "../components/MainWrapper";
import { defaultMetadata, organizationSchema } from "../lib/seo";

const figtree = Figtree({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const redHatMono = Red_Hat_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-red-hat-mono",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const sora = Sora({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData data={organizationSchema} />
      </head>
      <body data-typo="c" className={`${figtree.variable} ${redHatMono.variable} ${manrope.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} ${sora.variable} antialiased`}>
        <EditorWrapper>
          <ClientHeader />
          <MainWrapper>
            {children}
          </MainWrapper>
          <Footer />
        </EditorWrapper>
      </body>
    </html>
  );
}
