"use client";

import { useRef, useState } from "react";
import styles from "../../../assets/css/catalog/CategoriesCatalog.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import logo_removed from "../../../assets/images/logo_removedbg.png";

const CATEGORIES = [
  { id: 1, name: "Répteis",      image: logo_removed      },
  { id: 2, name: "Aves Exóticas",image: logo_removed         },
  { id: 3, name: "Roedores",     image: logo_removed     },
  { id: 4, name: "Cães",         image: logo_removed         },
  { id: 5, name: "Gatos",        image: logo_removed        },
  { id: 6, name: "Aquariofilia", image: logo_removed },
  { id: 7, name: "Alimentação",  image: logo_removed  },
];

export default function CategorySlider({ categories = CATEGORIES }) {
  const trackRef = useRef(null);
  const [activeId, setActiveId] = useState(categories[0]?.id ?? null);

  const ITEM_WIDTH = 140;

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * ITEM_WIDTH * 2, behavior: "smooth" });
  };

  return (
    <section className={styles.section}>
      <div className={styles.controls}>
        <button className={styles.arrow} onClick={() => scroll(-1)} aria-label="Anterior">
          <ChevronLeft size={20} />
        </button>
        <button className={styles.arrow} onClick={() => scroll(1)} aria-label="Próximo">
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
              onClick={() => setActiveId(cat.id)}
            >
              <div className={`${styles.circle} ${isActive ? styles.circleActive : ""}`}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className={styles.image}
                />
              </div>
              <span className={`${styles.label} ${isActive ? styles.labelActive : ""}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}