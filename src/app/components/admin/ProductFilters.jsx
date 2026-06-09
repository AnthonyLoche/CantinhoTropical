"use client";

import { useState } from "react";
import { X, Filter, ChevronDown, ChevronUp, SlidersHorizontal, RotateCcw } from "lucide-react";
import styles from "@/assets/css/admin/ProductFilters.module.css";

export default function ProductFilters({
  isOpen,
  onClose,
  brands,
  categories,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    status: true,
    featured: true,
    stock: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedFilters.categories?.includes(categoryId)
      ? selectedFilters.categories.filter(id => id !== categoryId)
      : [...(selectedFilters.categories || []), categoryId];
    onFilterChange({ ...selectedFilters, categories: newCategories });
  };

  const handleBrandChange = (brandId) => {
    const newBrands = selectedFilters.brands?.includes(brandId)
      ? selectedFilters.brands.filter(id => id !== brandId)
      : [...(selectedFilters.brands || []), brandId];
    onFilterChange({ ...selectedFilters, brands: newBrands });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...selectedFilters, status });
  };

  const handleFeaturedChange = (featured) => {
    onFilterChange({ ...selectedFilters, featured });
  };

  const handleStockRangeChange = (range) => {
    onFilterChange({ ...selectedFilters, stockRange: range });
  };

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({ ...selectedFilters, priceRange: { min, max } });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (selectedFilters.categories?.length) count += selectedFilters.categories.length;
    if (selectedFilters.brands?.length) count += selectedFilters.brands.length;
    if (selectedFilters.status && selectedFilters.status !== "all") count++;
    if (selectedFilters.featured === true) count++;
    if (selectedFilters.stockRange && selectedFilters.stockRange !== "all") count++;
    if (selectedFilters.priceRange?.min || selectedFilters.priceRange?.max) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <Filter size={20} />
            <h2>Filtros</h2>
            {activeFiltersCount() > 0 && (
              <span className={styles.filterBadge}>{activeFiltersCount()}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          {/* Clear all filters */}
          {activeFiltersCount() > 0 && (
            <button className={styles.clearAllBtn} onClick={onClearFilters}>
              <RotateCcw size={14} />
              Limpar todos os filtros
            </button>
          )}

          {/* Categories Section */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("categories")}
            >
              <span>Categorias</span>
              {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.categories && (
              <div className={styles.sectionContent}>
                {categories.map((category) => (
                  <label key={category.id} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.categories?.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <span>{category.name}</span>
                    {category._count?.products > 0 && (
                      <span className={styles.count}>({category._count.products})</span>
                    )}
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className={styles.emptyMessage}>Nenhuma categoria encontrada</p>
                )}
              </div>
            )}
          </div>

          {/* Brands Section */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("brands")}
            >
              <span>Marcas</span>
              {expandedSections.brands ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.brands && (
              <div className={styles.sectionContent}>
                {brands.map((brand) => (
                  <label key={brand.id} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.brands?.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                    />
                    <span>{brand.name}</span>
                    {brand._count?.products > 0 && (
                      <span className={styles.count}>({brand._count.products})</span>
                    )}
                  </label>
                ))}
                {brands.length === 0 && (
                  <p className={styles.emptyMessage}>Nenhuma marca encontrada</p>
                )}
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("status")}
            >
              <span>Status</span>
              {expandedSections.status ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.status && (
              <div className={styles.sectionContent}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilters.status === "all" || !selectedFilters.status}
                    onChange={() => handleStatusChange("all")}
                  />
                  <span>Todos</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilters.status === "active"}
                    onChange={() => handleStatusChange("active")}
                  />
                  <span>Ativos</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilters.status === "inactive"}
                    onChange={() => handleStatusChange("inactive")}
                  />
                  <span>Inativos</span>
                </label>
              </div>
            )}
          </div>

          {/* Featured Section */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("featured")}
            >
              <span>Destaque</span>
              {expandedSections.featured ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.featured && (
              <div className={styles.sectionContent}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="featured"
                    checked={selectedFilters.featured === undefined}
                    onChange={() => handleFeaturedChange(undefined)}
                  />
                  <span>Todos</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="featured"
                    checked={selectedFilters.featured === true}
                    onChange={() => handleFeaturedChange(true)}
                  />
                  <span>Em destaque</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="featured"
                    checked={selectedFilters.featured === false}
                    onChange={() => handleFeaturedChange(false)}
                  />
                  <span>Sem destaque</span>
                </label>
              </div>
            )}
          </div>

          {/* Stock Range Section */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("stock")}
            >
              <span>Estoque</span>
              {expandedSections.stock ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.stock && (
              <div className={styles.sectionContent}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="stock"
                    checked={selectedFilters.stockRange === "all" || !selectedFilters.stockRange}
                    onChange={() => handleStockRangeChange("all")}
                  />
                  <span>Todos</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="stock"
                    checked={selectedFilters.stockRange === "low"}
                    onChange={() => handleStockRangeChange("low")}
                  />
                  <span>Estoque baixo (≤ 5)</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="stock"
                    checked={selectedFilters.stockRange === "out"}
                    onChange={() => handleStockRangeChange("out")}
                  />
                  <span>Esgotado (0)</span>
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="stock"
                    checked={selectedFilters.stockRange === "in"}
                    onChange={() => handleStockRangeChange("in")}
                  />
                  <span>Em estoque (&gt; 0)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className={styles.drawerFooter}>
          <button className={styles.applyBtn} onClick={onClose}>
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}