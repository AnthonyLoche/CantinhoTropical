/**
 * Upload DTO - Plain object for serialization
 * This ensures the object can be passed from Server Actions to Client Components
 */

/**
 * Creates a plain upload DTO object
 * @param {Object} data - The upload data from Cloudinary
 * @param {string} data.url - The secure URL of the uploaded image
 * @param {string} data.publicId - The public ID of the image in Cloudinary
 * @param {number} data.width - The image width
 * @param {number} data.height - The image height
 * @param {string} data.format - The image format
 * @returns {Object} - A plain serializable object
 */
export function createUploadDTO(data) {
  return {
    url: String(data.url || ''),
    publicId: String(data.publicId || ''),
    width: Number(data.width) || 0,
    height: Number(data.height) || 0,
    format: String(data.format || ''),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Upload DTO class (for internal use only)
 * Note: Do NOT return instances of this class from Server Actions.
 * Always use createUploadDTO() or call toJSON() before returning.
 */
export class UploadDTO {
  constructor({ url, publicId, width, height, format }) {
    this.url = url;
    this.publicId = publicId;
    this.width = width;
    this.height = height;
    this.format = format;
    this.createdAt = new Date();
  }

  /**
   * Convert to plain object for serialization
   * @returns {Object} - Plain object representation
   */
  toJSON() {
    return {
      url: this.url,
      publicId: this.publicId,
      width: this.width,
      height: this.height,
      format: this.format,
      createdAt: this.createdAt.toISOString(),
    };
  }

  /**
   * Get plain object (alias for toJSON)
   * @returns {Object} - Plain object
   */
  toPlainObject() {
    return this.toJSON();
  }
}