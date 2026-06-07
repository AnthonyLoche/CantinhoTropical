"use client";

import styles from "@/assets/css/ui/LoadingOverlay.module.css";

export default function LoadingOverlay({ isLoading, message = "Carregando..." }) {
  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Logo animado */}
        <div className={styles.logoWrapper}>
          <div className={styles.pawPrint}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2C12 2 8 6 8 10C8 13.5 10 15 12 15C14 15 16 13.5 16 10C16 6 12 2 12 2Z" 
                fill="currentColor"
              />
              <path 
                d="M5 8C5 8 3 10 3 12C3 14 4.5 15 6 15C7.5 15 9 13.5 9 12C9 10 7 8 5 8Z" 
                fill="currentColor"
              />
              <path 
                d="M19 8C19 8 17 10 17 12C17 14 18.5 15 20 15C21.5 15 23 13.5 23 12C23 10 21 8 19 8Z" 
                fill="currentColor"
              />
              <path 
                d="M7 17C7 17 5 19 5 21C5 22 6 23 7 23C8 23 10 22 10 21C10 19 8 17 7 17Z" 
                fill="currentColor"
              />
              <path 
                d="M17 17C17 17 15 19 15 21C15 22 16 23 17 23C18 23 20 22 20 21C20 19 18 17 17 17Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <div className={styles.logoText}>Cantinho Tropical</div>
        </div>

        {/* Spinner */}
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Mensagem */}
        <p className={styles.message}>{message}</p>

        {/* Bolhas decorativas */}
        <div className={`${styles.bubble} ${styles.bubble1}`}></div>
        <div className={`${styles.bubble} ${styles.bubble2}`}></div>
        <div className={`${styles.bubble} ${styles.bubble3}`}></div>
        <div className={`${styles.bubble} ${styles.bubble4}`}></div>
        <div className={`${styles.bubble} ${styles.bubble5}`}></div>
      </div>
    </div>
  );
}