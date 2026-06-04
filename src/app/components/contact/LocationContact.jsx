"use client";

import { MapPin } from "lucide-react";
import styles from "../../../assets/css/contact/LocationContact.module.css";

export default function LocationContact() {
  const location = {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.3456789!2d-9.330!3d38.940!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a2b5c3d4e5f7%3A0x1234567890abcdef!2sR.%20das%20Laranjeiras%2C%202640-577%20Mafra%2C%20Portugal!5e0!3m2!1spt!2spt!4v1700000000000!5m2!1spt!2spt",
  };

  return (
    <section className={styles.section}>
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
    </section>
  );
}