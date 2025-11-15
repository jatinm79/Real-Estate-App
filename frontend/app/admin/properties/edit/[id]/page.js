'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PropertyForm from '../../../components/PropertyForm';
import AdminSidebar from '../../../components/AdminSidebar';
import { propertyAPI } from '@/lib/api';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await propertyAPI.getById(propertyId);
        setProperty(response.data.property);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleSubmit = async (propertyData) => {
    try {
      setSubmitLoading(true);
      setError(null);
      
      await propertyAPI.update(propertyId, propertyData);
      
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Error updating property:', err);
      setError(err.response?.data?.message || 'Failed to update property. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => router.push('/admin')}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
              <p className="text-gray-600">Update property details</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <PropertyForm 
              onSubmit={handleSubmit}
              loading={submitLoading}
              initialData={property}
              submitButtonText="Update Property"
            />
          </div>
        </div>
      </div>
    </div>
  );
}