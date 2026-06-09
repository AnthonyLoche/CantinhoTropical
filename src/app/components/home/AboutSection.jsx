"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, StarHalf, ArrowRight } from "lucide-react";
import styles from "../../../assets/css/home/AboutSection.module.css";
import { getTextContentAction } from "@/modules/text-content/actions/get-text-content.action";
import about from "@/assets/images/about.png";

export default function AboutSection() {
  const [content, setContent] = useState({
    aboutTitle: "Tradição e Especialização em Mafra",
    aboutDescription: "No Cantinho Tropical, acreditamos que cada animal merece um tratamento único. Com anos de experiência no coração de Mafra, oferecemos um atendimento personalizado e uma curadoria rigorosa de produtos que respeitam a natureza do seu companheiro.\n\nDesde aves exóticas a aquários complexos, a nossa equipa de especialistas está pronta para o aconselhar com o conhecimento técnico que o seu pet exige.",
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
          aboutTitle: result.data.aboutTitle || content.aboutTitle,
          aboutDescription: result.data.aboutDescription || content.aboutDescription,
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Separar a descrição em parágrafos (se vier com \n\n)
  const descriptionParagraphs = content.aboutDescription.split("\n\n");

  // Loading skeleton
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.imageWrapper}>
            <div className={styles.skeletonImage}></div>
            <div className={styles.skeletonRating}></div>
          </div>
          <div className={styles.content}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonButton}></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Image side */}
        <div className={styles.imageWrapper}>
          <div className={styles.glow} />
          <div className={styles.imageContainer}>
            <Image
              src={about}
              alt="Fachada Cantinho Tropical Mafra"
              width={800}
              height={600}
              className={styles.image}
              priority
            />
          </div>
          <div className={styles.ratingCard}>
            <div className={styles.stars}>
              <Star size={18} fill="#2c694e" color="#2c694e" />
              <Star size={18} fill="#2c694e" color="#2c694e" />
              <Star size={18} fill="#2c694e" color="#2c694e" />
              <Star size={18} fill="#2c694e" color="#2c694e" />
              <StarHalf size={18} fill="#2c694e" color="#2c694e" />
            </div>
            <p className={styles.ratingScore}>4.8★ no Google</p>
            <p className={styles.ratingCount}>Mais de 199 avaliações</p>
          </div>
        </div>

        {/* Text side */}
        <div className={styles.content}>
          <h2 className={styles.title}>{content.aboutTitle}</h2>
          {descriptionParagraphs.map((paragraph, index) => (
            <p key={index} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}