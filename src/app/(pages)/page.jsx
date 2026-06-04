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
  Reveal
} from "../components";

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
        <AboutSection />
      </Reveal>
      <Reveal>
        <FeaturedProducts />
      </Reveal>
      <Reveal>
        <FeaturesSection />
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
