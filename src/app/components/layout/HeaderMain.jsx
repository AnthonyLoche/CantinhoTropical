"use client";

import { useState, useEffect } from "react";
import { LogIn, LayoutDashboard, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/app/components/cart/CartDrawer";
import SearchBar from "@/app/components/ui/SearchBar";
import styles from "../../../assets/css/ui/Header.module.css";
import logo_removed from "../../../assets/images/logo_removedbg.png";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Catálogo" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.mainBar}>
          <Link href="/" className={styles.logo}>
            <Image
              src={logo_removed}
              alt="Cantinho Tropical Logo"
              width={74}
              height={74}
            />
            <span className={styles.logoText}>Cantinho Tropical</span>
          </Link>

          <nav className={styles.nav}>
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={isActive ? styles.navLinkActive : styles.navLink}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <SearchBar />

            <button className={styles.cartBtn} onClick={openDrawer}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </button>

            {isAuthenticated ? (
              <Link href="/admin/dashboard" className={styles.adminBtn}>
                <LayoutDashboard size={18} />
                <span>Admin</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                <LogIn size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}