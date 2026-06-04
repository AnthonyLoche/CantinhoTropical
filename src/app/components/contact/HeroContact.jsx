"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, MapPin, Clock, PawPrint } from "lucide-react";
import styles from "../../../assets/css/contact/HeroContact.module.css";

export default function HeroContact() {
  const [todayHours, setTodayHours] = useState("");

  // Função para pegar o horário do dia atual
  const getTodayHours = () => {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    const schedule = {
      "Segunda-feira": "10:00–13:00, 15:00–20:00",
      "Terça-feira": "10:00–13:00, 15:00–20:00",
      "Quarta-feira": "10:00–13:00, 15:00–20:00",
      "Quinta-feira": "10:00–13:00, 15:00–20:00",
      "Sexta-feira": "10:00–13:00, 15:00–20:00",
      Sábado: "10:00–13:00, 15:00–20:00",
      Domingo: "10:00–13:00",
    };

    const today = new Date();
    const dayName = days[today.getDay()];
    const hours = schedule[dayName];

    // Verifica se está aberto agora
    const isOpen = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = currentHour + currentMinute / 60;

      if (dayName === "Domingo") {
        // Domingo: 10:00 - 13:00
        return currentTime >= 10 && currentTime <= 13;
      } else {
        // Dias úteis e sábado: manhã 10-13, tarde 15-20
        const isMorningOpen = currentTime >= 10 && currentTime <= 13;
        const isAfternoonOpen = currentTime >= 15 && currentTime <= 20;
        return isMorningOpen || isAfternoonOpen;
      }
    };

    const openStatus = isOpen();
    const statusText = openStatus ? "Aberto agora" : "Fechado agora";
    const statusClass = openStatus ? "open" : "closed";

    return { hours, statusText, statusClass, dayName };
  };

  useEffect(() => {
    const updateHours = () => {
      const { hours, statusText, statusClass, dayName } = getTodayHours();
      setTodayHours({ hours, statusText, statusClass, dayName });
    };

    updateHours();
    // Atualiza a cada minuto para verificar status
    const interval = setInterval(updateHours, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Elementos decorativos de fundo */}
      <div className={styles.patternDots}></div>
      <div className={styles.leafDecoration1}></div>
      <div className={styles.leafDecoration2}></div>

      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Fale Connosco
          </span>
          <h1 className={styles.title}>
            Estamos aqui para cuidar do{" "}
            <span className={styles.highlight}>seu companheiro</span>
          </h1>
          <p className={styles.description}>
            Se animais pudessem falar, eles falariam de nós! Entre em contacto
            para saber mais sobre os nossos serviços de hotel e produtos
            exclusivos.
          </p>

          {/* Cards de info rápidos */}
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <Phone size={18} />
              </div>
              <div>
                <p className={styles.infoCardLabel}>Ligue-nos</p>
                <p className={styles.infoCardValue}>+351 915 290 212</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <MapPin size={18} />
              </div>
              <div>
                <p className={styles.infoCardLabel}>Visite-nos</p>
                <p className={styles.infoCardValue}>Mafra, Portugal</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>
                <Clock size={18} />
              </div>
              <div>
                <p className={styles.infoCardLabel}>Horário de hoje</p>
                <p className={styles.infoCardValue}>
                  {todayHours && (
                    <>
                      {todayHours.dayName}: {todayHours.hours}
                      <span
                        className={`${styles.statusBadge} ${styles[todayHours.statusClass]}`}
                      >
                        {todayHours.statusText}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Botões CTA */}
          <div className={styles.buttons}>
            <button className={styles.btnPrimary}>
              Enviar Mensagem
              <span className={styles.btnArrow}>→</span>
            </button>
            <button className={styles.btnWhatsapp}>
              <span className={styles.whatsappIcon}>💬</span>
              WhatsApp
            </button>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          {/* Abstract Background Shapes */}
          <div className={styles.shapeBg1}></div>
          <div className={styles.shapeBg2}></div>
          <div className={styles.shapeBg3}></div>

          <div className={styles.imageContainer}>
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv0Bka1dbOxkMxy36EjPQSvdi5nAiT4oQ8KLKTqUFFeOxqCzdMqhbInerfjl1j9e6sQPMaJCUE--BUh-G_UG5YIROuXdAZFFrAL-pMSZ9RjYYHVQVQVZdhXHt4e4zvhBd8uMEzHT4-fI-gL_WvLKpPa1-mJETAoREUap6Sp5vfk2oZH8g_Pm4_bbQxZpT8wAohAsV5796hyC3Jsr-zAbqPsRhuJeQcCAtFG_oeiyfAsNWlh5VE0gP4IlcjeuJKX6fEG7Qy23Tvw3k"
              alt="Professional pet care setting"
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Decorative Badge */}
          <div className={styles.decorativeBadge}>
            <PawPrint color="white" />
          </div>

          {/* Floating Card */}
          <div className={styles.floatingCard}>
            <div className={styles.floatingStars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.star}>
                  ★
                </span>
              ))}
            </div>
            <p className={styles.floatingText}>Atendimento 5 estrelas!</p>
            <p className={styles.floatingAuthor}>— Cliente satisfeito</p>
          </div>
        </div>
      </div>
    </section>
  );
}
