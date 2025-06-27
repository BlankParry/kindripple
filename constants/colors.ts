export interface ThemeColors {
  // Theme colors
  primary: string;
  secondary: string;
  
  // Role-specific colors
  restaurant: {
    primary: string;
    secondary: string;
    light: string;
  };
  ngo: {
    primary: string;
    secondary: string;
    light: string;
  };
  volunteer: {
    primary: string;
    secondary: string;
    light: string;
  };
  admin: {
    primary: string;
    secondary: string;
    light: string;
  };
  
  // Common colors
  background: string;
  surface: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
    inverse: string;
  };
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Status colors
  available: string;
  claimed: string;
  expired: string;
  inProgress: string;
  completed: string;
}

export const LIGHT_COLORS: ThemeColors = {
  // Theme colors
  primary: '#4A90E2', // Soft blue
  secondary: '#50C878', // Emerald green
  
  // Role-specific colors
  restaurant: {
    primary: '#8c3ccc', // Purple
    secondary: '#a855f7', // Lighter purple
    light: '#f3e8ff', // Very light purple
  },
  ngo: {
    primary: '#ee9a40', // Orange
    secondary: '#f59e0b', // Lighter orange
    light: '#fef3c7', // Very light orange
  },
  volunteer: {
    primary: '#4ade80', // Green
    secondary: '#22c55e', // Lighter green
    light: '#dcfce7', // Very light green
  },
  admin: {
    primary: '#3b82f6', // Blue
    secondary: '#60a5fa', // Lighter blue
    light: '#dbeafe', // Very light blue
  },
  
  // Common colors
  background: '#f5f7fa', // Light background
  surface: '#ffffff',
  card: '#ffffff',
  text: {
    primary: '#1f2937', // Dark text
    secondary: '#6b7280', // Medium gray
    light: '#9ca3af', // Light gray
    inverse: '#ffffff', // White text for dark backgrounds
  },
  border: '#e5e7eb',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Status colors
  available: '#10b981', // Success green
  claimed: '#f59e0b', // Warning orange
  expired: '#ef4444', // Error red
  inProgress: '#3b82f6', // Info blue
  completed: '#10b981', // Success green
};

export const DARK_COLORS: ThemeColors = {
  // Theme colors
  primary: '#60a5fa', // Brighter blue for dark mode
  secondary: '#34d399', // Brighter green for dark mode
  
  // Role-specific colors
  restaurant: {
    primary: '#a855f7', // Brighter purple
    secondary: '#c084fc', // Even lighter purple
    light: '#581c87', // Dark purple background
  },
  ngo: {
    primary: '#fbbf24', // Brighter orange for better contrast
    secondary: '#f59e0b', // Orange
    light: '#92400e', // Dark orange background
  },
  volunteer: {
    primary: '#4ade80', // Brighter green
    secondary: '#22c55e', // Green
    light: '#166534', // Dark green background
  },
  admin: {
    primary: '#60a5fa', // Brighter blue
    secondary: '#3b82f6', // Blue
    light: '#1e40af', // Dark blue background
  },
  
  // Common colors
  background: '#121212', // Dark background
  surface: '#1e1e1e',
  card: '#2d2d2d',
  text: {
    primary: '#f9fafb', // Light text
    secondary: '#d1d5db', // Medium light gray
    light: '#9ca3af', // Light gray
    inverse: '#1f2937', // Dark text for light backgrounds
  },
  border: '#374151',
  success: '#10b981',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
  
  // Status colors
  available: '#10b981', // Success green
  claimed: '#fbbf24', // Warning orange
  expired: '#f87171', // Error red
  inProgress: '#60a5fa', // Info blue
  completed: '#10b981', // Success green
};

// Legacy export for backward compatibility
export const COLORS = LIGHT_COLORS;

export default COLORS;