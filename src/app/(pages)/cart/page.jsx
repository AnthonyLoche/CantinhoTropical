// app/cart/page.jsx
"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import styles from "@/assets/css/cart/cart.module.css";
import Image from "next/image";
import Link from "next/link";
import { HeaderMain, FooterMain } from "@/app/components";
import { 
  ChevronRight, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight,
  Leaf,
  ShoppingBag,
  User,
  Phone
} from "lucide-react";

export default function CartPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [errors, setErrors] = useState({ name: false, phone: false });

  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getSubtotal,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const validateForm = () => {
    const newErrors = {
      name: !customerName.trim(),
      phone: !customerPhone.trim(),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone;
  };

const handleWhatsApp = () => {
  if (!validateForm()) {
    return;
  }

  const message = cartItems
    .map((item) => {
      return `${item.name} 
*Quantidade:* ${item.quantity} ;
*Valor:* ${formatPrice(item.price * item.quantity)} ;
==========`;
    })
    .join("\n\n");

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  const fullMessage = `Olá! Gostaria de solicitar os seguintes produtos:

${message}

*Total de itens:* ${totalItems}
*Total:* ${formatPrice(subtotal)}

*Dados do Cliente:*
*Nome:* ${customerName}
*Telefone:* ${customerPhone}

*Obrigado!*`;

  const encodedMessage = encodeURIComponent(fullMessage);
  console.log(fullMessage);
  console.log(encodedMessage);
  window.open(`https://wa.me/5547992236761?text=${encodedMessage}`, "_blank");
};
  // Carrinho vazio
  if (cartItems.length === 0) {
    return (
      <>
        <HeaderMain />
        <main className={styles.main}>
          <nav className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <ChevronRight size={16} className={styles.breadcrumbIcon} />
            <Link href="/catalog" className={styles.breadcrumbLink}>Loja</Link>
            <ChevronRight size={16} className={styles.breadcrumbIcon} />
            <span className={styles.breadcrumbActive}>Carrinho</span>
          </nav>

          <div className={styles.emptyCart}>
            <ShoppingBag size={64} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>Seu carrinho está vazio</h2>
            <p className={styles.emptyText}>
              Parece que você ainda não adicionou nenhum produto ao carrinho.
            </p>
            <Link href="/catalog" className={styles.shopBtn}>
              Ver Produtos
            </Link>
          </div>
        </main>
        <FooterMain />
      </>
    );
  }

  return (
    <>
      <HeaderMain />

      <main className={styles.main}>
        <nav className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <ChevronRight size={16} className={styles.breadcrumbIcon} />
          <Link href="/catalog" className={styles.breadcrumbLink}>Loja</Link>
          <ChevronRight size={16} className={styles.breadcrumbIcon} />
          <span className={styles.breadcrumbActive}>Carrinho</span>
        </nav>

        <div className={styles.cartHeader}>
          <h1 className={styles.title}>O Seu Carrinho</h1>
          <button className={styles.clearCartBtn} onClick={clearCart}>
            Limpar Carrinho
          </button>
        </div>

        <div className={styles.grid}>
          {/* Product List Area */}
          <div className={styles.productList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.productItem}>
                <div className={styles.productImage}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={128}
                      height={128}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>📷</div>
                  )}
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productHeader}>
                    <div>
                      <h3 className={styles.productName}>{item.name}</h3>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className={styles.productFooter}>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className={styles.price}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Resumo da Encomenda</h2>

              {/* Customer Info Form */}
              <div className={styles.customerForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <User size={16} />
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    className={`${styles.formInput} ${errors.name ? styles.formInputError : ""}`}
                    placeholder="Digite seu nome completo"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                  />
                  {errors.name && (
                    <span className={styles.errorText}>Nome é obrigatório</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <Phone size={16} />
                    Seu Telefone
                  </label>
                  <input
                    type="tel"
                    className={`${styles.formInput} ${errors.phone ? styles.formInputError : ""}`}
                    placeholder="(00) 00000-0000"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: false });
                    }}
                  />
                  {errors.phone && (
                    <span className={styles.errorText}>Telefone é obrigatório</span>
                  )}
                </div>
              </div>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
              </div>

              <div className={styles.checkoutActions}>
                <button 
                  className={styles.whatsappBtn} 
                  onClick={handleWhatsApp}
                >
                  Finalizar pelo WhatsApp
                  <ArrowRight size={20} />
                </button>
                <Link href="/catalog" className={styles.continueBtn}>
                  Continuar a Comprar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterMain />
    </>
  );
}