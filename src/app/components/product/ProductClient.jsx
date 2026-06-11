"use client";

import { useState, useEffect } from "react";
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
  Layers,
  BookOpen,
  ListChecks,
} from "lucide-react";
import styles from "@/assets/css/product/Product.module.css";
import { getProductsAction } from "@/modules/products/actions/get-products.action";
import { useCart } from "@/hooks/useCart"; // Importar o hook

export default function ProductClient({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const { addItem, openDrawer } = useCart(); // Usar o carrinho

  // Verifica se o produto tem variantes
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Preço a ser exibido (da variante selecionada ou do produto)
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  
  // Estoque a ser exibido (da variante selecionada ou do produto)
  const displayStock = selectedVariant ? selectedVariant.quantity : product.stockQuantity;

  // Buscar produtos relacionados da mesma categoria
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product.categoryId) return;
      
      setLoadingRelated(true);
      try {
        const result = await getProductsAction({ 
          categoryId: product.categoryId,
          activeOnly: true
        });
        
        if (result.success) {
          // Filtrar o produto atual e limitar a 4 produtos
          const filtered = result.data
            .filter(p => p.id !== product.id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product.categoryId, product.id]);

  const updateQuantity = (delta) => {
    setQuantity(prev => {
      let newQty = prev + delta;
      if (newQty < 1) newQty = 1;
      if (newQty > (displayStock || 99)) newQty = displayStock;
      return newQty;
    });
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  // Função para adicionar ao carrinho
  const handleAddToCart = () => {
    const productToAdd = selectedVariant 
      ? {
          id: selectedVariant.id,
          name: `${product.name} - ${selectedVariant.label}`,
          slug: product.slug || product.id,
          imageUrl: product.imageUrl,
          price: selectedVariant.price,
        }
      : {
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          imageUrl: product.imageUrl,
          price: product.price,
        };
    
    addItem(productToAdd, quantity);
    openDrawer(); // Abre o drawer do carrinho
  };

  const tabs = [
    { id: "description", label: "Descrição" },
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
  
  // Características do produto
  const features = [
    { icon: Leaf, text: "100% Orgânico" },
    { icon: ShieldCheck, text: "Vet Approved" },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <ChevronRight size={12} className={styles.breadcrumbIcon} />
          <Link href="/catalog" className={styles.breadcrumbLink}>Catálogo</Link>
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
              <span className={styles.price}>{formatPrice(displayPrice)}</span>
              <div className={styles.divider}></div>
              <div className={styles.stock}>
                <Package size={18} className={styles.stockIcon} />
                <span>{displayStock || 0} unidades em stock</span>
              </div>
            </div>
            
            <p className={styles.description}>{product.description}</p>

            {/* Variants Selector */}
            {hasVariants && (
              <div className={styles.variantsSection}>
                <label className={styles.variantsLabel}>
                  <Layers size={16} className={styles.inlineIcon} />
                  Opções disponíveis:
                </label>
                <div className={styles.variantsGrid}>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`${styles.variantOption} ${selectedVariant?.id === variant.id ? styles.variantActive : ''}`}
                      onClick={() => handleVariantChange(variant)}
                    >
                      <span className={styles.variantLabel}>{variant.label}</span>
                      <span className={styles.variantPrice}>{formatPrice(variant.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            <div className={styles.cartActions}>
              <div className={styles.quantitySelector}>
                <button 
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button 
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(1)}
                  disabled={quantity >= (displayStock || 99)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
              </button>
            </div>

            {/* Features */}
            <div className={styles.featuresList}>
              {features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <feature.icon size={18} className={styles.featureIcon} />
                  <span>{feature.text}</span>
                </div>
              ))}
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
              {/* Descrição */}
              {activeTab === "description" && (
                <>
                  <p className={styles.tabText}>
                    {product.description || "Descrição detalhada do produto em breve."}
                  </p>
                </>
              )}

              {/* Ingredientes */}
              {activeTab === "ingredients" && (
                <div className={styles.ingredientsSection}>
                  <h3 className={styles.sectionSubtitle}>
                    <ListChecks size={20} className={styles.sectionIcon} />
                    Ingredientes
                  </h3>
                  <p className={styles.tabText}>
                    {product.ingredients || "Informação de ingredientes em breve."}
                  </p>
                </div>
              )}

              {/* Modo de Uso */}
              {activeTab === "usage" && (
                <div className={styles.usageSection}>
                  <h3 className={styles.sectionSubtitle}>
                    <BookOpen size={20} className={styles.sectionIcon} />
                    Modo de Uso
                  </h3>
                  <p className={styles.tabText}>
                    {product.howUse || "Instruções de uso em breve."}
                  </p>
                </div>
              )}
            </div>

            {/* Dica do Especialista - Sidebar */}
            <div className={styles.tipCard}>
              <h3 className={styles.tipTitle}>
                <Lightbulb size={24} className={styles.tipIcon} />
                Dica do Especialista
              </h3>
              <p className={styles.tipText}>
                {product.hint || "Para melhores resultados, siga as instruções de uso e mantenha o produto em local seco e arejado."}
              </p>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <section className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <div>
              <h2 className={styles.relatedTitle}>Produtos Relacionados</h2>
              <p className={styles.relatedSubtitle}>
                Descubra mais produtos da categoria {product.category?.name || "deste produto"}
              </p>
            </div>
            <Link href={`/catalog?category=${product.categoryId}`} className={styles.viewAllLink}>
              Ver Todos
              <ArrowRight size={16} className={styles.viewAllIcon} />
            </Link>
          </div>

          {loadingRelated ? (
            <div className={styles.relatedGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonInfo} />
                </div>
              ))}
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className={styles.noRelated}>
              <p>Nenhum produto relacionado encontrado.</p>
            </div>
          ) : (
            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/product/${item.id}`} className={styles.productCard}>
                  <div className={styles.cardImageWrapper}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className={styles.cardImage}
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className={styles.cardImagePlaceholder}>📷</div>
                    )}
                  </div>
                  <div className={styles.cardCategory}>
                    {item.category?.name || "Produto"}
                  </div>
                  <h4 className={styles.cardName}>{item.name}</h4>
                  <p className={styles.cardPrice}>{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}