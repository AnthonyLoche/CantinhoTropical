import { HeaderMain,  HeroContact, FormContact, LocationContact, FooterMain, Reveal} from "../../components";

export const metadata = {
  title: "Contactos",

  description:
    "Entre em contacto com o Cantinho Tropical Pet Shop em Mafra e Ericeira. Estamos prontos para ajudar.",

  alternates: {
    canonical: "/contact",
  },
};

export default function Contact() {
  return (
    <>
      <HeaderMain />
      <Reveal>
        <HeroContact />
      </Reveal>
      <Reveal>
        <FormContact />
      </Reveal>
      <Reveal>
        <LocationContact />
      </Reveal>
      <FooterMain />
    </>
  );
}
