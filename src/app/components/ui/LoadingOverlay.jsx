"use client";

import Image from "next/image";
import styles from "@/assets/css/ui/LoadingOverlay.module.css";
import logo from "@/assets/images/logo_removedbg.png";

export default function LoadingOverlay({ isLoading, message = "Carregando..." }) {
  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoWrapper}>
          <Image
            src={logo}
            alt="Cantinho Tropical"
            width={72}
            height={72}
            className={styles.logo}
          />
        </div>

        {/* Nome */}
        <div className={styles.brand}>
          <span className={styles.brandName}>Cantinho Tropical</span>
          <span className={styles.brandSub}>Pet Shop</span>
        </div>

        {/* Barra de progresso animada */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>

        {/* Mensagem */}
        <p className={styles.message}>{message}</p>

      </div>
    </div>
  );
}