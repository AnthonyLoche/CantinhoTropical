import Image from "next/image";
import styles from "../../../assets/css/home/CategoryGrid.module.css";

const categories = [
  { 
    col: "col4", 
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtBZA4Sdkxpb2X7kaZ8XyRxZHs7mCRWKZ50DG8f5kPTTBOIMoxcCMLbfMTqxzD2K3sEpLSwyfkYhFynsQm_23AJym_tbb5x8azIkpEg7s_84ESgdsk_MFxH2E0Aq4Zuyzwmv-KMChzv59evcETXTDn1AgPqslXV2Rl3QF4k599ETFW3KaZMgrROloYyAounzMeNEhfWDAhK4SSYBIky3vWthQD1-rN5iHYc9JL0Lq_MThideXcRj5osVQhd97pJ-VY3Fo6HZnWhS0", 
    label: "Gatos" 
  },
  { 
    col: "col5", 
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsBasyRmcZ3gbgnFgyoUUKWPdZW7gxAFxivC-ylV_MJLMMdqJqykZX3iNbGQdk9su63fiiMRbjqSZSabOJ-AAqpcMd6vpq53_zuqCkoR7HcXn96aX05QgIB0VZXiJ5W0j2KAPJHLIJBsmiPg_T_mZezkc8E9bNrF65VkQY_WtR_k8v6Iu_1pLmu70qWR61whlIlt8Qg6X2LxYlyrr9Lphe3imfNVfP8oHwXvginS3a2EnMDdkG7d6AT3TfzFR2rhHl-StYVGDYrIw", 
    label: "Cães" 
  },
  { 
    col: "col3", 
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAThHUeuLBUicSR4ZD1U5o8dcqTqHJRGgN49UMpiQMy4onMrg4SLhraHm0ggqRGoyLPGgI6pJBl0LB7onHlhsQQHJhqcdGMse4shO0vfZ6kpbXGRXP_BP9LYC1fzXVKE7_-ft9DXjArtnH_rN8skMKx9xFUpHB7DS_jCzs0-QQMnT8zQfAgkWjrJfPnDk6a6X5LyvG23qRwGgl3QTUgYM9SFEXo4oXq9p8VfQUUK5oqKznelOpDLoEmHPRB1bSiONzES58WSPqrnY0", 
    label: "Aves Exóticas" 
  },
  { 
    col: "col3", 
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuARpNcto9BmnzqKXlW-MGgZE4h_iozDwSyR6gnYu8ipUdqSiy_VzsKitAG_YQdEkArlcLelRwoBFVuWPVK3qzO6uF_gO6DyMFIuMul5tizFdaOTMBrDAARMw_6biPi5s1VkGddx8Buz_9TVondZtbZ1k0ej8bCaYgFuNUEK6wkPW8f5yVrvpVWgjoFED6DFiCg7-IUKLT9l27ga9RDBIBsOnOTzlBWBX7gLeQxz2PGdYMtwCv15KiSjQpN5lBfMIf7dGkTOVuwZbIA", 
    label: "Roedores" 
  },
  { 
    col: "col6", 
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUC2oR-jPHeHo9DlUpc59uGqBv0RNikZ5U2Bl0TPvVciZE56K8BOmKyM68qwEHhjZoUCFIchpO6bYG6CYQjQx4lspHM584wY_HHEWtVLOgfHaJmC_ZXb-Pf5bfF4d0fk6S9WcD719qMjKj6BuDZ6MZBFtXCa8gA-9SGhTYzvVI9CTbEov2PXec-ypfJ12_lJ3wS2yF31ufW98cEPFMOsqYMWUS871P24ddC_G0IwZ09RC0pSwON_0WJSQhU-pXSJsv_SpKy4SfDFI", 
    label: "Aquariofilia" 
  },
  { 
    col: "col3", 
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIC-q95g1oAIvcsobk1TZxwMr0ajGS1kmHbUYpC5Slx0VJgEXngLekOFnMDqlNkM08Z3ji8bOGv0UC99x-17s1cIfKPOLUX38JwbJvJTjqNn7oBDnnCcYwSoo9CvxIEoAjODMbjcfgB_F-AwTc-X9horLmJ1mAEBHqqTR4T2ZexU2kpwKpkwkmdovHvGBAnGBIlCrygMxd_jSuR6Lddx9GLdSyxFXYDQCiyzdsGDdkLoz-_dd-HMPHhP_C7yRIQDrY2r13MjY8_Qc", 
    label: "Répteis" 
  },
];

export default function CategoryGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Explore a nossa Biodiversidade</h2>
        <p className={styles.subtitle}>
          Tratamos de todas as especialidades com dedicação e conhecimento técnico, garantindo o melhor para cada espécie, desde as mais comuns às mais exóticas.
        </p>
        <div className={styles.divider} />
      </div>

      <div className={styles.grid}>
        {categories.map(({ col, src, label }) => (
          <div key={label} className={`${styles.card} ${styles[col]}`}>
            <div className={styles.cardImageWrapper}>
              <Image
                src={src}
                alt={label}
                fill
                className={styles.cardImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={styles.cardOverlay}>
              <h3 className={styles.cardLabel}>{label}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}