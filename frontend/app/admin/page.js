'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Home,
  DollarSign,
  MapPin,
  Users,
  MessageCircle,
  Eye,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';
import { propertyAPI } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

// Mock contact API if the real one is not available
const mockContactAPI = {
  getInquiries: async () => {
    console.log('📧 Using mock contact API');
    return {
      status: 'success',
      data: {
        inquiries: [
          {
            id: 1,
            name: 'Tejas Patil',
            email: 'tejas@example.com',
            phone: '+1 (555) 123-4567',
            message: 'I am interested in this property. Please contact me.',
            project_name: 'Sample Property',
            location: 'Pune',
            status: 'new',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Sagar Jain',
            email: 'sagar@example.com',
            phone: '+1 (555) 987-6543',
            message: 'Can I schedule a viewing for this weekend?',
            project_name: 'Luxury Villa',
            location: 'Banglore',
            status: 'new',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      }
    };
  }
};

// Try to import the real contactAPI, fallback to mock
let contactAPI;
try {
  const apiModule = require('@/lib/api');
  contactAPI = apiModule.contactAPI || mockContactAPI;
} catch (error) {
  console.warn('Contact API not available, using mock data');
  contactAPI = mockContactAPI;
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [apiStatus, setApiStatus] = useState({
    properties: 'checking',
    contact: 'checking'
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus(prev => ({ ...prev, properties: 'loading' }));
      
      const response = await propertyAPI.getAll();
      setProperties(response.data.properties);
      setApiStatus(prev => ({ ...prev, properties: 'success' }));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      setApiStatus(prev => ({ ...prev, properties: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      setInquiriesLoading(true);
      setApiStatus(prev => ({ ...prev, contact: 'loading' }));
      
      const response = await contactAPI.getInquiries();
      setInquiries(response.data.inquiries || []);
      setApiStatus(prev => ({ ...prev, contact: 'success' }));
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setApiStatus(prev => ({ ...prev, contact: 'error' }));
      const mockResponse = await mockContactAPI.getInquiries();
      setInquiries(mockResponse.data.inquiries);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchInquiries();
  }, []);

  const handleDelete = async (id, projectName) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await propertyAPI.delete(id);
      await fetchProperties(); 
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const stats = {
    totalProperties: properties.length,
    totalValue: properties.reduce((sum, prop) => sum + parseFloat(prop.price || 0), 0),
    averagePrice: properties.length > 0 
      ? properties.reduce((sum, prop) => sum + parseFloat(prop.price || 0), 0) / properties.length 
      : 0,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter(inq => inq.status === 'new').length,
  };

  const retryFetch = () => {
    if (activeTab === 'properties') {
      fetchProperties();
    } else {
      fetchInquiries();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
      
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your property listings and inquiries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Building2 className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newInquiries}</p>
              </div>
            </div>
          </div>
        </div>

        {(apiStatus.properties === 'error' || apiStatus.contact === 'error') && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">
                  Some data may not be loading properly. 
                  {apiStatus.properties === 'error' && ' Properties API unavailable. '}
                  {apiStatus.contact === 'error' && ' Contact API unavailable. '}
                  Using mock data for demonstration.
                </p>
              </div>
              <button
                onClick={retryFetch}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'properties'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Properties</span>
                {apiStatus.properties === 'loading' && (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'inquiries'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Inquiries</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {stats.totalInquiries}
                </span>
                {apiStatus.contact === 'loading' && (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'properties' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
                  <Link href="/admin/properties/add" className="btn btn-primary flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Property</span>
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button onClick={fetchProperties} className="btn btn-primary">
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties</h3>
                      <p className="text-gray-600 mb-4">Get started by adding your first property.</p>
                      <Link href="/admin/properties/add" className="btn btn-primary">
                        Add Property
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties.map((property) => (
                        <div key={property.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          {/* Property Image */}
                          <div className="relative h-48 bg-gray-200">
                            {property.main_image ? (
                              <img
                                src={property.main_image}
                                alt={property.project_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Building2 className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                                {property.property_type || 'Property'}
                              </span>
                            </div>
                          </div>

                         
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                              {property.project_name}
                            </h3>
                            
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{property.location}</span>
                            </div>
                            
                            <div className="text-gray-600 text-sm mb-3">
                              by {property.builder_name}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xl font-bold text-primary-600">
                                {formatPrice(property.price)}
                              </span>
                            </div>

                            <div className="flex space-x-2">
                              <Link
                                href={`/properties/${property.id}`}
                                target="_blank"
                                className="flex-1 btn btn-secondary flex items-center justify-center space-x-1 text-sm"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </Link>
                              
                              <Link
                                href={`/admin/properties/edit/${property.id}`}
                                className="flex-1 btn btn-primary flex items-center justify-center space-x-1 text-sm"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                              
                              <button
                                onClick={() => handleDelete(property.id, property.project_name)}
                                disabled={deleteLoading === property.id}
                                className="flex-1 btn btn-danger flex items-center justify-center space-x-1 text-sm disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>{deleteLoading === property.id ? 'Deleting...' : 'Delete'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Contact Inquiries</h2>
                  <div className="text-sm text-gray-500">
                    {apiStatus.contact === 'error' && 'Using demo data'}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {inquiriesLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Inquiries</h3>
                      <p className="text-gray-600">Customer inquiries will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                              <p className="text-sm text-gray-600">{inquiry.email}</p>
                              {inquiry.phone && (
                                <p className="text-sm text-gray-600">{inquiry.phone}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                inquiry.status === 'new' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {inquiry.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(inquiry.created_at)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-700 mb-1">
                              <strong>Property:</strong> {inquiry.project_name || 'General Inquiry'}
                            </p>
                            {inquiry.location && (
                              <p className="text-sm text-gray-700">
                                <strong>Location:</strong> {inquiry.location}
                              </p>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {inquiry.message}
                          </p>
                          
                          <div className="flex space-x-2">
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="btn btn-secondary flex items-center space-x-1 text-sm"
                            >
                              <Mail className="h-4 w-4" />
                              <span>Reply</span>
                            </a>
                            {inquiry.phone && (
                              <a
                                href={`tel:${inquiry.phone}`}
                                className="btn btn-primary flex items-center space-x-1 text-sm"
                              >
                                <Phone className="h-4 w-4" />
                                <span>Call</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}