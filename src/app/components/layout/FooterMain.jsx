import Link from "next/link";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import styles from "../../../assets/css/ui/Footer.module.css";
import Image from "next/image";
import logo_removed from "../../../assets/images/logo_removedbg.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Image
                src={logo_removed}
                alt="Cantinho Tropical Logo"
                width={74}
                height={74}
              />
              <span className={styles.brandName}>Cantinho Tropical</span>
            </div>
            <p className={styles.brandText}>
              O seu parceiro de confiança para o bem-estar animal em Mafra.
              Especialistas em todas as espécies, do doméstico ao exótico.
            </p>
            <div className={styles.social}>
              {/* Facebook SVG */}
              <a
                href="https://www.facebook.com/CantinhoTropicalPetshop"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram SVG */}
              <a
                href="https://www.instagram.com/cantinhotropicalpetshop/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428-.047-1.066-.06-1.405-.06-4.122 0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h6 className={styles.linkTitle}>Links Rápidos</h6>
            <ul className={styles.linkList}>
              <li>
                <Link href="/catalog">Categorias</Link>
              </li>
              <li>
                <Link href="/about">Sobre Nós</Link>
              </li>
              <li>
                <Link href="/catalog">Produtos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className={styles.linkTitle}>Suporte</h6>
            <ul className={styles.linkList}>
              <li>
                <Link href="/terms">Termos e Condições</Link>
              </li>
              <li>
                <Link href="/privacy">Privacidade</Link>
              </li>
              <li>
                <Link href="/contact">Contactos</Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className={styles.linkTitle}>Apoio ao Cliente</h6>
            <ul className={styles.linkList}>
              <li>
                <a href="tel:+351915290212">+351 915 290 212</a>
                <p style={{ color: "gray", fontSize: "0.9rem" }}>
                  (Chamada para rede-móvel nacional)
                </p>
              </li>
              <li>
                <a href="mailto:info@cantinhotropical.pt">cantinhotropicalpetshop@gmail.com</a>
              </li>
              <li>
                <address style={{ fontStyle: "normal" }}>
                  Rua das Laranjeiras
                  <br />
                  2640-577 Mafra, Portugal
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2024 Cantinho Tropical Petshop - Mafra. Todos os direitos
            reservados.
          </p>
          <a
            className={styles.copyright}
            href="https://my-portfolio-anthonygabriel.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Desenvolvido por Anthony Gabriel
          </a>
        </div>
      </div>
    </footer>
  );
}
