'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, AlertCircle } from 'lucide-react';

export default function PropertyForm({ 
  onSubmit, 
  loading = false, 
  initialData = {},
  submitButtonText = "Save Property" 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    project_name: initialData.project_name || '',
    builder_name: initialData.builder_name || '',
    location: initialData.location || '',
    price: initialData.price || '',
    description: initialData.description || '',
    bedrooms: initialData.bedrooms || '',
    bathrooms: initialData.bathrooms || '',
    area: initialData.area || '',
    property_type: initialData.property_type || '',
    year_built: initialData.year_built || '',
    parking: initialData.parking || '',
    floors: initialData.floors || '',
    main_image: null,
    gallery_images: [],
  });

  const [imagePreviews, setImagePreviews] = useState({
    main: initialData.main_image || null,
    gallery: initialData.gallery_images || [],
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'project_name':
        if (!value.trim()) {
          newErrors.project_name = 'Project name is required';
        } else if (value.trim().length < 2) {
          newErrors.project_name = 'Project name must be at least 2 characters';
        } else {
          delete newErrors.project_name;
        }
        break;
      
      case 'builder_name':
        if (!value.trim()) {
          newErrors.builder_name = 'Builder name is required';
        } else {
          delete newErrors.builder_name;
        }
        break;
      
      case 'location':
        if (!value.trim()) {
          newErrors.location = 'Location is required';
        } else {
          delete newErrors.location;
        }
        break;
      
      case 'price':
        if (!value || value.toString().trim() === '') {
          newErrors.price = 'Price is required';
        } else if (parseFloat(value) <= 0) {
          newErrors.price = 'Price must be greater than 0';
        } else if (isNaN(parseFloat(value))) {
          newErrors.price = 'Price must be a valid number';
        } else {
          delete newErrors.price;
        }
        break;
      
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    validateField(name, newValue);
  };

  const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; 

    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, PNG, WebP, GIF)');
    }

    if (file.size > maxSize) {
      throw new Error('Image size must be less than 10MB');
    }

    return true;
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, main: previewUrl }));
      setFormData(prev => ({ ...prev, main_image: file }));
      setErrors(prev => ({ ...prev, main_image: undefined }));
    } catch (error) {
      setErrors(prev => ({ ...prev, main_image: error.message }));
      e.target.value = '';
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      try {
        validateImageFile(file);
        validFiles.push(file);
      } catch (error) {
        alert(`Skipping ${file.name}: ${error.message}`);
      }
    });

    if (validFiles.length > 0) {
      const newGalleryImages = [...formData.gallery_images];
      const newGalleryPreviews = [...imagePreviews.gallery];

      validFiles.forEach(file => {
        const previewUrl = URL.createObjectURL(file);
        newGalleryImages.push(file);
        newGalleryPreviews.push(previewUrl);
      });

      setFormData(prev => ({
        ...prev,
        gallery_images: newGalleryImages
      }));
      
      setImagePreviews(prev => ({
        ...prev,
        gallery: newGalleryPreviews
      }));
    }

    e.target.value = '';
  };

  const removeGalleryImage = (index) => {
    const newGalleryImages = [...formData.gallery_images];
    const newGalleryPreviews = [...imagePreviews.gallery];
    
    if (newGalleryPreviews[index]) {
      URL.revokeObjectURL(newGalleryPreviews[index]);
    }
    
    newGalleryImages.splice(index, 1);
    newGalleryPreviews.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      gallery_images: newGalleryImages
    }));
    
    setImagePreviews(prev => ({
      ...prev,
      gallery: newGalleryPreviews
    }));
  };

  const removeMainImage = () => {
    if (imagePreviews.main) {
      URL.revokeObjectURL(imagePreviews.main);
    }
    
    setImagePreviews(prev => ({ ...prev, main: null }));
    setFormData(prev => ({ ...prev, main_image: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['project_name', 'builder_name', 'location', 'price'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    
    if (formData.price) {
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = 'Price must be a valid number greater than 0';
      }
    }
    
    if (!formData.main_image && !imagePreviews.main) {
      newErrors.main_image = 'Main image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔄 Form submission started...');
    
    if (!validateForm()) {
      const errorMessage = 'Please fix the following errors:\n' + 
        Object.values(errors).map(error => `• ${error}`).join('\n');
      alert(errorMessage);
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      area: formData.area ? parseInt(formData.area) : null,
      year_built: formData.year_built ? parseInt(formData.year_built) : null,
      parking: formData.parking ? parseInt(formData.parking) : null,
      floors: formData.floors ? parseInt(formData.floors) : null,
    };

    console.log('📤 Submitting property data:', {
      project_name: submitData.project_name,
      builder_name: submitData.builder_name,
      location: submitData.location,
      price: submitData.price,
      has_main_image: !!submitData.main_image,
      gallery_images_count: submitData.gallery_images.length
    });

    onSubmit(submitData);
  };

  const propertyTypes = [
    'House',
    'Apartment',
    'Condo',
    'Villa',
    'Townhouse',
    'Commercial',
    'Land'
  ];

  useState(() => {
    return () => {
      if (imagePreviews.main) {
        URL.revokeObjectURL(imagePreviews.main);
      }
      imagePreviews.gallery.forEach(preview => {
        URL.revokeObjectURL(preview);
      });
    };
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              className={`form-input ${errors.project_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter project name"
            />
            {errors.project_name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.project_name}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Builder Name *</label>
            <input
              type="text"
              name="builder_name"
              value={formData.builder_name}
              onChange={handleInputChange}
              className={`form-input ${errors.builder_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter builder name"
            />
            {errors.builder_name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.builder_name}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`form-input ${errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`form-input ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Property Type</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Year Built</label>
            <input
              type="number"
              name="year_built"
              value={formData.year_built}
              onChange={handleInputChange}
              min="1800"
              max="2030"
              className="form-input"
              placeholder="Enter year built"
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="form-input"
              placeholder="Enter property description and highlights..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="form-label">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              min="0"
              max="20"
              className="form-input"
              placeholder="Number of bedrooms"
            />
          </div>

          <div>
            <label className="form-label">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              min="0"
              max="20"
              step="0.5"
              className="form-input"
              placeholder="Number of bathrooms"
            />
          </div>

          <div>
            <label className="form-label">Area (sq ft)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              min="0"
              className="form-input"
              placeholder="Property area"
            />
          </div>

          <div>
            <label className="form-label">Parking Spaces</label>
            <input
              type="number"
              name="parking"
              value={formData.parking}
              onChange={handleInputChange}
              min="0"
              max="20"
              className="form-input"
              placeholder="Parking spaces"
            />
          </div>

          <div>
            <label className="form-label">Floors</label>
            <input
              type="number"
              name="floors"
              value={formData.floors}
              onChange={handleInputChange}
              min="0"
              max="10"
              className="form-input"
              placeholder="Number of floors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Main Image *</h2>
        
        <div className="space-y-4">
          {imagePreviews.main ? (
            <div className="relative inline-block">
              <img
                src={imagePreviews.main}
                alt="Main property preview"
                className="h-48 w-64 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload Main Image</span>
              <span className="text-xs text-gray-500 mt-1">Required</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </label>
          )}
          {errors.main_image && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
              {errors.main_image}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Gallery Images</h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {imagePreviews.gallery.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Gallery preview ${index + 1}`}
                  className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
              <Plus className="h-6 w-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-600 text-center px-2">Add Gallery Image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="hidden"
              />
            </label>
          </div>
          
          <p className="text-sm text-gray-500">
            Upload multiple images for the property gallery. Maximum 10 images, 10MB each.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="btn btn-secondary px-8 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating Property...</span>
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
}