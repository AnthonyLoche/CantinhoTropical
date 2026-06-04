// src/modules/uploads/repositories/cloudinary.repository.js

import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary with credentials from environment variables
 */
function configureCloudinary() {
  // Método 1: Configuração individual
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    console.log('✅ Cloudinary configured with individual credentials');
    console.log(`   Cloud name: ${cloudName}`);
    return;
  }

  // Método 2: Configuração via URL completa
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL
    });
    console.log('✅ Cloudinary configured with CLOUDINARY_URL');
    return;
  }

  console.error('❌ Cloudinary credentials not found!');
  console.error('   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  console.error('   or CLOUDINARY_URL in your .env.local file');
}

// Executar configuração
configureCloudinary();

console.log({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  hasSecret: !!process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - The folder in Cloudinary to upload to
 * @returns {Promise<Object>} - The upload result
 */
export async function uploadImage(file, folder) {
  try {
    console.log(`📤 Uploading image to Cloudinary folder: ${folder}`);
    
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log(`📦 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log(`📄 File type: ${file.type}`);
    console.log(`📝 File name: ${file.name}`);

    // Upload with Promise
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          timeout: 60000, // 60 seconds timeout
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            console.error('Error status code:', error.http_code);
            console.error('Error message:', error.message);
            
            // Handle specific error codes
            if (error.http_code === 403) {
              reject(new Error('Cloudinary authentication failed. Please check your API credentials.'));
            } else if (error.http_code === 400) {
              reject(new Error('Invalid file format or corrupted image.'));
            } else {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
          } else {
            console.log('✅ Cloudinary upload successful!');
            console.log(`   Public ID: ${result.public_id}`);
            console.log(`   URL: ${result.secure_url}`);
            resolve(result);
          }
        }
      );
      
      // Send the buffer as stream
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('❌ Error in uploadImage:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Deletes an image from Cloudinary by publicId
 * @param {string} publicId - The publicId of the image to delete
 * @returns {Promise<Object>} - The deletion result
 */
export async function deleteRepositoryImage(publicId) {
  try {
    console.log(`🗑️ Deleting image from Cloudinary: ${publicId}`);
    
    if (!publicId) {
      throw new Error('No publicId provided');
    }
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log('✅ Image deleted successfully');
    } else {
      console.warn('⚠️ Image deletion result:', result);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Extracts the publicId from a Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string} - The publicId
 */
export function getPublicIdFromUrl(url) {
  try {
    if (!url) {
      throw new Error('No URL provided');
    }
    
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/cantinho-tropical/products/product1.jpg
    // Extract everything after '/upload/'
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }
    
    let path = url.substring(uploadIndex + 8); // +8 to skip '/upload/'
    
    // Remove version prefix if exists (e.g., v1234567890/)
    const versionMatch = path.match(/^v\d+\//);
    if (versionMatch) {
      path = path.substring(versionMatch[0].length);
    }
    
    // Remove file extension
    const publicId = path.split('.')[0];
    
    console.log(`🔍 Extracted publicId: ${publicId}`);
    return publicId;
  } catch (error) {
    console.error('❌ Error extracting publicId:', error);
    throw new Error(`Failed to extract publicId: ${error.message}`);
  }
}

/**
 * Test Cloudinary connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function testCloudinaryConnection() {
  try {
    console.log('🔍 Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

/**
 * Get Cloudinary configuration status
 * @returns {Object} - Configuration status
 */
export function getCloudinaryStatus() {
  const config = cloudinary.config();
  return {
    isConfigured: !!(config.cloud_name && config.api_key && config.api_secret),
    cloud_name: config.cloud_name || 'not set',
    api_key: config.api_key ? `***${config.api_key.slice(-4)}` : 'not set',
    api_secret: config.api_secret ? '***' : 'not set',
    hasCloudinaryUrl: !!process.env.CLOUDINARY_URL,
  };
}