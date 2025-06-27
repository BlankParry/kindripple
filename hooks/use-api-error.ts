import { useState, useCallback } from 'react';

interface UseApiErrorReturn {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}

export const useApiError = (): UseApiErrorReturn => {
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      setError(error);
    } else if (typeof error === 'string') {
      setError(new Error(error));
    } else {
      setError(new Error('An unexpected error occurred'));
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
  };
};