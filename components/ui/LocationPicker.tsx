import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { MapPin, Navigation, Search } from 'lucide-react-native';
import CustomMapView from './MapView';
import Button from './Button';
import { Input } from './Input';
import COLORS from '@/constants/colors';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  style?: any;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  style
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [addressInput, setAddressInput] = useState(initialLocation?.address || '');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
      setAddressInput(initialLocation.address);
    } else {
      // Auto-get current location on mount
      getCurrentLocation();
    }
  }, [initialLocation]);

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      // Use web geolocation API
      setIsLoadingLocation(true);
      try {
        if (!navigator.geolocation) {
          Alert.alert('Not Supported', 'Geolocation is not supported by this browser.');
          setIsLoadingLocation(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Try to get address from coordinates
            let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
              );
              const data = await response.json();
              if (data.display_name) {
                address = data.display_name;
              }
            } catch (error) {
              console.warn('Failed to reverse geocode:', error);
            }

            const locationData: LocationData = {
              latitude,
              longitude,
              address,
            };

            setSelectedLocation(locationData);
            setAddressInput(locationData.address);
            onLocationSelect(locationData);
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            Alert.alert('Error', 'Failed to get current location. Please enter address manually.');
            setIsLoadingLocation(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to get current location. Please enter address manually.');
        setIsLoadingLocation(false);
      }
      return;
    }

    // Native location handling
    setIsLoadingLocation(true);
    try {
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to get your current location.');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      try {
        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addresses.length > 0) {
          const addr = addresses[0];
          address = `${addr.street || ''} ${addr.city || ''} ${addr.region || ''} ${addr.country || ''}`.trim();
        }
      } catch (error) {
        console.warn('Failed to reverse geocode:', error);
      }
      
      const locationData: LocationData = {
        latitude,
        longitude,
        address,
      };

      setSelectedLocation(locationData);
      setAddressInput(locationData.address);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapLocationSelect = (coords: { latitude: number; longitude: number }) => {
    const locationData: LocationData = {
      ...coords,
      address: addressInput || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
    };

    setSelectedLocation(locationData);
    onLocationSelect(locationData);
  };

  const handleAddressSubmit = async () => {
    if (!addressInput.trim()) {
      Alert.alert('Error', 'Please enter an address.');
      return;
    }

    setIsLoadingLocation(true);
    try {
      if (Platform.OS === 'web') {
        // Use Nominatim for geocoding on web
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput.trim())}&limit=1`
        );
        const data = await response.json();
        
        if (data.length > 0) {
          const locationData: LocationData = {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
            address: data[0].display_name || addressInput.trim(),
          };
          setSelectedLocation(locationData);
          onLocationSelect(locationData);
        } else {
          Alert.alert('Not Found', 'Could not find the specified address. Please try a different address.');
        }
      } else {
        // Use Expo Location for geocoding on native
        const Location = await import('expo-location');
        const geocoded = await Location.geocodeAsync(addressInput.trim());
        
        if (geocoded.length > 0) {
          const locationData: LocationData = {
            latitude: geocoded[0].latitude,
            longitude: geocoded[0].longitude,
            address: addressInput.trim(),
          };
          setSelectedLocation(locationData);
          onLocationSelect(locationData);
        } else {
          Alert.alert('Not Found', 'Could not find the specified address. Please try a different address.');
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert('Error', 'Failed to find address. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Select Location</Text>
      
      <View style={styles.inputContainer}>
        <Input
          placeholder="Enter address"
          value={addressInput}
          onChangeText={setAddressInput}
          style={styles.addressInput}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleAddressSubmit}
          disabled={isLoadingLocation}
        >
          <Search size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Use Current Location"
          onPress={getCurrentLocation}
          isLoading={isLoadingLocation}
          variant="outline"
          size="small"
          style={styles.locationButton}
        />
      </View>

      {selectedLocation && (
        <View style={styles.mapContainer}>
          <CustomMapView
            locations={[selectedLocation]}
            style={styles.map}
            onLocationSelect={handleMapLocationSelect}
            editable={true}
          />
          
          <View style={styles.selectedLocationInfo}>
            <MapPin size={16} color={COLORS.text.secondary} />
            <Text style={styles.selectedLocationText} numberOfLines={2}>
              {selectedLocation.address}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.helpText}>
        {Platform.OS === 'web' 
          ? 'Click on the map to adjust the location pin'
          : 'Tap on the map to adjust the location pin'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressInput: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  locationButton: {
    alignSelf: 'flex-start',
  },
  mapContainer: {
    flex: 1,
    minHeight: 200,
  },
  map: {
    height: 200,
    marginBottom: 12,
  },
  selectedLocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedLocationText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LocationPicker;