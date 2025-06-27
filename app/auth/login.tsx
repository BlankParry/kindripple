import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/contexts/ThemeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
    };

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>KindRipple</Text>
              <Text style={styles.brandTagline}>Reducing food waste together</Text>
            </View>
            <ThemeToggle />
          </View>
          
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue reducing food waste</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={validationErrors.email}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={validationErrors.password}
          />
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <Button
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.button}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  brandContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 16,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  welcomeContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.text.secondary,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 40,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    height: 52,
  },
  errorText: {
    color: theme.error,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  registerText: {
    color: theme.text.secondary,
    fontSize: 16,
  },
  registerLink: {
    color: theme.primary,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 16,
  },
});