'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, Heart, Eye, Bed, Bath, Square, Share2 } from 'lucide-react';
import { favoritesAPI, contactAPI } from '@/lib/api';
import { formatPrice, getImagePlaceholder, generateUserSessionId, validateEmail } from '@/lib/utils';

export default function PropertyCard({ property, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property.project_name}`
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const mainImage = property.main_image || getImagePlaceholder();
  const userSessionId = generateUserSessionId();

useEffect(() => {
  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesAPI.checkFavorite(userSessionId, property.id);
      // Remove .data since the interceptor already returns data
      setIsLiked(response.is_favorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  checkFavoriteStatus();
}, [property.id, userSessionId]);

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await favoritesAPI.removeFavorite(userSessionId, property.id);
        setIsLiked(false);
      } else {
        await favoritesAPI.addFavorite(userSessionId, property.id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const shareProperty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: property.project_name,
      text: property.description,
      url: `${window.location.origin}/properties/${property.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Property link copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
        alert('Sharing failed. Please copy the URL manually.');
      }
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(contactForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setContactLoading(true);
    try {
      await contactAPI.submitInquiry({
        property_id: property.id,
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message
      });
      
      setContactSubmitted(true);
      setTimeout(() => {
        setShowContactForm(false);
        setContactSubmitted(false);
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: `I'm interested in ${property.project_name}`
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const propertyDetails = {
    bedrooms: property.bedrooms || Math.floor(Math.random() * 5) + 1,
    bathrooms: property.bathrooms || Math.floor(Math.random() * 3) + 1,
    area: property.area || Math.floor(Math.random() * 2000) + 1000,
  };

  return (
    <>
      <div 
        className="card overflow-hidden group cursor-pointer"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="relative h-64 overflow-hidden">
          
          <Image
            src={mainImage}
            alt={property.project_name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton"></div>
          )}

          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

          
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={toggleLike}
              disabled={isLiking}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={shareProperty}
              className="p-2 rounded-full bg-white/90 text-gray-600 backdrop-blur-sm hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full backdrop-blur-sm">
              {property.property_type || 'For Sale'}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContactForm(true);
              }}
              className="btn btn-primary flex items-center space-x-2 shadow-lg text-sm"
            >
              <span>Quick Inquiry</span>
            </button>
          </div>

          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Link 
              href={`/properties/${property.id}`}
              className="btn btn-secondary flex items-center space-x-2 shadow-lg text-sm"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {property.property_type || 'Luxury Home'}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {property.project_name}
          </h3>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{property.builder_name}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <Bed className="h-4 w-4" />
              <span className="text-sm font-medium">{propertyDetails.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <Bath className="h-4 w-4" />
              <span className="text-sm font-medium">{propertyDetails.bathrooms} Baths</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <Square className="h-4 w-4" />
              <span className="text-sm font-medium">{propertyDetails.area} sq ft</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm mt-4 line-clamp-2">
            {property.description || 'Luxury property in prime location with modern amenities and stunning views.'}
          </p>

          <div className="mt-6 flex space-x-3">
            <Link 
              href={`/properties/${property.id}`}
              className="btn btn-primary flex-1 text-center justify-center group-hover:shadow-lg transition-all duration-300"
            >
              View Details
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowContactForm(true);
              }}
              className="btn btn-secondary px-4"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {showContactForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactForm(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Inquire About Property</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                &times;
              </button>
            </div>

            {contactSubmitted ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Inquiry Sent!</h4>
                <p className="text-gray-600 dark:text-gray-400">We'll contact you shortly about this property.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    className="form-input"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    className="form-input"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows={4}
                    className="form-input"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {contactLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Send Inquiry</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}