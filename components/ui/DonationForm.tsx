import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Upload, X } from 'lucide-react-native';
import { Input } from './Input';
import Button from './Button';
import LocationPicker from './LocationPicker';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '@/constants/colors';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export const DonationForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addDonation, isLoading } = useDonationStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [expiryTime, setExpiryTime] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [pickupTime, setPickupTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [location, setLocation] = useState<LocationData | null>(null);
  
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [showPickupPicker, setShowPickupPicker] = useState(false);

  if (!user || user.role !== 'restaurant') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Only restaurants can create donations</Text>
      </View>
    );
  }

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web file picker
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setSelectedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        return;
      }

      // Native image picker
      const ImagePicker = await import('expo-image-picker');
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      if (Platform.OS === 'web') {
        Alert.alert('Not Available', 'Camera is not available on web. Please use the upload option.');
        return;
      }

      const ImagePicker = await import('expo-image-picker');
      
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const uploadImage = async (imageUri: string): Promise<string> => {
    try {
      setImageUploading(true);
      
      if (Platform.OS === 'web') {
        // For web, we'll use a placeholder URL since we can't upload files easily
        // In a real app, you'd implement proper file upload
        return imageUri;
      }

      // For native platforms, return a placeholder URL
      // In a real app, you'd upload to your storage service
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to a default image URL
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    } finally {
      setImageUploading(false);
    }
  };

  const handleLocationSelect = (selectedLocation: LocationData) => {
    setLocation(selectedLocation);
  };

  const handleSubmit = async () => {
    if (!title || !description || !selectedImage || !quantity || !location) {
      Alert.alert('Error', 'Please fill in all fields including image and location');
      return;
    }

    if (!user.id) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

    // Validate dates
    const now = new Date();
    if (expiryTime <= now) {
      Alert.alert('Error', 'Expiry time must be in the future');
      return;
    }

    if (pickupTime <= now) {
      Alert.alert('Error', 'Pickup time must be in the future');
      return;
    }

    if (pickupTime >= expiryTime) {
      Alert.alert('Error', 'Pickup time must be before expiry time');
      return;
    }

    try {
      // Upload image first
      const imageUrl = await uploadImage(selectedImage);

      const newDonation = await addDonation({
        restaurantId: user.id,
        restaurantName: user.name || 'Unknown Restaurant',
        title,
        description,
        image: imageUrl,
        quantity: parseInt(quantity, 10),
        isVegetarian,
        expiryTime: expiryTime.toISOString(),
        pickupTime: pickupTime.toISOString(),
        status: 'available',
        location,
      });

      Alert.alert('Success', 'Donation created successfully');
      router.push(`/donation/${newDonation.id}`);
    } catch (error) {
      console.error('Error creating donation:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create donation');
    }
  };

  const onExpiryChange = (event: any, selectedDate?: Date) => {
    try {
      setShowExpiryPicker(Platform.OS === 'ios');
      if (selectedDate) {
        setExpiryTime(selectedDate);
      }
    } catch (error) {
      console.error('Error setting expiry time:', error);
      setShowExpiryPicker(false);
    }
  };

  const onPickupChange = (event: any, selectedDate?: Date) => {
    try {
      setShowPickupPicker(Platform.OS === 'ios');
      if (selectedDate) {
        setPickupTime(selectedDate);
      }
    } catch (error) {
      console.error('Error setting pickup time:', error);
      setShowPickupPicker(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create New Donation</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <Input
          placeholder="e.g., Fresh Vegetable Curry"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <Input
          placeholder="Describe the food donation"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Food Image *</Text>
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePickerContainer}>
            <Text style={styles.imagePickerText}>Add a photo of your food donation</Text>
            <View style={styles.imagePickerButtons}>
              {Platform.OS !== 'web' && (
                <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
                  <Camera size={24} color={COLORS.restaurant.primary} />
                  <Text style={styles.imagePickerButtonText}>Camera</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Upload size={24} color={COLORS.restaurant.primary} />
                <Text style={styles.imagePickerButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {imageUploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="small" color={COLORS.restaurant.primary} />
            <Text style={styles.uploadingText}>Preparing image...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity (servings)</Text>
        <Input
          placeholder="e.g., 10"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Vegetarian</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{isVegetarian ? 'Yes' : 'No'}</Text>
          <Switch
            value={isVegetarian}
            onValueChange={setIsVegetarian}
            trackColor={{ false: COLORS.border, true: COLORS.restaurant.primary }}
            thumbColor={isVegetarian ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Expiry Time</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowExpiryPicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDateTime(expiryTime)}</Text>
        </TouchableOpacity>
        {showExpiryPicker && (
          <DateTimePicker
            value={expiryTime}
            mode="datetime"
            display="default"
            onChange={onExpiryChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pickup Time</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowPickupPicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDateTime(pickupTime)}</Text>
        </TouchableOpacity>
        {showPickupPicker && (
          <DateTimePicker
            value={pickupTime}
            mode="datetime"
            display="default"
            onChange={onPickupChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Pickup Location *</Text>
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLocation={location || undefined}
          style={styles.locationPicker}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        {isLoading || imageUploading ? (
          <ActivityIndicator size="large" color={COLORS.restaurant.primary} />
        ) : (
          <Button 
            title="Create Donation" 
            onPress={handleSubmit}
            userRole="restaurant"
            disabled={!location || !selectedImage}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerContainer: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  imagePickerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  imagePickerButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.restaurant.primary,
    minWidth: 80,
  },
  imagePickerButtonText: {
    fontSize: 14,
    color: COLORS.restaurant.primary,
    marginTop: 8,
    fontWeight: '600',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  uploadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  dateButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  locationPicker: {
    minHeight: 300,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DonationForm;