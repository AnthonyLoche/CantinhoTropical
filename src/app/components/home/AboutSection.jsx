import Image from "next/image";
import { Star, StarHalf, ArrowRight } from "lucide-react";
import styles from "../../../assets/css/home/AboutSection.module.css";
import about from "@/assets/images/about.png";

export default function AboutSection() {
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
          <h2 className={styles.title}>Tradição e Especialização em Mafra</h2>
          <p className={styles.text}>
            No Cantinho Tropical, acreditamos que cada animal merece um
            tratamento único. Com anos de experiência no coração de Mafra,
            oferecemos um atendimento personalizado e uma curadoria rigorosa de
            produtos que respeitam a natureza do seu companheiro.
          </p>
          <p className={styles.text}>
            Desde aves exóticas a aquários complexos, a nossa equipa de
            especialistas está pronta para o aconselhar com o conhecimento
            técnico que o seu pet exige.
          </p>
          <button className={styles.link}>
            <span>Conheça a nossa história</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
