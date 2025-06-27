import { Platform, Linking, Alert } from 'react-native';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export const openNavigation = async (destination: Location, origin?: Location) => {
  const destinationCoords = `${destination.latitude},${destination.longitude}`;
  const originCoords = origin ? `${origin.latitude},${origin.longitude}` : '';

  let url: string;

  if (Platform.OS === 'web') {
    // Web - always use Google Maps in browser
    if (origin) {
      url = `https://www.google.com/maps/dir/${originCoords}/${destinationCoords}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${destinationCoords}`;
    }
    
    try {
      window.open(url, '_blank');
      return;
    } catch (error) {
      Alert.alert(
        'Navigation Error',
        'Unable to open navigation. Please check your internet connection.',
        [{ text: 'OK' }]
      );
      return;
    }
  }

  // Mobile platforms
  if (Platform.OS === 'ios') {
    // Use Apple Maps on iOS
    if (origin) {
      url = `maps:?saddr=${originCoords}&daddr=${destinationCoords}`;
    } else {
      url = `maps:?q=${destinationCoords}`;
    }
  } else if (Platform.OS === 'android') {
    // Use Google Maps on Android
    if (origin) {
      url = `google.navigation:q=${destinationCoords}&origin=${originCoords}`;
    } else {
      url = `geo:${destinationCoords}?q=${destinationCoords}`;
    }
  } else {
    // Fallback for other platforms
    url = `https://www.google.com/maps/search/?api=1&query=${destinationCoords}`;
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // Fallback to Google Maps web
      const webUrl = origin 
        ? `https://www.google.com/maps/dir/${originCoords}/${destinationCoords}`
        : `https://www.google.com/maps/search/?api=1&query=${destinationCoords}`;
      
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    Alert.alert(
      'Navigation Error',
      'Unable to open navigation app. Please check if you have a maps app installed.',
      [{ text: 'OK' }]
    );
  }
};

export const openLocationInMaps = async (location: Location) => {
  await openNavigation(location);
};

export const getDirections = async (from: Location, to: Location) => {
  await openNavigation(to, from);
};