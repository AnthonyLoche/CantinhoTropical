"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../../assets/css/home/PetHotelSection.module.css";
import { getTextContentAction } from "@/modules/text-content/actions/get-text-content.action";
import pet_hotel from "@/assets/images/pethotel.jpeg"

export default function PetHotelSection() {
  const [content, setContent] = useState({
    petHotelChip: "Férias Tranquilas",
    petHotelTitle: "Vai viajar? Nós cuidamos do seu companheiro.",
    petHotelDescription: "O nosso Pet Hotel oferece um ambiente de luxo e segurança, onde o seu amigo terá atenção constante, alimentação premium e muito carinho. O santuário perfeito enquanto está fora.",
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
          petHotelChip: result.data.petHotelChip || content.petHotelChip,
          petHotelTitle: result.data.petHotelTitle || content.petHotelTitle,
          petHotelDescription: result.data.petHotelDescription || content.petHotelDescription,
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "351915290212";
    const message = encodeURIComponent("Olá, vim pelo site e gostaria de mais informações sobre o pet hotel");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.backgroundOverlay}>
          <div className={styles.skeletonTexture}></div>
        </div>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <div className={styles.skeletonImage}></div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.skeletonBadge}></div>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonButton}></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.backgroundOverlay}>
        <Image
          src={pet_hotel}
          alt="Pet Hotel Texture"
          fill
          className={styles.textureImage}
          sizes="100vw"
        />
      </div>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageContainer}>
              <Image
                src={pet_hotel}
                alt="Pet Hotel Room"
                fill
                className={styles.hotelImage}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className={styles.content}>
            <span className={styles.badge}>{content.petHotelChip}</span>
            <h2 className={styles.title}>{content.petHotelTitle}</h2>
            <p className={styles.text}>{content.petHotelDescription}</p>
            <button className={styles.button} onClick={handleWhatsAppClick}>
              Saber Mais sobre o Hotel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}