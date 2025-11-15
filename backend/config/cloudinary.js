const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');


if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadToCloudinary = async (fileBuffer, folder = 'real-estate') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.USE_LOCAL_STORAGE === 'true') {
    return uploadToLocalStorage(fileBuffer, folder);
  }

  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload failed, falling back to local storage:', error);
    return uploadToLocalStorage(fileBuffer, folder);
  }
};


const uploadToLocalStorage = async (fileBuffer, folder = 'real-estate') => {
  try {
  
    const uploadDir = path.join(__dirname, '../uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const filepath = path.join(uploadDir, filename);

    
    fs.writeFileSync(filepath, fileBuffer);

    
    return {
      secure_url: `/uploads/${folder}/${filename}`
    };
  } catch (error) {
    throw new Error(`Local storage upload failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.USE_LOCAL_STORAGE === 'true') {
    return deleteFromLocalStorage(publicId);
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete failed:', error);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

const deleteFromLocalStorage = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    return { result: 'ok' };
  } catch (error) {
    console.error('Local storage delete failed:', error);
    return { result: 'error' };
  }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };