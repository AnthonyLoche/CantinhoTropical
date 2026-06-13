// app/components/CatalogWrapper.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CategorySlider from "./CategoriesCatalog";
import MainCatalog from "./MainCatalog";
import { HeaderMain, HeroCatalog, FooterMain, Reveal } from "../index";

export default function CatalogWrapper({ 
  initialCategories, 
  initialProducts, 
  initialBrands 
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const searchParams = useSearchParams();

  // Efeito para ler a categoria da URL e definir o filtro inicial
  useEffect(() => {
    const categoryName = searchParams.get("category");
    
    if (!categoryName) {
      // Se não tem categoria na URL, mantém null (mostra todos)
      setSelectedCategoryId(null);
      return;
    }

    // Buscar a categoria pelo nome (case insensitive)
    const category = initialCategories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (category) {
      setSelectedCategoryId(category.id);
    } else {
      // Se a categoria não for encontrada, limpa o filtro
      setSelectedCategoryId(null);
    }
  }, [searchParams, initialCategories]);

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