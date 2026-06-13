"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../../assets/css/home/CategoryGrid.module.css";
import { getTextContentAction } from "@/modules/text-content/actions/get-text-content.action";
import { getCategoriesAction } from "@/modules/categories/actions/get-categories.action";
import aves from "@/assets/images/hero/aves.jpg";
import cao from "@/assets/images/hero/cao.jpg";
import gato from "@/assets/images/hero/gato.jpg";
import peixes from "@/assets/images/hero/peixes.jpg";
import reptil from "@/assets/images/hero/reptil.jpg";
import hamster from "@/assets/images/hero/hamster.webp";

const categoryImageMap = {
  "Cães": cao,
  "Gatos": gato,
  "Aves": aves,
  "Roedores": hamster,
  "Aquariofilia": peixes,
  "Répteis": reptil,
};

// Spans sempre somam certo para cada quantidade
const GRID_CONFIGS = {
  1: { cols: "1fr",                 spans: [1] },
  2: { cols: "repeat(2, 1fr)",      spans: [1, 1] },
  3: { cols: "repeat(3, 1fr)",      spans: [1, 1, 1] },
  4: { cols: "repeat(2, 1fr)",      spans: [1, 1, 1, 1] },
  5: { cols: "repeat(12, 1fr)",     spans: [4, 4, 4, 6, 6] },
  6: { cols: "repeat(12, 1fr)",     spans: [4, 4, 4, 4, 4, 4] },
  7: { cols: "repeat(12, 1fr)",     spans: [4, 4, 4, 3, 3, 3, 3] },
  8: { cols: "repeat(4, 1fr)",      spans: [1, 1, 1, 1, 1, 1, 1, 1] },
};

export default function CategoryGrid() {
  const [content, setContent] = useState({
    categoriesTitle: "Explore a nossa Biodiversidade",
    categoriesDescription:
      "Tratamos de todas as especialidades com dedicação e conhecimento técnico, garantindo o melhor para cada espécie, desde as mais comuns às mais exóticas.",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentAndCategories();
  }, []);

  const fetchContentAndCategories = async () => {
    try {
      const [textContentResult, categoriesResult] = await Promise.all([
        getTextContentAction(),
        getCategoriesAction(),
      ]);

      if (textContentResult.success && textContentResult.data) {
        setContent({
          categoriesTitle:
            textContentResult.data.categoriesTitle || content.categoriesTitle,
          categoriesDescription:
            textContentResult.data.categoriesDescription ||
            content.categoriesDescription,
        });
      }

      if (categoriesResult.success && categoriesResult.data.length > 0) {
        setCategories(categoriesResult.data);
      } else {
        setCategories([
          { id: "1", name: "Gatos" },
          { id: "2", name: "Cães" },
          { id: "3", name: "Aves" },
          { id: "4", name: "Roedores" },
          { id: "5", name: "Aquariofilia" },
          { id: "6", name: "Répteis" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.heading}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonSubtitle}></div>
          <div className={styles.skeletonDivider}></div>
        </div>
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
              <div className={styles.cardImageWrapper}>
                <div className={styles.skeletonImage}></div>
              </div>
              <div className={styles.cardOverlay}>
                <div className={styles.skeletonLabel}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const n = categories.length;
  const config = GRID_CONFIGS[n] ?? { cols: "repeat(3, 1fr)", spans: [] };

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{content.categoriesTitle}</h2>
        <p className={styles.subtitle}>{content.categoriesDescription}</p>
        <div className={styles.divider} />
      </div>

      <div
        className={styles.grid}
        style={{ "--grid-cols-desktop": config.cols }}
      >
        {categories.map((category, index) => {
          const span = config.spans[index] ?? 1;
          const localImage = categoryImageMap[category.name];

          return (
            <Link
              href={`/catalog?category=${encodeURIComponent(category.name)}`}
              key={category.id}
              className={styles.card}
              style={{ "--card-span": span }}
            >
              <div className={styles.cardImageWrapper}>
                {localImage && (
                  <Image
                    src={localImage}
                    alt={category.name}
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                )}
              </div>
              <div className={styles.cardOverlay}>
                <h3 className={styles.cardLabel}>{category.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}