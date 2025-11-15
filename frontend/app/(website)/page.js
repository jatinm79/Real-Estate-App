'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Home, MapPin, Star, TrendingUp, Shield, Clock, Users } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertyCard from './components/PropertyCard';
import SearchFilters from './components/SearchFilters';
import { propertyAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalValue: 0,
    happyClients: 1250,
    citiesCovered: 25
  });

  const fetchProperties = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyAPI.getAll(filterParams);
      setProperties(response.data.properties);
      
      const totalValue = response.data.properties.reduce((sum, prop) => sum + parseFloat(prop.price), 0);
      setStats(prev => ({
        ...prev,
        totalProperties: response.data.properties.length,
        totalValue
      }));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchProperties(searchFilters);
  };

  const featuredProperties = properties.slice(0, 6);
  const trendingProperties = properties.slice(0, 3);

  return (
    <>
      <Header />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500"></div>
        
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <TrendingUp className="h-4 w-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">Trusted by 1,250+ happy clients</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your
              <span className="block bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover premium properties in prime locations with our curated real estate listings
            </p>
            
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-smooth-lg border border-white/20 p-2 mb-12">
              <SearchFilters onSearch={handleSearch} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.totalProperties}+</div>
                <div className="text-primary-100 text-sm">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.happyClients}+</div>
                <div className="text-primary-100 text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stats.citiesCovered}+</div>
                <div className="text-primary-100 text-sm">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{formatPrice(stats.totalValue)}</div>
                <div className="text-primary-100 text-sm">Worth Sold</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Handpicked selections of the finest properties in premium locations around the world
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="skeleton h-48 rounded-xl mb-4"></div>
                  <div className="skeleton h-6 rounded mb-2"></div>
                  <div className="skeleton h-4 rounded mb-1"></div>
                  <div className="skeleton h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
                <button
                  onClick={() => fetchProperties()}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    index={index}
                  />
                ))}
              </div>

              {properties.length > 6 && (
                <div className="text-center">
                  <Link href="/properties" className="btn btn-primary text-lg px-8 py-4">
                    View All Properties
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Prime Properties
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide exceptional service and expertise to help you find your perfect home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 card group">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trusted Expertise</h3>
              <p className="text-gray-600 dark:text-gray-300">
                With over 10 years of experience, we provide reliable real estate guidance and market insights.
              </p>
            </div>

            <div className="text-center p-8 card group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Process</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Streamlined buying and selling process to get you into your dream home faster.
              </p>
            </div>

            <div className="text-center p-8 card group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dedicated Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our team is always available to answer your questions and provide personalized service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {trendingProperties.length > 0 && (
        <section className="py-20 bg-primary-50 dark:bg-primary-900/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 mb-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Trending Now</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Hot Properties
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don't miss out on these highly sought-after properties
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {trendingProperties.map((property, index) => (
                <div key={property.id} className="group relative">
                  <div className="card overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={property.main_image}
                        alt={property.project_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                          Trending
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {property.project_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {property.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(property.price)}
                        </span>
                        <Link 
                          href={`/properties/${property.id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}