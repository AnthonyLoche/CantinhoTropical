import { uploadImage, deleteRepositoryImage, getPublicIdFromUrl } from '../repositories/cloudinary.repository.js';
import { UPLOAD_FOLDERS } from '../constants/upload.constants.js';
import { createUploadDTO, UploadDTO } from '../dtos/upload.dto.js';

/**
 * Uploads a product image to Cloudinary in the products folder
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - A plain object with upload data
 */
export async function uploadProductImage(file) {
  const result = await uploadImage(file, UPLOAD_FOLDERS.PRODUCTS);
  // Return plain object using createUploadDTO (NOT the class instance)
  return createUploadDTO({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  });
}

/**
 * Uploads a brand image to Cloudinary in the brands folder
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - A plain object with upload data
 */
export async function uploadBrandImage(file) {
  const result = await uploadImage(file, UPLOAD_FOLDERS.BRANDS);
  // Return plain object using createUploadDTO (NOT the class instance)
  return createUploadDTO({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  });
}

/**
 * Uploads a category image to Cloudinary in the categories folder
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - A plain object with upload data
 */
export async function uploadCategoryImage(file) {
  const result = await uploadImage(file, UPLOAD_FOLDERS.CATEGORIES);
  // Return plain object using createUploadDTO (NOT the class instance)
  return createUploadDTO({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  });
}

/**
 * Deletes an image from Cloudinary by its URL
 * @param {string} url - The Cloudinary URL of the image to delete
 * @returns {Promise<Object>} - The deletion result
 */
export async function deleteServiceImage(url) {
  const publicId = getPublicIdFromUrl(url);
  return deleteRepositoryImage(publicId);
}