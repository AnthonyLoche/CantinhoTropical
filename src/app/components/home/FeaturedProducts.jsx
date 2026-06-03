import Image from "next/image";
import styles from "../../../assets/css/home/FeaturedProducts.module.css";

const products = [
  {
    id: 1,
    badge: "Especial",
    badgeClass: "badgeDark",
    category: "Cães • Alimentação",
    name: "Ração Premium Holistic 12kg",
    price: "54,90€",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAvKjURStfh-WpJr4xqy1QLH3gKINCbZGY52foJvMWgnc8FurNJWAvXT4iLwZxUggiwILTqqSRrqQehhUJ0ayVMpIIG7ZFQQqpk_kWySUmuDVpTo9wLbkoFf-MrFVV-BWPLKMYqJ1apy_BR__u4saUkNmGIg3LL2vSXXOYUWnqjOxhS5gIRjs9oFiscxuQe-tyFAn3dPMB_r4wZQay06HLEp7-XLlMrOz3sEWYzRInHhNR28iTDjYNNhXB65rHGK8kL2W3kjZZX6Y",
  },
  {
    id: 2,
    badge: "Novo",
    badgeClass: "badgeGreen",
    category: "Aves • Acessórios",
    name: "Brinquedo Natural de Corda",
    price: "12,50€",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTxCkNOoo6SjghpeVoXBhHt9r__TI2lwelL7Ijv4S2jwSj3G1mV7UqBd3KQykkCZTaydR8iAYbFo7CfMJY-zfjGbDs48R2axaxJFhYs46kF36M4DD_H1dPxuARi5EE8HG7MuxwvtpW5ikAjeLgA0OXd0vgMbbQ8ftmMQ9LtdrHN3Z_885_gtYwrO_8bDsE9l3KU20g5P7xfF2v69sllgfwzQOnCvE1RQRuKkRlRGNfOO_CojZOe25r5-Kepf1vGMN5wkxVaOoiT9U",
  },
  {
    id: 3,
    category: "Aquariofilia • Tecnologia",
    name: "Filtro Externo Pro Silent",
    price: "89,00€",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDEjPfVILM9CnBzks6xsp2E4mYgoFMhB0J9kSwm4zhFCQv2XLDvJyeIjXnV4HmvPE33NHyw47NOV8_Zs4PncKUG3u2LjbufZp1hbF3xVFoG8Lz2633eQe98aGFaRf0PjuxEw_Jc67ZxEbOvK6zu5JZaxBUjJvJCdVXfuXO4HP9KToVfIsSVgQ9uytN5PO4mKdRH0ErtWp9Js5JLPeU10IzV91_rhjDYCYuurTifz1dbMo3m6BaOTVh9La_ZQ9ACmRiDF2pbmB8ovc",
  },
  {
    id: 4,
    category: "Cães • Passeio",
    name: "Coleira em Pele Genuína",
    price: "29,90€",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsqFzGXIpyGZf8BQlhqE6AkU8Scyyn-P5vWSWFbxgs5TwXYJ2-jfbCSnq1lpZ0aRTbxJteBz0iTDDXfGz5_yHgSU06aPfpBuYOdmpJGO9pxJlyuOV4YY9nb2o1u1jiTSPPkW2x-plVqEmw8VQAEgdMM-TeWdVSHCkioAETRuDA5mzU2EgfrFPtVaJqwOAJgUqAf3Rz6Sec2lcTi_fEmLndeNacc1x_EuBcqrPZ-gDYq9zncuhbNYNFhXPrlzt-RUjGuwK9PO0yGwI",
  },
];

export default function FeaturedProducts() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Destaques da Estação</h2>
          <p className={styles.subtitle}>
            Produtos selecionados para o bem-estar do seu pet.
          </p>
        </div>
        <button className={styles.viewAll}>Ver tudo</button>
      </div>

      <div className={styles.grid}>
        {products.map(({ id, badge, badgeClass, category, name, price, src }) => (
          <div key={id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageContainer}>
                <Image
                  src={src}
                  alt={name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              {badge && (
                <span className={`${styles.badge} ${styles[badgeClass]}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className={styles.category}>{category}</p>
            <h4 className={styles.name}>{name}</h4>
            <div className={styles.footer}>
              <span className={styles.price}>{price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}