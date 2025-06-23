import api from './api';
const cache = {};

export const getFromCache = (key) => {
  const cachedData = cache[key];
  
  if (cachedData && cachedData.expiry > Date.now()) {
    console.log(`[Cache] Using cached data for key: ${key}`);
    return cachedData.data;
  }
  
  // Remove expired cache
  if (cachedData) {
    delete cache[key];
  }
  
  return null;
};

export const setToCache = (key, data, ttl = 5 * 60 * 1000) => {
  console.log(`[Cache] Setting cache for key: ${key} (TTL: ${ttl}ms)`);
  cache[key] = {
    data,
    expiry: Date.now() + ttl
  };
};

export const clearCache = (key) => {
  if (cache[key]) {
    console.log(`[Cache] Clearing cache for key: ${key}`);
    delete cache[key];
  }
};

export const getSkemas = async () => {
  const cacheKey = 'skemas';
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await api.get('/skema');
    
    if (response.data.success) {
      setToCache(cacheKey, response.data.data);
      return response.data.data;
    }
    
    throw new Error('Failed to fetch skemas');
  } catch (error) {
    console.error('Error fetching skemas:', error);
    throw error;
  }
};