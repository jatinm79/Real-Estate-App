const formatPrice = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const generateSlug = (projectName) => {
  return projectName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const isValidImageUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "");
  }
  return input;
};

module.exports = {
  formatPrice,
  generateSlug,
  isValidImageUrl,
  sanitizeInput,
};
