"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../../assets/css/home/FeaturedProducts.module.css";
import { getProductsAction } from "@/modules/products/actions/get-products.action";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        const result = await getProductsAction({ activeOnly: true });
        if (result.success && isMounted) {
          // Filtrar apenas produtos em destaque
          setProducts(result.data.slice(0, 4)); // Limitar a 4 produtos
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Formatar preço para Euro (ou Real, dependendo da moeda)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price || 0);
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Destaques da Estação</h2>
            <p className={styles.subtitle}>
              Produtos selecionados para o bem-estar do seu pet.
            </p>
          </div>
          <button className={styles.viewAll} disabled>Ver tudo</button>
        </div>
        <div className={styles.grid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonInfo} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Se não houver produtos em destaque, não renderiza a seção
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Destaques da Estação</h2>
          <p className={styles.subtitle}>
            Produtos selecionados para o bem-estar do seu pet.
          </p>
        </div>
        <Link href="/catalog" className={styles.viewAll}>
          Ver tudo
        </Link>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <Link href={`/product/${product.id}`} className={styles.cardLink}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageContainer}>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>📷</div>
                  )}
                  {product.featured && (
                    <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                      Destaque
                    </span>
                  )}
                </div>
              </div>
              <p className={styles.category}>
                {product.category?.name || "Sem categoria"}
              </p>
              <h4 className={styles.name}>{product.name}</h4>
              <div className={styles.footer}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}