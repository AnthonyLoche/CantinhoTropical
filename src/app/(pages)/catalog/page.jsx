"use client";

import { useEffect, useState } from "react";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import { getProductsAction } from "@/modules/products/actions/get-products.action";
import { getBrandsAction } from "@/modules/brands/actions/get-brands.action";

import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import CatalogWrapper from "@/app/components/catalog/CatalogWrapper";

export default function Catalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [categoriesResult, productsResult, brandsResult] =
          await Promise.all([
            getCategoriesAction(),
            getProductsAction({ activeOnly: true }),
            getBrandsAction(),
          ]);

        if (!isMounted) return;

        setCategories(
          categoriesResult.success ? categoriesResult.data : []
        );

        setProducts(
          productsResult.success ? productsResult.data : []
        );

        setBrands(
          brandsResult.success ? brandsResult.data : []
        );
      } catch (error) {
        console.error("Error loading catalog:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <LoadingOverlay
        isLoading={true}
        message="Carregando catálogo..."
      />
    );
  }

  return (
    <CatalogWrapper
      initialCategories={categories}
      initialProducts={products}
      initialBrands={brands}
    />
  );
}