// app/components/home/TestimonialsCarousel.jsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import styles from "@/assets/css/home/TestimonialsSection.module.css";

const testimonials = [
  {
    id: 1,
    name: "Mara Gonçalves",
    role: "Cliente",
    rating: 5,
    text: "Top top, comecei a dar uma ração com muito melhor qualidade e sai bastante mais em conta. Os meus cães adoraram!",
    date: "3 meses atrás",
    initials: "MG",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKlIvH6a_WJRPxx3PM36kvY0IiOtm4nZwP0bdNKslSU84r0xw=w36-h36-p-rp-mo-br100"
  },
  {
    id: 2,
    name: "ArmRest Tattoo",
    role: "Cliente · 10 avaliações · 2 fotos",
    rating: 5,
    text: "6 meses 30kg. Compro a comida para o meu cão, comida natural, meu cão cresce muito saudável, a nível físico, de pelo, muita simpatia no atendimento, recomendo vivamente",
    date: "Editado 4 meses atrás",
    initials: "AT",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUVmdCbvaiDSWyHE5zes_OaNJVLk0Dw_70-1CbOrTeZMx8A39hm=w36-h36-p-rp-mo-br100"
  },
  {
    id: 3,
    name: "Maria Catarino",
    role: "Cliente · 1 avaliação",
    rating: 5,
    text: "Pessoal super simpático! Atendimento personalizado e atencioso, funcionários sempre prontos a ajudar e esclarecer dúvidas!",
    date: "4 meses atrás",
    initials: "MC",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjW4HnbGYTWeGVTZ6rJAo8neVysXxlPPJERp0aGRxueqMQ_LW7Ly=w36-h36-p-rp-mo-br100"
  },
  {
    id: 4,
    name: "Sandra Calisto",
    role: "Local Guide · 16 avaliações · 6 fotos",
    rating: 2,
    text: "Achamos muito pouca escolha de peixes e para além disso os aquários estavam muito pouco cuidados! Não sei se voltaremos",
    date: "3 meses atrás",
    initials: "SC",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIHeJ7DxMZbVaV7jvQ5as9hC6vKiki7CleThNnjdqCpt-qghg=w36-h36-p-rp-mo-ba12-br100"
  },
  {
    id: 5,
    name: "Madalena Cardoso Januário",
    role: "Cliente · 3 avaliações",
    rating: 5,
    text: "Pessoal super simpático com atendimento muito atencioso. Localização muito boa",
    date: "4 meses atrás",
    initials: "MCJ",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocLdOM2IyrP_5jSR739czWOhDGbwBIfO8qMvhxXKk-YoLHFfGA=w36-h36-p-rp-mo-br100"
  },
  {
    id: 6,
    name: "Vera Corte-Real",
    role: "Cliente · 6 avaliações",
    rating: 5,
    text: "Preços super competitivos. Grande variedade de produtos e ofertas. Atendimento ☆☆☆☆☆",
    date: "4 meses atrás",
    initials: "VCR",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjVQw7jEvLlr9rT_toZDcEqNtQy042G2ZL-k4Wmu1JZRwesdgpE=w36-h36-p-rp-mo-br100"
  },
  {
    id: 7,
    name: "Elodie Nascimento",
    role: "Cliente · 1 avaliação · 1 foto",
    rating: 5,
    text: "É a nossa loja de eleição, staff muito simpático e sempre disponível. Tem grande variedade de ração e animais exóticos.",
    date: "6 meses atrás",
    initials: "EN",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKmPdi5WUEYMizIIgCmDt3Y2lSjtRtOYBKmbLPH3czMrTR29g=w36-h36-p-rp-mo-br100"
  },
  {
    id: 8,
    name: "mafalda vaz",
    role: "Local Guide · 51 avaliações · 48 fotos",
    rating: 5,
    text: "Lugar 5 estrelas, vários animais tropicais, atendimento top sempre dispostos ajudar",
    date: "Editado um ano atrás",
    initials: "MV",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocLsZBtv7qrat30TcNl2pQdTERXuf5-XQzykgpijod0upKk-ag=w36-h36-p-rp-mo-ba12-br100"
  },
  {
    id: 9,
    name: "Ângela Garcia",
    role: "Cliente · 2 avaliações · 3 fotos",
    rating: 5,
    text: "Muito atenciosos, profissionais e atentos aos detalhes.",
    date: "4 meses atrás",
    initials: "AG",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWqpnrfb1LSsIvGj3NcL_H5DrRp4OSx8xeVnZhzcbAE7JAbOjo=w36-h36-p-rp-mo-br100"
  },
  {
    id: 10,
    name: "Ana Cristina",
    role: "Cliente · 1 avaliação",
    rating: 5,
    text: "A melhor loja da zona Oeste! O Pedro é impecável, excelente atendimento e muito prestável para os clientes. Recomendo muito, a loja é lindíssima!",
    date: "10 meses atrás",
    initials: "AC",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocIgMfnqb9QC5Z_qjZAsSBQhAlIK-2wJgQvPX1lg5YEx-WQPcA=w36-h36-p-rp-mo-br100"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  // Responsividade
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = currentIndex * itemsPerPage;
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const renderStars = (rating) => {
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty}`}
            fill={i < rating ? "#eab308" : "none"}
          />
        ))}
      </div>
    );
  };

  // Calcular estatísticas
  const averageRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);
  const totalReviews = testimonials.length;
  const ratingCounts = {
    5: testimonials.filter(t => t.rating === 5).length,
    4: testimonials.filter(t => t.rating === 4).length,
    3: testimonials.filter(t => t.rating === 3).length,
    2: testimonials.filter(t => t.rating === 2).length,
    1: testimonials.filter(t => t.rating === 1).length,
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>O que dizem os nossos clientes</h2>
          <div className={styles.divider} />
        </div>


        {/* Carousel */}
        <div className={styles.carouselContainer}>
          <button 
            className={`${styles.navBtn} ${styles.prevBtn}`} 
            onClick={prevSlide}
            disabled={totalPages === 1}
          >
            <ChevronLeft size={24} />
          </button>

          <div className={styles.carouselTrack}>
            <div 
              className={`${styles.carouselGrid} ${isAnimating ? styles.animating : ""}`}
            >
              {visibleTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.author}>
                      {testimonial.avatar ? (
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <div className={styles.avatar}>{testimonial.initials}</div>
                      )}
                      <div>
                        <h3 className={styles.authorName}>{testimonial.name}</h3>
                        <p className={styles.authorRole}>{testimonial.role}</p>
                      </div>
                    </div>
                    <span className={styles.date}>{testimonial.date}</span>
                  </div>
                  
                  {renderStars(testimonial.rating)}
                  
                  <p className={styles.text}>{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            className={`${styles.navBtn} ${styles.nextBtn}`} 
            onClick={nextSlide}
            disabled={totalPages === 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className={styles.dots}>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${currentIndex === index ? styles.dotActive : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}