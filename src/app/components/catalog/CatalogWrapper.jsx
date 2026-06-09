// app/components/CatalogWrapper.jsx
"use client";

import { useState } from "react";
import CategorySlider from "./CategoriesCatalog";
import MainCatalog from "./MainCatalog";
import { HeaderMain, HeroCatalog, FooterMain, Reveal } from "../index";

export default function CatalogWrapper({ 
  initialCategories, 
  initialProducts, 
  initialBrands 
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <>
      <HeaderMain />
      <Reveal>
        <HeroCatalog />
      </Reveal>
      <Reveal>
        <CategorySlider 
          initialCategories={initialCategories}
          onCategorySelect={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
        />
      </Reveal>
      <Reveal>
        <MainCatalog 
          initialProducts={initialProducts}
          initialCategories={initialCategories}
          initialBrands={initialBrands}
          selectedCategoryId={selectedCategoryId}
        />
      </Reveal>
      <FooterMain />
    </>
  );
}