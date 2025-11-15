'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Building2, ArrowLeft, Heart, Share2, Phone, Mail, Bed, Bath, Square, Calendar } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import ContactForm from '../components/ContactForm';
import { propertyAPI } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id;
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

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

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const shareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.project_name,
          text: property.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
            <Link href="/properties" className="btn btn-primary">
              Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const allImages = [
    property.main_image,
    ...(property.gallery_images || [])
  ].filter(Boolean);

  const propertyDetails = {
    bedrooms: property.bedrooms || 4,
    bathrooms: property.bathrooms || 3,
    area: property.area || 2500,
    yearBuilt: property.year_built || 2020,
    parking: property.parking || 2,
    floors: property.floors || 2,
  };

  const features = [
    'Swimming Pool',
    'Garden',
    'Garage',
    'Security System',
    'Central AC',
    'Modern Kitchen',
    'Hardwood Floors',
    'Walk-in Closet'
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-20 z-40">
          <div className="container mx-auto px-4 py-4">
            <Link 
              href="/properties" 
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Properties
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <ImageCarousel images={allImages} alt={property.project_name} />
              </div>

              <div className="flex space-x-4 mb-8">
                <button
                  onClick={toggleLike}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isLiked
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={shareProperty}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                <nav className="flex space-x-8">
                  {['overview', 'features', 'location', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                        activeTab === tab
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Property Overview</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {property.description || 'This stunning property offers luxury living at its finest. Located in a prime area with excellent amenities and breathtaking views.'}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Bed className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{propertyDetails.bedrooms}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Bath className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{propertyDetails.bathrooms}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Square className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{propertyDetails.area} sq ft</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Area</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{propertyDetails.yearBuilt}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Year Built</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Property Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Location & Neighborhood</h2>
                    <div className="bg-gray-200 dark:bg-gray-800 h-64 rounded-xl flex items-center justify-center">
                      <p className="text-gray-600 dark:text-gray-400">Interactive map would be displayed here</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nearby Amenities</h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li>• Schools: 0.5 miles</li>
                          <li>• Shopping Center: 1.2 miles</li>
                          <li>• Hospital: 2.5 miles</li>
                          <li>• Park: 0.3 miles</li>
                          <li>• Public Transport: 0.2 miles</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Neighborhood Info</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          This property is located in a peaceful, family-friendly neighborhood with excellent schools,
                          shopping centers, and recreational facilities nearby.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Agent</h2>
                    <ContactForm property={property} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Asking Price</div>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                  {formatPrice(property.price)}
                </div>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="btn btn-primary w-full mb-3"
                >
                  Schedule a Tour
                </button>
                <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Call Agent</span>
                </button>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Project Name</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.project_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Builder</span>
                    <span className="font-medium text-gray-900 dark:text-white">{property.builder_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">{property.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Listed On</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {property.created_at ? formatDate(property.created_at) : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Listing Agent</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">JD</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">John Doe</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Senior Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full btn btn-primary flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                  </button>
                  <button className="w-full btn btn-secondary flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Schedule a Tour</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <ContactForm property={property} />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}