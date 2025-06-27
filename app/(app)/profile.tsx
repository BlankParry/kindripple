import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import COLORS from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      phone: '',
      address: '',
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
    
    // Phone validation (optional)
    if (phone && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(phone)) {
      errors.phone = 'Phone number is invalid';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const handleUpdateProfile = async () => {
    if (!validateForm()) return;
    
    try {
      await updateUser({
        name,
        email,
        phone,
        address,
        avatar,
      });
      
      Alert.alert(
        "Success",
        "Profile updated successfully!",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };
  
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to grant permission to access your photos.");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  
  const handleRemoveImage = () => {
    setAvatar('');
  };
  
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    if (!user) return COLORS.primary;
    
    switch (user.role) {
      case 'restaurant':
        return COLORS.restaurant.primary;
      case 'ngo':
        return COLORS.ngo.primary;
      case 'volunteer':
        return COLORS.volunteer.primary;
      case 'admin':
        return COLORS.admin.primary;
      default:
        return COLORS.primary;
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={avatar}
            name={name}
            size={100}
            userRole={user?.role}
          />
          
          <View style={styles.avatarActions}>
            <TouchableOpacity 
              style={[styles.avatarButton, { backgroundColor: getRoleColor() }]}
              onPress={handlePickImage}
            >
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            {avatar && (
              <TouchableOpacity 
                style={[styles.avatarButton, { backgroundColor: COLORS.error }]}
                onPress={handleRemoveImage}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            error={validationErrors.name}
            userRole={user?.role}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={validationErrors.email}
            userRole={user?.role}
          />
          
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={validationErrors.phone}
            userRole={user?.role}
          />
          
          <Input
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            error={validationErrors.address}
            userRole={user?.role}
          />
          
          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            isLoading={isLoading}
            style={styles.button}
            userRole={user?.role}
          />
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
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatarActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  formContainer: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
  },
});