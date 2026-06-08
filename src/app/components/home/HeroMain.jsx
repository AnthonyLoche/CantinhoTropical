"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ShoppingBag, MessageCircle, ShieldCheck, Users, Star, ChevronRight, Leaf } from "lucide-react";
import styles from "../../../assets/css/home/HeroMain.module.css";
import logo from "@/assets/images/logo.png";
import heroBg from "@/assets/images/hero-bg.png";
import aves from "@/assets/images/hero/aves.jpg";
import cao from "@/assets/images/hero/cao.jpg";
import gato from "@/assets/images/hero/gato.jpg";
import peixes from "@/assets/images/hero/peixes.jpg";
import reptil from "@/assets/images/hero/reptil.jpg";
import hamster from "@/assets/images/hero/hamster.webp";

const SLIDES = [
  {
    id: 1,
    image: cao,
    label: "Cães e Gatos"
  },
  {
    id: 2,
    image: reptil,
    label: "Répteis"
  },
  {
    id: 3,
    image: aves,
    label: "Aves Exóticas"
  },
  {
    id: 4,
    image: hamster,
    label: "Roedores"
  },
  {
    id: 5,
    image: peixes,
    label: "Aquariofilia"
  },
  {
    id: 5,
    image: gato,
    label: "Gatos"
  },
];

const AVATARS = [
  "/images/avatars/avatar1.jpg",
  "/images/avatars/avatar2.jpg",
  "/images/avatars/avatar3.jpg",
];

export default function HeroMain() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className={styles.section}>
      {/* Background Image */}
      <div className={styles.background}>
        <Image
          src={heroBg}
          alt="Background"
          fill
          className={styles.backgroundImage}
          priority
          quality={100}
        />
      </div>

      <div className={styles.container}>
      {/* LEFT — conteúdo */}
      <div className={styles.left}>

        {/* Badge */}
        <div className={styles.badge}>
          <Leaf size={14} />
          Há mais de 20 anos cuidando dos seus animais
        </div>

        {/* Título */}
        <h1 className={styles.title}>
          Tudo para o seu pet,{" "}
          <span className={styles.titleLine2}>aquário e</span>{" "}
          <span className={styles.titleHighlight}>
            animais exóticos.
            <span className={styles.leaf} aria-hidden>🌿</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className={styles.subtitle}>
          Alimentação, acessórios, medicamentos, aquariofilia, aves, roedores, répteis
          e muito mais para o bem-estar do seu melhor amigo.
        </p>

        {/* Botões */}
        <div className={styles.buttons}>
          <button className={styles.btnPrimary}>
            <ShoppingBag size={18} />
            Explorar Catálogo
          </button>
          <button className={styles.btnSecondary}>
            <MessageCircle size={18} />
            Falar no WhatsApp
          </button>
        </div>

        {/* Trust indicators */}
        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <ShieldCheck size={20} className={styles.trustIcon} />
            <span>Produtos<br />selecionados</span>
          </div>
          <div className={styles.trustItem}>
            <Users size={20} className={styles.trustIcon} />
            <span>Atendimento<br />especializado</span>
          </div>
          <div className={styles.trustItem}>
            <Star size={20} className={styles.trustIcon} />
            <span>Mais de 20 anos<br />de experiência</span>
          </div>
        </div>

      </div>

      {/* RIGHT — carrossel */}
      <div className={styles.right}>
        <div className={styles.carousel}>

          {/* Slides */}
          {SLIDES.map((slide, i) => {
            const offset = (i - current + SLIDES.length) % SLIDES.length;
            return (
              <div
                key={slide.id}
                className={`${styles.slide} ${
                  offset === 0 ? styles.slideFront :
                  offset === 1 ? styles.slideNext :
                  offset === SLIDES.length - 1 ? styles.slidePrev :
                  styles.slideHidden
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.label}
                  fill
                  className={styles.slideImage}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                />
                <div className={styles.slideLabel}>
                  {slide.label}
                </div>
              </div>
            );
          })}

          {/* Botão next */}
          <button className={styles.nextBtn} onClick={next} aria-label="Próximo">
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}