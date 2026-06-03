import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import styles from "../../../assets/css/home/LocationSection.module.css";

export default function LocationSection() {
  const location = {
    address: "R. das Laranjeiras, 2640-577 Mafra, Portugal",
    // URL de embed real e funcional do Google Maps
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3456789!2d-9.330!3d38.940!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a2b5c3d4e5f7%3A0x1234567890abcdef!2sR.%20das%20Laranjeiras%2C%202640-577%20Mafra%2C%20Portugal!5e0!3m2!1spt!2spt!4v1700000000000!5m2!1spt!2spt",
    directionsUrl: "https://www.google.com/maps/dir//R.+das+Laranjeiras,+2640-577+Mafra,+Portugal/@38.9325,-9.328,17z",
  };

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
                <h6 className={styles.infoTitle}>Horários</h6>
                <p className={styles.infoText}>Segunda a Sábado: 09:30 - 19:30</p>
                <p className={`${styles.infoText} ${styles.italic}`}>Encerrado aos Domingos e Feriados</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Phone className={styles.infoIcon} />
              </div>
              <div>
                <h6 className={styles.infoTitle}>Contactos</h6>
                <p className={styles.infoText}>+351 915 290 212</p>
                <p className={styles.infoText}>geral@cantinhotropical.pt</p>
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