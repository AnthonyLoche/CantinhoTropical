/**
 * TextContent DTO
 * Formats text content data for API responses
 */
export class TextContentDTO {
  /**
   * Format a single text content
   * @param {Object} content - TextContent from Prisma
   * @returns {Object} Formatted text content
   */
  static format(content) {
    if (!content) return null;

    return {
      id: content.id,
      heroBadge: content.heroBadge || "",
      heroTitle: content.heroTitle || "",
      heroDescription: content.heroDescription || "",
      categoriesTitle: content.categoriesTitle || "",
      categoriesDescription: content.categoriesDescription || "",
      aboutTitle: content.aboutTitle || "",
      aboutDescription: content.aboutDescription || "",
      petHotelChip: content.petHotelChip || "",
      petHotelTitle: content.petHotelTitle || "",
      petHotelDescription: content.petHotelDescription || "",
      contactTitle: content.contactTitle || "",
      contactDescription: content.contactDescription || "",
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  }

  /**
   * Format for admin panel (with metadata)
   * @param {Object} content - TextContent from Prisma
   * @returns {Object} Formatted text content for admin
   */
  static formatForAdmin(content) {
    if (!content) return null;

    return {
      ...this.format(content),
      sections: [
        { id: "hero", title: "Hero", fields: ["heroBadge", "heroTitle", "heroDescription"] },
        { id: "categories", title: "Categorias", fields: ["categoriesTitle", "categoriesDescription"] },
        { id: "about", title: "Sobre Nós", fields: ["aboutTitle", "aboutDescription"] },
        { id: "petHotel", title: "Pet Hotel", fields: ["petHotelChip", "petHotelTitle", "petHotelDescription"] },
        { id: "contact", title: "Contacto", fields: ["contactTitle", "contactDescription"] },
      ],
    };
  }
}