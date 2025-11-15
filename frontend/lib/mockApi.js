
export const favoritesAPI = {
  getAll: async () => {
    console.log('📋 Getting all favorites (mock)');
    return [];
  },
  add: async (propertyId) => {
    console.log('Adding to favorites (mock):', propertyId);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    return { success: true, message: 'Added to favorites' };
  },
  remove: async (propertyId) => {
    console.log('Removing from favorites (mock):', propertyId);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter(id => id !== propertyId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    return { success: true, message: 'Removed from favorites' };
  },
  check: async (propertyId) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorited = favorites.includes(propertyId);
    console.log('🔍 Checking favorite status (mock):', propertyId, isFavorited);
    return { isFavorited };
  },
};

export const contactAPI = {
  sendMessage: async (data) => {
    console.log('Sending contact message (mock):', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      success: true, 
      message: 'Message sent successfully (mock)' 
    };
  },
};

export const propertiesAPI = {
  getAll: async (filters = {}) => {
    console.log('Getting properties (mock):', filters);
    return [
      {
        id: 1,
        title: "Modern Downtown Apartment",
        description: "Beautiful modern apartment with great city views",
        price: 350000,
        type: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        address: "123 Main St, Downtown, City",
        images: ["/images/property1.jpg"],
        isFavorite: false
      },
      {
        id: 2,
        title: "Suburban Family Home",
        description: "Spacious family home in quiet neighborhood",
        price: 550000,
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
        address: "456 Oak Ave, Suburbia, City",
        images: ["/images/property2.jpg"],
        isFavorite: false
      }
    ];
  },
  getById: async (id) => {
    console.log('🏠 Getting property by ID (mock):', id);
    return {
      id: parseInt(id),
      title: "Modern Downtown Apartment",
      description: "Beautiful modern apartment with great city views",
      price: 350000,
      type: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      address: "123 Main St, Downtown, City",
      images: ["/images/property1.jpg"],
      isFavorite: false
    };
  },
  create: async (propertyData) => {
    console.log('Creating property (mock):', propertyData);
    return { ...propertyData, id: Date.now() };
  }
};