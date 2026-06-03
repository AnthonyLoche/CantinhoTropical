import styles from "../../../assets/css/home/TestimonialsSection.module.css";

const testimonials = [
  {
    initials: "RS",
    name: "Ricardo Silva",
    role: "Cliente há 3 anos",
    text: "O melhor sítio em Mafra para quem tem aves. Conhecimento técnico impressionante e uma simpatia fora do comum.",
  },
  {
    initials: "MC",
    name: "Marta Costa",
    role: "Dona do 'Bobi'",
    text: "Deixei o meu cão no hotel durante uma semana e ele adorou. Recebia fotos todos os dias, o que me deixou muito tranquila.",
  },
  {
    initials: "JP",
    name: "João Pedro",
    role: "Aquariofilista",
    text: "A variedade de peixes e plantas para aquário é fantástica. Nota-se que os animais são muito bem cuidados.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>O que dizem os nossos amigos</h2>
          <div className={styles.divider} />
        </div>
        <div className={styles.grid}>
          {testimonials.map(({ initials, name, role, text }) => (
            <div key={name} className={styles.card}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.star}>★</span>
                ))}
              </div>
              <p className={styles.text}>&ldquo;{text}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{initials}</div>
                <div>
                  <h6 className={styles.authorName}>{name}</h6>
                  <p className={styles.authorRole}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}