// app/components/CategorySlider.jsx
"use client";

import { useRef, useState, useEffect } from "react";
import styles from "../../../assets/css/catalog/CategoriesCatalog.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function CategorySlider({ 
  initialCategories = [], 
  onCategorySelect,
  selectedCategoryId: externalSelectedId 
}) {
  const trackRef = useRef(null);
  const [categories, setCategories] = useState(initialCategories);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [loading, setLoading] = useState(initialCategories.length === 0);

  // Use external state if provided, otherwise use internal
  const activeId = externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;

  const ITEM_WIDTH = 140;

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories, externalSelectedId, onCategorySelect]);

  const handleCategoryClick = (categoryId) => {
    // Update state
    if (externalSelectedId === undefined) {
      setInternalSelectedId(categoryId);
    }
    
    // Notify parent
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: dir * ITEM_WIDTH * 2,
      behavior: "smooth",
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.controls}>
          <button className={styles.arrow} disabled aria-label="Anterior">
            <ChevronLeft size={20} />
          </button>
          <button className={styles.arrow} disabled aria-label="Próximo">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className={styles.track}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonItem}>
              <div className={styles.skeletonCircle} />
              <div className={styles.skeletonLabel} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!loading && categories.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.emptyState}>
          <p>Nenhuma categoria encontrada</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.controls}>
        <button
          className={styles.arrow}
          onClick={() => scroll(-1)}
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className={styles.arrow}
          onClick={() => scroll(1)}
          aria-label="Próximo"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.track} ref={trackRef}>
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div
                className={`${styles.circle} ${isActive ? styles.circleActive : ""}`}
              >
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={100}
                    height={100}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>📷</span>
                  </div>
                )}
              </div>
              <span
                className={`${styles.label} ${isActive ? styles.labelActive : ""}`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}