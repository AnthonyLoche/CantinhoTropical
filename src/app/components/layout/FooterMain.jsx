import { Share2, CreditCard, Landmark, Wallet } from "lucide-react";
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
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Share2 size={20} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Compartilhar">
                <Share2 size={20} />
              </a>
            </div>
          </div>
          <div>
            <h6 className={styles.linkTitle}>Links Rápidos</h6>
            <ul className={styles.linkList}>
              <li>
                <a href="#">Categorias</a>
              </li>
              <li>
                <a href="#">Sobre Nós</a>
              </li>
              <li>
                <a href="#">Pet Hotel</a>
              </li>
              <li>
                <a href="#">Produtos</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className={styles.linkTitle}>Suporte</h6>
            <ul className={styles.linkList}>
              <li>
                <a href="#">Termos e Condições</a>
              </li>
              <li>
                <a href="#">Privacidade</a>
              </li>
              <li>
                <a href="#">Contactos</a>
              </li>
              <li>
                <a href="#">Horários</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className={styles.linkTitle}>Contactos</h6>
            <ul className={styles.linkList}>
              <li>
                <a href="tel:+351915290212">+351 915 290 212</a>
              </li>
              <li>
                <a href="mailto:geral@cantinhotropical.pt">geral@cantinhotropical.pt</a>
              </li>
              <li>
                <address style={{ fontStyle: "normal" }}>
                  Rua das Laranjeiras<br />
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
          <div className={styles.paymentIcons}>
            <Wallet size={20} />
            <CreditCard size={20} />
            <Landmark size={20} />
          </div>
        </div>
      </div>
    </footer>
  );
}