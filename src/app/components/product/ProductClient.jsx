"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Package,
  Leaf,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import styles from "@/assets/css/product/Product.module.css";

export default function ProductClient({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const updateQuantity = (delta) => {
    setQuantity(prev => {
      let newQty = prev + delta;
      if (newQty < 1) newQty = 1;
      if (newQty > (product.stockQuantity || 99)) newQty = product.stockQuantity;
      return newQty;
    });
  };

  const tabs = [
    { id: "description", label: "Descrição Detalhada" },
    { id: "ingredients", label: "Ingredientes" },
    { id: "usage", label: "Modo de Uso" },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price || 0);
  };

  // Garantir que temos um array de imagens
  const images = product.imageUrl ? [product.imageUrl] : [];
  
  // Características do produto (mock - pode vir da API)
  const features = [
    { icon: Leaf, text: "100% Orgânico" },
    { icon: ShieldCheck, text: "Vet Approved" },
  ];

  // Benefícios (mock - pode vir da API)
  const benefits = [
    "Promove o brilho natural e a resistência das penas.",
    "Fácil digestão com enzimas naturais de frutos tropicais.",
    "Suporte imunológico através de antioxidantes naturais.",
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <ChevronRight size={12} className={styles.breadcrumbIcon} />
          <Link href="/catalog" className={styles.breadcrumbLink}>Shop</Link>
          <ChevronRight size={12} className={styles.breadcrumbIcon} />
          <span className={styles.breadcrumbCurrent}>
            {product.category?.name || "Produto"}
          </span>
        </nav>

        <div className={styles.productGrid}>
          {/* Gallery Section */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className={styles.mainImage}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className={styles.noImage}>Sem imagem</div>
              )}
              <div className={styles.badges}>
                {product.featured && (
                  <span className={`${styles.badge} ${styles.badgeDark}`}>DESTAQUE</span>
                )}
                {product.isNew && (
                  <span className={`${styles.badge} ${styles.badgeYellow}`}>NEW</span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnailGrid}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumbnail} ${activeImage === idx ? styles.thumbnailActive : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className={styles.thumbnailImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className={styles.detailsSection}>
            <div className={styles.brand}>
              {product.brand?.name || "Cantinho Tropical"}
            </div>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              <div className={styles.divider}></div>
              <div className={styles.stock}>
                <Package size={18} className={styles.stockIcon} />
                <span>{product.stockQuantity || 0} unidades em stock</span>
              </div>
            </div>
            <p className={styles.description}>{product.description}</p>

            {/* Product Features */}
            <div className={styles.featuresGrid}>
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className={styles.featureCard}>
                    <Icon size={24} className={styles.featureIcon} />
                    <span className={styles.featureText}>{feature.text}</span>
                  </div>
                );
              })}
            </div>


          </div>
        </div>

        {/* Details Tabs */}
        <section className={styles.tabsSection}>
          <div className={styles.tabsHeader}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={styles.tabsContent}>
            <div className={styles.tabPanel}>
              <p className={styles.tabText}>
                {product.description || "Descrição detalhada do produto em breve."}
              </p>
              <ul className={styles.benefitsList}>
                {benefits.map((benefit, idx) => (
                  <li key={idx} className={styles.benefitItem}>
                    <CheckCircle2 size={20} className={styles.benefitIcon} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>
                <Lightbulb size={24} className={styles.tipIcon} />
                Dica do Especialista
              </h3>
              <p className={styles.tipText}>
                Para aves mais exigentes, misture gradualmente esta ração com a anterior durante 7 dias. Lembre-se de fornecer sempre água fresca e filtrada.
              </p>
            </div>
          </div>
        </section>

        {/* Related Products - Opcional */}
        {/* <section className={styles.relatedSection}>
          ...
        </section> */}
      </div>
    </main>
  );
}