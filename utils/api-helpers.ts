export const handleApiError = (error: unknown): Error => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      return new Error('Network error: Please check your internet connection');
    }
    
    // Server errors
    if (error.message.includes('500')) {
      return new Error('Server error: Please try again later');
    }
    
    // Authentication errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return new Error('Authentication error: Please log in again');
    }
    
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  return new Error('An unexpected error occurred');
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = handleApiError(error);
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};