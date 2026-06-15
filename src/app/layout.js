import { Manrope, Be_Vietnam_Pro } from "next/font/google";
import "../assets/globals.css";
import "../assets/css/animation.css";
import Providers from "./providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  metadataBase: new URL("https://www.cantinhotropical.pt"),

  title: {
    default:
      "Cantinho Tropical Pet Shop | Produtos e Serviços para Animais em Mafra",
    template: "%s | Cantinho Tropical Pet Shop",
  },

  description:
    "Cantinho Tropical Pet Shop em Mafra e Ericeira. Especialistas em alimentação, acessórios, aquariofilia, aves exóticas, cães, gatos, roedores, répteis e hotel para animais.",

  keywords: [
    "pet shop mafra",
    "pet shop ericeira",
    "loja de animais mafra",
    "loja de animais ericeira",
    "hotel para animais mafra",
    "ração para cães",
    "ração para gatos",
    "aquariofilia",
    "aves exóticas",
    "roedores",
    "répteis",
    "produtos para animais portugal",
    "cantinho tropical",
  ],

  authors: [
    {
      name: "Cantinho Tropical Pet Shop",
      url: "https://www.cantinhotropical.pt",
    },
  ],

  creator: "Cantinho Tropical Pet Shop",
  publisher: "Cantinho Tropical Pet Shop",
  applicationName: "Cantinho Tropical Pet Shop",
  category: "Pet Shop",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://www.cantinhotropical.pt",
    siteName: "Cantinho Tropical Pet Shop",

    title:
      "Cantinho Tropical Pet Shop | Produtos e Serviços para Animais em Mafra",

    description:
      "Especialistas em alimentação, acessórios, aves exóticas, aquariofilia, roedores, répteis e hotel para animais em Mafra e Ericeira.",

    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Cantinho Tropical Pet Shop",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Cantinho Tropical Pet Shop | Produtos e Serviços para Animais em Mafra",

    description:
      "Especialistas em alimentação, acessórios, aves exóticas, aquariofilia, roedores, répteis e hotel para animais.",

    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-PT"
      className={`${manrope.variable} ${beVietnamPro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
