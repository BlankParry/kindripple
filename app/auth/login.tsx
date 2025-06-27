import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import COLORS from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
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

  // Demo login credentials
  const demoCredentials = [
    { role: 'Restaurant', email: 'contact@greenleafbistro.com', password: 'password123' },
    { role: 'NGO', email: 'contact@foodforall.org', password: 'password123' },
    { role: 'Volunteer', email: 'alex.j@example.com', password: 'password123' },
  ];

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    try {
      await login(demoEmail, demoPassword);
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue reducing food waste</Text>
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
        
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Quick Demo Access</Text>
          
          <View style={styles.demoButtonsContainer}>
            {demoCredentials.map((demo, index) => (
              <Button
                key={index}
                title={`Login as ${demo.role}`}
                onPress={() => handleDemoLogin(demo.email, demo.password)}
                variant="outline"
                size="small"
                userRole={demo.role.toLowerCase() as any}
                style={styles.demoButton}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  formContainer: {
    marginBottom: 40,
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 8,
    marginBottom: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: COLORS.text.secondary,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  demoContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    minWidth: '30%',
  },
});