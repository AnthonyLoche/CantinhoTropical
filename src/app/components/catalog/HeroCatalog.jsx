"use client";

import { Leaf, ShieldCheck, Truck } from "lucide-react";
import styles from "../../../assets/css/catalog/HeroCatalog.module.css";

const CARDS = [
  {
    icon: Leaf,
    title: "Compromisso Ético",
    text: "Trabalhamos apenas com marcas que respeitam a biodiversidade e utilizam ingredientes 100% naturais.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade Garantida",
    text: "Todos os produtos passam por curadoria rigorosa antes de chegarem ao nosso catálogo.",
  },
  {
    icon: Truck,
    title: "Entrega Especializada",
    text: "Embalagens pensadas para cada tipo de artigo",
  },
];

export default function HeroCatalog() {
  return (
    <header className={styles.hero}>
      <div className={styles.blur1} />
      <div className={styles.blur2} />

      <div className={styles.container}>

        {/* Left */}
        <div className={styles.left}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badgeLine} />
            <span className={styles.badge}>Loja Especializada</span>
          </div>
          <h1 className={styles.title}>Catálogo<br />Especializado</h1>
          <p className={styles.description}>
            Uma tratamento premium pensada para o bem-estar do seu santuário particular.
            De nutrição holística a acessórios sustentáveis para aves, répteis, peixes e pets tradicionais.
          </p>
        </div>

        {/* Right — cards */}
        <div className={styles.right}>
          {CARDS.map(({ icon: Icon, title, text }) => (
            <div key={title} className={styles.card}>
              <div className={styles.cardIcon}>
                <Icon size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardText}>{text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </header>
  );
}