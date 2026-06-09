"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../../assets/css/home/CategoryGrid.module.css";
import { getTextContentAction } from "@/modules/text-content/actions/get-text-content.action";
import aves from "@/assets/images/hero/aves.jpg";
import cao from "@/assets/images/hero/cao.jpg";
import gato from "@/assets/images/hero/gato.jpg";
import peixes from "@/assets/images/hero/peixes.jpg";
import reptil from "@/assets/images/hero/reptil.jpg";
import hamster from "@/assets/images/hero/hamster.webp";

const categories = [
  { col: "col4", src: gato, label: "Gatos" },
  { col: "col5", src: cao, label: "Cães" },
  { col: "col3", src: aves, label: "Aves" },
  { col: "col3", src: hamster, label: "Roedores" },
  { col: "col6", src: peixes, label: "Aquariofilia" },
  { col: "col3", src: reptil, label: "Répteis" },
];

export default function CategoryGrid() {
  const [content, setContent] = useState({
    categoriesTitle: "Explore a nossa Biodiversidade",
    categoriesDescription: "Tratamos de todas as especialidades com dedicação e conhecimento técnico, garantindo o melhor para cada espécie, desde as mais comuns às mais exóticas.",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const result = await getTextContentAction();
      if (result.success && result.data) {
        setContent({
          categoriesTitle: result.data.categoriesTitle || content.categoriesTitle,
          categoriesDescription: result.data.categoriesDescription || content.categoriesDescription,
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
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

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{content.categoriesTitle}</h2>
        <p className={styles.subtitle}>
          {content.categoriesDescription}
        </p>
        <div className={styles.divider} />
      </div>

      <div className={styles.grid}>
        {categories.map(({ col, src, label }) => (
          <div key={label} className={`${styles.card} ${styles[col]}`}>
            <div className={styles.cardImageWrapper}>
              <Image
                src={src}
                alt={label}
                fill
                className={styles.cardImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardLabel}>{label}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}