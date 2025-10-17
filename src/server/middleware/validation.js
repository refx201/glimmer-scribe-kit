/**
 * Request Validation Middleware for procell API
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Palestinian format)
 */
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+970|970|0)?[0-9]{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required fields
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const field of fields) {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }
    
    next();
  };
};

/**
 * Validate user registration data
 */
export const validateUserRegistration = (req, res, next) => {
  const { email, password, name, userType } = req.body;
  const errors = [];

  // Required fields
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!name) errors.push('Name is required');

  // Email validation
  if (email && !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Name validation
  if (name && name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // User type validation
  const validUserTypes = ['customer', 'partner', 'admin'];
  if (userType && !validUserTypes.includes(userType)) {
    errors.push('Invalid user type');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Registration validation failed',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

/**
 * Validate product data
 */
export const validateProduct = (req, res, next) => {
  const { name, brand, category, price, description } = req.body;
  const errors = [];

  // Required fields
  if (!name) errors.push('Product name is required');
  if (!brand) errors.push('Brand is required');
  if (!category) errors.push('Category is required');
  if (!price) errors.push('Price is required');

  // Price validation
  if (price && (isNaN(price) || price <= 0)) {
    errors.push('Price must be a positive number');
  }

  // Name validation
  if (name && name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  }

  // Valid categories
  const validCategories = ['phone', 'accessory', 'tablet', 'smartwatch', 'headphones'];
  if (category && !validCategories.includes(category)) {
    errors.push('Invalid category');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Product validation failed',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

/**
 * Validate order data
 */
export const validateOrder = (req, res, next) => {
  const { items, customerInfo, shippingAddress } = req.body;
  const errors = [];

  // Items validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (items) {
    items.forEach((item, index) => {
      if (!item.productId) errors.push(`Item ${index + 1}: Product ID is required`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Item ${index + 1}: Valid quantity is required`);
      if (!item.price || item.price <= 0) errors.push(`Item ${index + 1}: Valid price is required`);
    });
  }

  // Customer info validation
  if (!customerInfo) {
    errors.push('Customer information is required');
  } else {
    if (!customerInfo.name) errors.push('Customer name is required');
    if (!customerInfo.phone) errors.push('Customer phone is required');
    if (!customerInfo.email) errors.push('Customer email is required');
    
    if (customerInfo.email && !isValidEmail(customerInfo.email)) {
      errors.push('Invalid customer email format');
    }
    
    if (customerInfo.phone && !isValidPhoneNumber(customerInfo.phone)) {
      errors.push('Invalid customer phone number format');
    }
  }

  // Shipping address validation
  if (!shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    if (!shippingAddress.city) errors.push('Shipping city is required');
    if (!shippingAddress.address) errors.push('Shipping address is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Order validation failed',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

/**
 * Validate trade-in data
 */
export const validateTradeIn = (req, res, next) => {
  const { brand, model, condition, storage, age, customerInfo } = req.body;
  const errors = [];

  // Required fields
  if (!brand) errors.push('Brand is required');
  if (!model) errors.push('Model is required');
  if (!condition) errors.push('Condition is required');

  // Valid conditions
  const validConditions = ['excellent', 'good', 'fair', 'poor'];
  if (condition && !validConditions.includes(condition)) {
    errors.push('Invalid condition. Must be: excellent, good, fair, or poor');
  }

  // Storage validation
  if (storage && (isNaN(storage) || storage <= 0)) {
    errors.push('Storage must be a positive number');
  }

  // Age validation
  if (age && (isNaN(age) || age < 0)) {
    errors.push('Age must be a non-negative number');
  }

  // Customer info validation (if provided for valuation request)
  if (customerInfo) {
    if (customerInfo.email && !isValidEmail(customerInfo.email)) {
      errors.push('Invalid email format');
    }
    if (customerInfo.phone && !isValidPhoneNumber(customerInfo.phone)) {
      errors.push('Invalid phone number format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Trade-in validation failed',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

/**
 * Validate repair booking data
 */
export const validateRepairBooking = (req, res, next) => {
  const { deviceInfo, issueDescription, preferredDate, customerInfo } = req.body;
  const errors = [];

  // Device info validation
  if (!deviceInfo) {
    errors.push('Device information is required');
  } else {
    if (!deviceInfo.brand) errors.push('Device brand is required');
    if (!deviceInfo.model) errors.push('Device model is required');
  }

  // Issue description validation
  if (!issueDescription || issueDescription.trim().length < 10) {
    errors.push('Issue description must be at least 10 characters long');
  }

  // Preferred date validation
  if (preferredDate) {
    const date = new Date(preferredDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid preferred date format');
    } else if (date < new Date()) {
      errors.push('Preferred date cannot be in the past');
    }
  }

  // Customer info validation
  if (!customerInfo) {
    errors.push('Customer information is required');
  } else {
    if (!customerInfo.name) errors.push('Customer name is required');
    if (!customerInfo.phone) errors.push('Customer phone is required');
    
    if (customerInfo.email && !isValidEmail(customerInfo.email)) {
      errors.push('Invalid email format');
    }
    if (customerInfo.phone && !isValidPhoneNumber(customerInfo.phone)) {
      errors.push('Invalid phone number format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Repair booking validation failed',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

/**
 * Validate partner application data
 */
export const validatePartnerApplication = (req, res, next) => {
  const { 
    ownerName, 
    storeName, 
    storeLocation, 
    contactInfo, 
    businessType, 
    expectedMonthlyVolume 
  } = req.body;
  const errors = [];

  // Required fields
  if (!ownerName) errors.push('Owner name is required');
  if (!storeName) errors.push('Store name is required');
  if (!storeLocation) errors.push('Store location is required');
  if (!contactInfo) errors.push('Contact information is required');
  if (!businessType) errors.push('Business type is required');

  // Owner name validation
  if (ownerName && ownerName.trim().length < 2) {
    errors.push('Owner name must be at least 2 characters long');
  }

  // Store name validation
  if (storeName && storeName.trim().length < 2) {
    errors.push('Store name must be at least 2 characters long');
  }

  // Contact info validation
  if (contactInfo) {
    if (!contactInfo.phone) errors.push('Contact phone is required');
    if (!contactInfo.email) errors.push('Contact email is required');
    
    if (contactInfo.email && !isValidEmail(contactInfo.email)) {
      errors.push('Invalid contact email format');
    }
    if (contactInfo.phone && !isValidPhoneNumber(contactInfo.phone)) {
      errors.push('Invalid contact phone number format');
    }
  }

  // Business type validation
  const validBusinessTypes = ['retail', 'wholesale', 'service', 'online', 'mixed'];
  if (businessType && !validBusinessTypes.includes(businessType)) {
    errors.push('Invalid business type');
  }

  // Expected monthly volume validation
  if (expectedMonthlyVolume && (isNaN(expectedMonthlyVolume) || expectedMonthlyVolume < 0)) {
    errors.push('Expected monthly volume must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Partner application validation failed',
      details: errors,
      code: 'VALIDATION_ERROR'
    });
  }

  next();
};

export default {
  validateRequired,
  validateUserRegistration,
  validateProduct,
  validateOrder,
  validateTradeIn,
  validateRepairBooking,
  validatePartnerApplication
};