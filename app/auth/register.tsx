import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import COLORS from '@/constants/colors';
import { UserRole } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('volunteer');
  
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Name validation
    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    try {
      await register({
        name,
        email,
        role: selectedRole,
      }, password);
      
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'NGO', value: 'ngo' },
    { label: 'Volunteer', value: 'volunteer' },
  ];

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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our mission to reduce food waste</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={validationErrors.name}
            userRole={selectedRole}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={validationErrors.email}
            userRole={selectedRole}
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={validationErrors.password}
            userRole={selectedRole}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={validationErrors.confirmPassword}
            userRole={selectedRole}
          />
          
          <Text style={styles.roleLabel}>I am registering as:</Text>
          <View style={styles.roleContainer}>
            {roleOptions.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleOption,
                  selectedRole === role.value && styles.roleOptionSelected,
                  selectedRole === role.value && { 
                    backgroundColor: COLORS[role.value].light,
                    borderColor: COLORS[role.value].primary,
                  },
                ]}
                onPress={() => setSelectedRole(role.value)}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === role.value && styles.roleTextSelected,
                    selectedRole === role.value && { color: COLORS[role.value].primary },
                  ]}
                >
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <Button
            title="Sign Up"
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.button}
            userRole={selectedRole}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={[styles.loginLink, { color: COLORS[selectedRole].primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
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
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  roleOptionSelected: {
    borderWidth: 2,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  roleTextSelected: {
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 8,
    marginBottom: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: COLORS.text.secondary,
  },
  loginLink: {
    fontWeight: '600',
    marginLeft: 4,
  },
});