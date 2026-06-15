import {
  HeaderMain,
  HeroMain,
  CategoryGrid,
  AboutSection,
  FeaturedProducts,
  FeaturesSection,
  TestimonialsSection,
  PetHotelSection,
  LocationSection,
  FooterMain,
  Reveal,
} from "../components";

export const metadata = {
  title:
    "Cantinho Tropical Pet Shop | Produtos e Serviços para Animais em Mafra",

  description:
    "Cantinho Tropical Pet Shop em Mafra e Ericeira. Alimentação, acessórios, aquariofilia, aves exóticas, cães, gatos, roedores, répteis e hotel para animais.",

  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeaderMain />
      <Reveal>
        <HeroMain />
      </Reveal>
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <FeaturesSection />
      </Reveal>
      <Reveal>
        <AboutSection />
      </Reveal>
      <Reveal>
        <FeaturedProducts />
      </Reveal>
      <Reveal>
        <TestimonialsSection />
      </Reveal>
      <Reveal>
        <PetHotelSection />
      </Reveal>
      <Reveal>
        <LocationSection />
      </Reveal>
      <FooterMain />
    </>
  );
}
