import { Brain, Package, Leaf, Hotel, Truck } from "lucide-react";
import styles from "../../../assets/css/home/FeaturesSection.module.css";

const features = [
  { icon: Brain, title: "Atendimento Especializado", desc: "Consultoria técnica para cada espécie." },
  { icon: Package, title: "Grande Variedade", desc: "Marcas líderes e produtos exclusivos." },
  { icon: Leaf, title: "Animais Exóticos", desc: "Referência nacional em aves e répteis." },
  { icon: Hotel, title: "Pet Hotel", desc: "Alojamento seguro e confortável." },
  { icon: Truck, title: "Entrega ao Domicílio", desc: "Rápido e cómodo na zona de Mafra." },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className={styles.card}>
            <div className={styles.iconWrapper}>
              <Icon className={styles.icon} />
            </div>
            <h5 className={styles.title}>{title}</h5>
            <p className={styles.desc}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}