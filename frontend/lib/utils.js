export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateSlug = (projectName) => {
  return projectName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; 

  if (!validTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, WebP, GIF)');
  }

  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }

  return true;
};

export const generateUserSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('user_session_id');
    if (!sessionId) {
      sessionId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_session_id', sessionId);
    }
    return sessionId;
  }
  return 'default_session';
};

export const formatPhoneNumber = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};


export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]{10,}$/;
  return re.test(phone);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getImagePlaceholder = (width = 400, height = 300) => {
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/9ca3af?text=No+Image`;
};


