import Image from "next/image";
import styles from "../../../assets/css/home/HeroMain.module.css";
import hero_bg from "../../../assets/images/HeroBg.png";

export default function HeroMain() {
  return (
    <section className={styles.section}>
      <div className={styles.imageWrapper}>
        <Image
          src={hero_bg}
          alt="Tropical Sanctuary Hero"
          fill
          className={styles.image}
          priority
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <h1 className={styles.title}>
            Tudo o que o seu animal precisa, num só lugar.
          </h1>
          <p className={styles.subtitle}>
            Especialistas em alimentação, acessórios, aves exóticas, aquariofilia, roedores, répteis e muito mais.
          </p>
          <div className={styles.buttons}>
            <button className={styles.btnPrimary}>Explorar Catálogo</button>
            <button className={styles.btnSecondary}>Falar no WhatsApp</button>
          </div>
        </div>
      </div>
    </section>
  );
}