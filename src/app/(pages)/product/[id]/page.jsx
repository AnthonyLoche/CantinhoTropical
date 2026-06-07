import { HeaderMain, FooterMain } from "@/app/components";
import { getProductAction } from "@/modules/products/actions/get-product.action";
import ProductClient from "@/app/components/product/ProductClient";
import Link from "next/link";

export default async function ProductPage({ params }) {
  const { id } = await params;
  
  // Buscar produto pelo ID
  const result = await getProductAction(id);
  const product = result.success ? result.data : null;

  if (!product) {
    return (
      <>
        <HeaderMain />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Produto não encontrado</h1>
            <Link href="/catalog" className="text-secondary hover:underline">
              Voltar ao catálogo
            </Link>
          </div>
        </div>
        <FooterMain />
      </>
    );
  }

  return (
    <>
      <HeaderMain />
      <ProductClient product={product} />
      <FooterMain />
    </>
  );
}