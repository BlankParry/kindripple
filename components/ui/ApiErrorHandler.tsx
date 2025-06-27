import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react-native';

interface ApiErrorHandlerProps {
  error: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({
  error,
  isLoading = false,
  onRetry,
  showRetry = true,
}) => {
  if (!error) return null;

  const isNetworkError = error.message.toLowerCase().includes('network') || 
                        error.message.toLowerCase().includes('fetch') ||
                        error.message.toLowerCase().includes('connection');

  const isServerError = error.message.toLowerCase().includes('server') ||
                       error.message.toLowerCase().includes('500') ||
                       error.message.toLowerCase().includes('internal');

  const getErrorIcon = () => {
    if (isNetworkError) return <WifiOff size={24} color="#ef4444" />;
    if (isServerError) return <AlertCircle size={24} color="#f59e0b" />;
    return <AlertCircle size={24} color="#ef4444" />;
  };

  const getErrorTitle = () => {
    if (isNetworkError) return "Connection Error";
    if (isServerError) return "Server Error";
    return "Error";
  };

  const getErrorMessage = () => {
    if (isNetworkError) return "Please check your internet connection and try again.";
    if (isServerError) return "The server is experiencing issues. Please try again later.";
    return error.message || "An unexpected error occurred.";
  };

  return (
    <View style={styles.container}>
      {getErrorIcon()}
      <Text style={styles.title}>{getErrorTitle()}</Text>
      <Text style={styles.message}>{getErrorMessage()}</Text>
      
      {showRetry && onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, isLoading && styles.retryButtonDisabled]} 
          onPress={onRetry}
          disabled={isLoading}
        >
          <RefreshCw size={16} color="#ffffff" />
          <Text style={styles.retryText}>
            {isLoading ? 'Retrying...' : 'Try Again'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  retryButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});