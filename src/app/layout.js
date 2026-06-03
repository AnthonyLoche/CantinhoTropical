import { Manrope, Be_Vietnam_Pro } from "next/font/google";
import "../assets/globals.css";

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
  title: "Cantinho Tropical | Petshop & Pet Hotel em Mafra",
  description: "Especialistas em alimentação, acessórios, aves exóticas, aquariofilia, roedores, répteis e muito mais.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-PT"
      className={`${manrope.variable} ${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}