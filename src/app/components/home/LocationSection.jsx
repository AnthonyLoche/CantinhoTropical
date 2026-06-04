"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import styles from "../../../assets/css/home/LocationSection.module.css";

export default function LocationSection() {
  const [todayHours, setTodayHours] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const location = {
    address: "R. das Laranjeiras, 2640-577 Mafra, Portugal",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3456789!2d-9.330!3d38.940!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a2b5c3d4e5f7%3A0x1234567890abcdef!2sR.%20das%20Laranjeiras%2C%202640-577%20Mafra%2C%20Portugal!5e0!3m2!1spt!2spt!4v1700000000000!5m2!1spt!2spt",
    directionsUrl: "https://www.google.com/maps/dir//R.+das+Laranjeiras,+2640-577+Mafra,+Portugal/@38.9325,-9.328,17z",
  };

  // Horário de funcionamento
  const schedule = {
    "Segunda-feira": { morning: "10:00–13:00", afternoon: "15:00–20:00" },
    "Terça-feira": { morning: "10:00–13:00", afternoon: "15:00–20:00" },
    "Quarta-feira": { morning: "10:00–13:00", afternoon: "15:00–20:00" },
    "Quinta-feira": { morning: "10:00–13:00", afternoon: null},
    "Sexta-feira": { morning: "10:00–13:00", afternoon: "15:00–20:00" },
    "Sábado": { morning: "10:00–13:00", afternoon: "15:00–20:00" },
    "Domingo": { morning: "10:00–13:00", afternoon: null },
  };

  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  // Função para verificar se está aberto agora
  const checkIfOpen = () => {
    const now = new Date();
    const dayName = days[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    const daySchedule = schedule[dayName];
    if (!daySchedule) return false;

    const morningStart = 10;
    const morningEnd = 13;
    const afternoonStart = 15;
    const afternoonEnd = 20;

    const isMorningOpen = currentTime >= morningStart && currentTime <= morningEnd;
    const isAfternoonOpen = daySchedule.afternoon && currentTime >= afternoonStart && currentTime <= afternoonEnd;

    return isMorningOpen || isAfternoonOpen;
  };

  // Função para obter o horário de hoje
  const getTodayHours = () => {
    const now = new Date();
    const dayName = days[now.getDay()];
    const daySchedule = schedule[dayName];
    
    if (!daySchedule) return "Horário indisponível";
    
    if (daySchedule.afternoon) {
      return `${daySchedule.morning} / ${daySchedule.afternoon}`;
    }
    return daySchedule.morning;
  };

  // Função para obter a nota especial do dia (se houver)
  const getTodayNote = () => {
    const now = new Date();
    const dayName = days[now.getDay()];
    return schedule[dayName]?.note || null;
  };

  useEffect(() => {
    const updateStatus = () => {
      setTodayHours(getTodayHours());
      setIsOpen(checkIfOpen());
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Atualiza a cada minuto
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.mapWrapper}>
          <iframe
            src={location.embedUrl}
            className={styles.mapIframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa do Cantinho Tropical - Mafra"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Visite o nosso refúgio</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <MapPin className={styles.infoIcon} />
              </div>
              <div>
                <h6 className={styles.infoTitle}>Localização</h6>
                <p className={styles.infoText}>Rua das Laranjeiras, 2640-577 Mafra, Portugal</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Clock className={styles.infoIcon} />
              </div>
              <div>
                <h6 className={styles.infoTitle}>Horário de Funcionamento</h6>
                <div className={styles.scheduleTable}>
                  <div className={styles.scheduleRow}>
                    <span className={styles.scheduleDay}>Segunda - Sexta:</span>
                    <span className={styles.scheduleHours}>10:00 - 13:00 / 15:00 - 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.scheduleDay}>Sábado:</span>
                    <span className={styles.scheduleHours}>10:00 - 13:00 / 15:00 - 20:00</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span className={styles.scheduleDay}>Domingo:</span>
                    <span className={styles.scheduleHours}>10:00 - 13:00</span>
                  </div>
                  <div className={styles.scheduleDivider} />
                </div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Phone className={styles.infoIcon} />
              </div>
              <div>
                <h6 className={styles.infoTitle}>Contactos</h6>
                <p className={styles.infoText}>+351 915 290 212</p>
              </div>
            </div>
          </div>
          <a 
            href={location.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            <MapPin className={styles.buttonIcon} />
            <span>Obter Direções</span>
            <ExternalLink className={styles.externalIcon} />
          </a>
        </div>
      </div>
    </section>
  );
}   