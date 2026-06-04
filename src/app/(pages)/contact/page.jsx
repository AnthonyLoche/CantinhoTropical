import { HeaderMain,  HeroContact, FormContact, LocationContact, FooterMain, Reveal} from "../../components";

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
