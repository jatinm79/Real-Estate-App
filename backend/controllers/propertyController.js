const Property = require('../models/Property');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const extractPublicId = (url) => {
  const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
};

class PropertyController {
  static async getAllProperties(req, res, next) {
    try {
      const filters = {
        location: req.query.location,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
        projectName: req.query.projectName,
        propertyType: req.query.propertyType,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms) : undefined,
      };

      const properties = await Property.findAll(filters);

      res.status(200).json({
        status: 'success',
        results: properties.length,
        data: {
          properties
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPropertyById(req, res, next) {
    try {
      const { id } = req.params;
      
      const property = await Property.findById(id);
      
      if (!property) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          property
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProperty(req, res, next) {
    try {
      console.log('Request body:', req.body);
      console.log('Request files:', {
        main_image: req.file,
        gallery_images: req.files
      });

      const propertyData = { ...req.body };
      
      if (propertyData.price) propertyData.price = parseFloat(propertyData.price);
      if (propertyData.bedrooms) propertyData.bedrooms = parseInt(propertyData.bedrooms);
      if (propertyData.bathrooms) propertyData.bathrooms = parseInt(propertyData.bathrooms);
      if (propertyData.area) propertyData.area = parseInt(propertyData.area);
      if (propertyData.year_built) propertyData.year_built = parseInt(propertyData.year_built);
      if (propertyData.parking) propertyData.parking = parseInt(propertyData.parking);
      if (propertyData.floors) propertyData.floors = parseInt(propertyData.floors);

      if (req.file) {
        console.log('Uploading main image...');
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'real-estate/main');
        propertyData.main_image = uploadResult.secure_url;
        console.log('Main image uploaded:', propertyData.main_image);
      }

      if (req.files && req.files.length > 0) {
        console.log('Uploading gallery images...');
        const galleryUploads = req.files.map(file => 
          uploadToCloudinary(file.buffer, 'real-estate/gallery')
        );
        
        const galleryResults = await Promise.all(galleryUploads);
        propertyData.gallery_images = galleryResults.map(result => result.secure_url);
        console.log('Gallery images uploaded:', propertyData.gallery_images.length);
      }

      const newProperty = await Property.create(propertyData);

      res.status(201).json({
        status: 'success',
        message: 'Property created successfully',
        data: {
          property: newProperty
        }
      });
    } catch (error) {
      console.error('Error in createProperty:', error);
      next(error);
    }
  }

  static async updateProperty(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.bedrooms) updateData.bedrooms = parseInt(updateData.bedrooms);
      if (updateData.bathrooms) updateData.bathrooms = parseInt(updateData.bathrooms);
      if (updateData.area) updateData.area = parseInt(updateData.area);
      if (updateData.year_built) updateData.year_built = parseInt(updateData.year_built);
      if (updateData.parking) updateData.parking = parseInt(updateData.parking);
      if (updateData.floors) updateData.floors = parseInt(updateData.floors);

      const existingProperty = await Property.findById(id);
      if (!existingProperty) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found'
        });
      }

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'real-estate/main');
        updateData.main_image = uploadResult.secure_url;

        if (existingProperty.main_image) {
          const oldPublicId = extractPublicId(existingProperty.main_image);
          if (oldPublicId) {
            await deleteFromCloudinary(oldPublicId);
          }
        }
      }

      if (req.files && req.files.length > 0) {
        const galleryUploads = req.files.map(file => 
          uploadToCloudinary(file.buffer, 'real-estate/gallery')
        );
        
        const galleryResults = await Promise.all(galleryUploads);
        updateData.gallery_images = galleryResults.map(result => result.secure_url);

        if (existingProperty.gallery_images && existingProperty.gallery_images.length > 0) {
          const deletePromises = existingProperty.gallery_images.map(imageUrl => {
            const publicId = extractPublicId(imageUrl);
            return publicId ? deleteFromCloudinary(publicId) : Promise.resolve();
          });
          await Promise.all(deletePromises);
        }
      }

      const updatedProperty = await Property.update(id, updateData);

      res.status(200).json({
        status: 'success',
        message: 'Property updated successfully',
        data: {
          property: updatedProperty
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProperty(req, res, next) {
    try {
      const { id } = req.params;

      const property = await Property.findById(id);
      if (!property) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found'
        });
      }

      if (property.main_image) {
        const mainPublicId = extractPublicId(property.main_image);
        if (mainPublicId) {
          await deleteFromCloudinary(mainPublicId);
        }
      }

      if (property.gallery_images && property.gallery_images.length > 0) {
        const deletePromises = property.gallery_images.map(imageUrl => {
          const publicId = extractPublicId(imageUrl);
          return publicId ? deleteFromCloudinary(publicId) : Promise.resolve();
        });
        await Promise.all(deletePromises);
      }

      await Property.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Property deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PropertyController;