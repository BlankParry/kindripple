import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import COLORS from '@/constants/colors';
import { UserRole } from '@/types';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  userRole?: UserRole;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  userRole = 'volunteer',
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    switch (userRole) {
      case 'restaurant':
        return COLORS.restaurant.primary;
      case 'ngo':
        return COLORS.ngo.primary;
      case 'volunteer':
        return COLORS.volunteer.primary;
      case 'admin':
        return COLORS.admin.primary;
      default:
        return COLORS.volunteer.primary;
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Get platform-specific shadow styles
  const getShadowStyles = (): ViewStyle => {
    if (Platform.OS === 'ios') {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      };
    } else if (Platform.OS === 'android') {
      return {
        elevation: 1,
      };
    } else {
      // Web - use a simple border instead of shadow
      return {
        borderWidth: 1,
        borderColor: error ? COLORS.error : COLORS.border,
      };
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: COLORS.text.primary }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        getShadowStyles(),
        error && Platform.OS !== 'web' && { borderColor: COLORS.error },
      ]}>
        <TextInput
          style={[
            styles.input,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.text.light}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={COLORS.text.secondary} />
            ) : (
              <Eye size={20} color={COLORS.text.secondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  eyeIcon: {
    padding: 10,
  },
  error: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;