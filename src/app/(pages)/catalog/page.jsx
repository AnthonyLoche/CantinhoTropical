import { Suspense } from "react";
import { HeaderMain, HeroCatalog, FooterMain, Reveal } from "../../components";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import { getProductsAction } from "@/modules/products/actions/get-products.action";
import { getBrandsAction } from "@/modules/brands/actions/get-brands.action";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import CatalogWrapper from "@/app/components/catalog/CatalogWrapper";

async function CatalogContent() {
  const [categoriesResult, productsResult, brandsResult] = await Promise.all([
    getCategoriesAction(),
    getProductsAction({ activeOnly: true }),
    getBrandsAction(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const products = productsResult.success ? productsResult.data : [];
  const brands = brandsResult.success ? brandsResult.data : [];

  return (
    <CatalogWrapper
      initialCategories={categories}
      initialProducts={products}
      initialBrands={brands}
    />
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} message="Carregando catálogo..." />}>
      <CatalogContent />
    </Suspense>
  );
}