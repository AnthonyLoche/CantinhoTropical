import { HeaderMain, HeroCatalog, CategoriesCatalog, MainCatalog, FooterMain, Reveal } from "../../components";

export default function Catalog() {
  return (
    <>
      <HeaderMain />
      <Reveal>
        <HeroCatalog />
      </Reveal>
      <Reveal>
        <CategoriesCatalog />
      </Reveal>
      <Reveal>
        <MainCatalog />
      </Reveal>
      <FooterMain />
    </>
  );
}
