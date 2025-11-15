'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { propertyAPI } from '@/lib/api';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    project_name: '',
    builder_name: '',
    location: '',
    price: '',
    description: '',
    property_type: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
    year_built: '',
    parking: '',
    floors: ''
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.project_name || !formData.price || !formData.location) {
      setError('Please fill in all required fields (Name, Price, Location).');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        area: formData.area ? Number(formData.area) : 0,
        main_image: mainImage,
        gallery_images: galleryImages
      };

      console.log("Submitting Payload:", payload);

      await propertyAPI.create(payload);
      
      alert('Property created successfully!');
      router.push('/admin/dashboard'); 
      
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.message || 'Failed to create property. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
        <p className="text-gray-600">Enter details for the new listing</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Builder Name</label>
            <input
              type="text"
              name="builder_name"
              value={formData.builder_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
             <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white">
               <option value="Apartment">Apartment</option>
               <option value="House">House</option>
               <option value="Villa">Villa</option>
               <option value="Commercial">Commercial</option>
             </select>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Images</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
            <div className="flex items-start space-x-4">
              <div className="w-32 h-32 relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                {mainImagePreview ? (
                  <Image src={mainImagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <Upload className="text-gray-400 h-8 w-8" />
                )}
                <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div className="text-sm text-gray-500 pt-2">
                <p>Upload the cover image for this property.</p>
                <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
            <div className="grid grid-cols-4 gap-4">
              {galleryPreviews.map((src, index) => (
                <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden group">
                  <Image src={src} alt={`Gallery ${index}`} fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              <div className="relative w-full h-24 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload size={20} />
                <span className="text-xs mt-1">Add Photos</span>
                <input type="file" multiple accept="image/*" onChange={handleGalleryImagesChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all flex items-center disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Creating...
              </>
            ) : (
              'Create Property'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}