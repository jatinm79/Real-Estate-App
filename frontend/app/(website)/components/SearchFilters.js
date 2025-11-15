'use client';

import { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    projectName: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      projectName: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
    };
    setFilters(resetFilters);
    setShowAdvanced(false);
    onSearch(resetFilters);
  };

  const quickLocations = ['Pune', 'Jaipur', 'Mumbai', 'Banglore', 'Delhi'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={filters.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="Search by project name, builder, or location..."
              className="form-input pl-12 pr-4 py-4 text-lg"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary flex items-center space-x-2 px-8 py-4 text-lg"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickLocations.map((location) => (
          <button
            key={location}
            type="button"
            onClick={() => handleChange('location', location)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filters.location === location
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {location}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-medium">{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
        </button>

        {(filters.minPrice || filters.maxPrice || filters.bedrooms || filters.bathrooms || filters.propertyType) && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm animate-slide-up">
          <div>
            <label className="form-label">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Min price"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Max price"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Bedrooms</label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              className="form-input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="form-label">Bathrooms</label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              className="form-input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="form-input"
            >
              <option value="">Any Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="form-label">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter specific location..."
              className="form-input"
            />
          </div>
        </div>
      )}

      {(filters.minPrice || filters.maxPrice || filters.bedrooms || filters.bathrooms || filters.propertyType) && (
        <div className="flex flex-wrap gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
          <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">Active Filters:</span>
          {filters.minPrice && (
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              Min: ${filters.minPrice}
            </span>
          )}
          {filters.maxPrice && (
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              Max: ${filters.maxPrice}
            </span>
          )}
          {filters.bedrooms && (
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              {filters.bedrooms}+ Beds
            </span>
          )}
          {filters.bathrooms && (
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              {filters.bathrooms}+ Baths
            </span>
          )}
          {filters.propertyType && (
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              {filters.propertyType}
            </span>
          )}
        </div>
      )}
    </form>
  );
}