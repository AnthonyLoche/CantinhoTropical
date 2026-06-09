// app/components/MainCatalog.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import styles from "../../../assets/css/catalog/MainCatalog.module.css";

export default function MainCatalog({ 
  initialProducts = [], 
  initialCategories = [], 
  initialBrands = [],
  selectedCategoryId = null
}) {
  const [products] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [brands] = useState(initialBrands);
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sincronizar categoria selecionada do slider com os filtros
  useEffect(() => {
    if (selectedCategoryId) {
      // Se já estiver selecionada, não faz nada
      if (!selectedCategories.includes(selectedCategoryId)) {
        setSelectedCategories([selectedCategoryId]);
        setCurrentPage(1);
      }
    } else {
      // Se não tem categoria selecionada, limpa o filtro de categoria
      if (selectedCategories.length > 0) {
        setSelectedCategories([]);
        setCurrentPage(1);
      }
    }
  }, [selectedCategoryId]);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtrar por categoria (prioriza a categoria do slider)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => 
        selectedCategories.includes(p.categoryId)
      );
    }

    // Filtrar por marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => 
        selectedBrands.includes(p.brandId)
      );
    }

    // Filtrar por preço
    filtered = filtered.filter((p) => (p.price || 0) <= priceRange);

    // Ordenar
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  }, [products, selectedCategories, selectedBrands, priceRange, sortBy]);

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handlers
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(1000);
    setSortBy("recent");
    setCurrentPage(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price || 0);
  };

  // Mostrar badge de filtro ativo por categoria
  const activeCategory = selectedCategories.length === 1 
    ? categories.find(c => c.id === selectedCategories[0])
    : null;

  if (products.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.sticky}>
              <div className={styles.filterHeader}>
                <Filter size={20} className={styles.filterIcon} />
                <h2 className={styles.filterTitle}>Filtros</h2>
              </div>
              <p className={styles.filterSubtitle}>Refine sua busca</p>
            </div>
          </aside>
          <section className={styles.productSection}>
            <div className={styles.emptyState}>
              <p>Nenhum produto disponível no momento.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.sticky}>
            <div className={styles.filterHeader}>
              <Filter size={20} className={styles.filterIcon} />
              <h2 className={styles.filterTitle}>Filtros</h2>
            </div>
            <p className={styles.filterSubtitle}>Refine sua busca</p>

            {/* Active Category Badge */}
            {activeCategory && (
              <div className={styles.activeFilterBadge}>
                <span>Categoria: {activeCategory.name}</span>
                <button 
                  onClick={() => handleClearFilters()}
                  className={styles.clearBadge}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Categorias</h4>
                <div className={styles.checkboxGroup}>
                  {categories.map((cat) => (
                    <label key={cat.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterGroupTitle}>Faixa de Preço</h4>
              <div className={styles.priceRange}>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <div className={styles.priceLabels}>
                  <span>€ 0</span>
                  <span>€ {priceRange}+</span>
                </div>
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Marcas</h4>
                <div className={styles.checkboxGroup}>
                  {brands.map((brand) => (
                    <label key={brand.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandChange(brand.id)}
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button className={styles.clearBtn} onClick={handleClearFilters}>
              Limpar Filtros
            </button>
          </div>
        </aside>

        <section className={styles.productSection}>
          <div className={styles.toolbar}>
            <p className={styles.resultCount}>
              Mostrando <span className={styles.resultCountBold}>{paginatedProducts.length}</span> de{" "}
              <span className={styles.resultCountBold}>{filteredProducts.length}</span> produtos
            </p>
            <div className={styles.sortBox}>
              <span>Ordenar por:</span>
              <select 
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
            </div>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {paginatedProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className={styles.productCard}
                  >
                    <div className={styles.imageWrapper}>
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className={styles.productImage}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>📷</div>
                      )}
                      {product.featured && (
                        <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                          Destaque
                        </span>
                      )}
                      {!product.active && (
                        <span className={`${styles.badge} ${styles.badgeInactive}`}>
                          Inativo
                        </span>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productCategory}>
                        {categories.find(c => c.id === product.categoryId)?.name || "Sem categoria"}
                      </span>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productFooter}>
                        <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`${styles.pageBtn} ${currentPage === pageNum ? styles.active : ""}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}