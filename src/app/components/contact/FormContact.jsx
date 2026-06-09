"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";
import styles from "../../../assets/css/contact/FormContact.module.css";

export default function FormContact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsSending(true);

    // Montar a mensagem formatada para o WhatsApp
    const phoneNumber = "351915290212";
    const message = `*Nova mensagem do site - Cantinho Tropical*%0A%0A
*📝 Dados do Cliente:*%0A
*Nome:* ${formData.firstName} ${formData.lastName}%0A
*Email:* ${formData.email}%0A%0A
*💬 Mensagem:*%0A
${formData.message}%0A%0A
---
*Enviado via formulário de contacto do site*`;

    // Abrir WhatsApp com a mensagem
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    
    // Simular envio e resetar formulário
    setTimeout(() => {
      setSent(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
      setIsSending(false);
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setSent(false), 3000);
    }, 500);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Form Section */}
        <div className={styles.formWrapper}>
          <h2 className={styles.formTitle}>Envie uma Mensagem</h2>
          
          {sent && (
            <div className={styles.successMessage}>
              Mensagem enviada com sucesso! Você será redirecionado ao WhatsApp.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Primeiro Nome *</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Seu nome"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Apelido *</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Seu apelido"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Mensagem *</label>
              <textarea
                name="message"
                placeholder="Como podemos ajudar?"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                required
              />
            </div>
            <div className={styles.formGroupFull}>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSending}
              >
                <Send size={18} />
                {isSending ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className={styles.infoWrapper}>
          <h2 className={styles.infoTitle}>Sinta-se à vontade para nos visitar</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <MapPin size={20} className={styles.icon} />
              </div>
              <div>
                <h4 className={styles.infoItemTitle}>Morada</h4>
                <p className={styles.infoText}>Rua das Laranjeiras, 2640-577 Mafra</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Phone size={20} className={styles.icon} />
              </div>
              <div>
                <h4 className={styles.infoItemTitle}>Telefone</h4>
                <p className={styles.infoText}>+351 915 290 212</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <Clock size={20} className={styles.icon} />
              </div>
              <div>
                <h4 className={styles.infoItemTitle}>Horário</h4>
                <p className={styles.infoText}>Segunda a Sábado: 09:30 - 19:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}