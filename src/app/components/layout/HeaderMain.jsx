"use client";

import { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart } from "lucide-react";
import styles from "../../../assets/css/ui/Header.module.css";
import logo_removed from "../../../assets/images/logo_removedbg.png";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Image
          src={logo_removed}
          alt="Cantinho Tropical Logo"
          width={74}
          height={74}
        />
        <span className={styles.logoText}>Cantinho Tropical</span>
      </div>

      <nav className={styles.nav}>
        <a href="#" className={styles.navLinkActive}>
          Home
        </a>
        <a href="#" className={styles.navLink}>
          Catálogo
        </a>
        <a href="#" className={styles.navLink}>
          Sobre Nós
        </a>
        <a href="#" className={styles.navLink}>
          Serviços
        </a>
        <a href="#" className={styles.navLink}>
          Contacto
        </a>
      </nav>

      <div className={styles.actions}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
          />
          <button className={styles.searchBtn}>
            <Search size={16} />
          </button>
        </div>

        <div className={styles.iconBtn}>
          <Heart size={22} />
          <span className={styles.badge}>0</span>
        </div>

        <div className={styles.iconBtn}>
          <ShoppingCart size={22} />
          <span className={styles.badge}>0</span>
        </div>
      </div>
    </header>
  );
}
