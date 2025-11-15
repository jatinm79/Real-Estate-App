// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { 
//   Building2, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye,
//   Search,
//   Filter,
//   MapPin,
//   DollarSign,
//   Bed,
//   Bath,
//   Square
// } from 'lucide-react';
// import { propertyAPI } from '@/lib/api';
// import { formatPrice } from '@/lib/utils';

// export default function AdminPropertiesPage() {
//   const router = useRouter();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('');

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await propertyAPI.getAll();
//       setProperties(response.data.properties);
//     } catch (err) {
//       console.error('Error fetching properties:', err);
//       setError('Failed to load properties. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   const handleDelete = async (id, projectName) => {
//     if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
//       return;
//     }

//     try {
//       setDeleteLoading(id);
//       await propertyAPI.delete(id);
//       await fetchProperties(); // Refresh the list
//     } catch (err) {
//       console.error('Error deleting property:', err);
//       alert('Failed to delete property. Please try again.');
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const filteredProperties = properties.filter(property => {
//     const matchesSearch = property.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          property.builder_name.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesType = !filterType || property.property_type === filterType;
    
//     return matchesSearch && matchesType;
//   });

//   const propertyTypes = [...new Set(properties.map(p => p.property_type).filter(Boolean))];

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
//               <p className="text-gray-600">Manage all property listings</p>
//             </div>
//             <Link href="/admin/properties/add" className="btn btn-primary flex items-center space-x-2">
//               <Plus className="h-5 w-5" />
//               <span>Add New Property</span>
//             </Link>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search properties..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="form-input pl-10"
//               />
//             </div>
            
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="form-input"
//             >
//               <option value="">All Property Types</option>
//               {propertyTypes.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
            
//             <div className="text-sm text-gray-600 flex items-center">
//               <Filter className="h-4 w-4 mr-2" />
//               Showing {filteredProperties.length} of {properties.length} properties
//             </div>
//           </div>
//         </div>

//         {/* Properties Grid */}
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center py-12">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//               <p className="text-red-600 mb-4">{error}</p>
//               <button onClick={fetchProperties} className="btn btn-primary">
//                 Try Again
//               </button>
//             </div>
//           </div>
//         ) : filteredProperties.length === 0 ? (
//           <div className="text-center py-12">
//             <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {properties.length === 0 ? 'No Properties' : 'No Properties Found'}
//             </h3>
//             <p className="text-gray-600 mb-4">
//               {properties.length === 0 
//                 ? 'Get started by adding your first property.' 
//                 : 'Try adjusting your search criteria.'
//               }
//             </p>
//             {properties.length === 0 && (
//               <Link href="/admin/properties/add" className="btn btn-primary">
//                 Add Property
//               </Link>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredProperties.map((property) => (
//               <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//                 {/* Property Image */}
//                 <div className="relative h-48 bg-gray-200">
//                   {property.main_image ? (
//                     <img
//                       src={property.main_image}
//                       alt={property.project_name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                       <Building2 className="h-12 w-12 text-gray-400" />
//                     </div>
//                   )}
//                   <div className="absolute top-3 left-3">
//                     <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
//                       {property.property_type || 'Property'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Property Details */}
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
//                     {property.project_name}
//                   </h3>
                  
//                   <div className="flex items-center text-gray-600 mb-2">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     <span className="text-sm">{property.location}</span>
//                   </div>
                  
//                   <div className="text-gray-600 text-sm mb-3">
//                     by {property.builder_name}
//                   </div>

//                   {/* Property Stats */}
//                   <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
//                     <div className="flex items-center space-x-4">
//                       {property.bedrooms && (
//                         <div className="flex items-center">
//                           <Bed className="h-4 w-4 mr-1" />
//                           <span>{property.bedrooms}</span>
//                         </div>
//                       )}
//                       {property.bathrooms && (
//                         <div className="flex items-center">
//                           <Bath className="h-4 w-4 mr-1" />
//                           <span>{property.bathrooms}</span>
//                         </div>
//                       )}
//                       {property.area && (
//                         <div className="flex items-center">
//                           <Square className="h-4 w-4 mr-1" />
//                           <span>{property.area} sq ft</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div className="flex items-center justify-between mb-4">
//                     <span className="text-xl font-bold text-primary-600">
//                       {formatPrice(property.price)}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex space-x-2">
//                     <Link
//                       href={`/properties/${property.id}`}
//                       target="_blank"
//                       className="flex-1 btn btn-secondary flex items-center justify-center space-x-1 text-sm"
//                     >
//                       <Eye className="h-4 w-4" />
//                       <span>View</span>
//                     </Link>
                    
//                     <Link
//                       href={`/admin/properties/edit/${property.id}`}
//                       className="flex-1 btn btn-primary flex items-center justify-center space-x-1 text-sm"
//                     >
//                       <Edit className="h-4 w-4" />
//                       <span>Edit</span>
//                     </Link>
                    
//                     <button
//                       onClick={() => handleDelete(property.id, property.project_name)}
//                       disabled={deleteLoading === property.id}
//                       className="flex-1 btn btn-danger flex items-center justify-center space-x-1 text-sm disabled:opacity-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       <span>{deleteLoading === property.id ? 'Deleting...' : 'Delete'}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// app/admin/properties/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { propertiesAPI } from '@/lib/api';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;
  
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    price: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    builder_name: '',
    main_image: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      
      setLoading(true);
      try {
        const property = await propertiesAPI.getById(propertyId);
        setFormData({
          project_name: property.project_name || '',
          description: property.description || '',
          price: property.price || '',
          property_type: property.property_type || '',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          area: property.area || '',
          location: property.location || '',
          builder_name: property.builder_name || '',
          main_image: property.main_image || '',
          images: property.images || []
        });
      } catch (error) {
        console.error('Error fetching property:', error);
        alert('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await propertiesAPI.update(propertyId, formData);
      alert('Property updated successfully!');
      router.push('/admin/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">Loading property details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Property</h1>
        <button
          onClick={() => router.push('/admin/properties')}
          className="btn btn-secondary"
        >
          Back to Properties
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Property Type *</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Area (sq ft)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Builder Name</label>
            <input
              type="text"
              name="builder_name"
              value={formData.builder_name}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Main Image URL</label>
          <input
            type="url"
            name="main_image"
            value={formData.main_image}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="form-input"
          />
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Property'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/properties')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}