import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import COLORS from '@/constants/colors';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface MapViewProps {
  locations: Location[];
  showRoute?: boolean;
  style?: any;
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
  editable?: boolean;
}

// Leaflet type definitions for web
interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  on: (event: string, handler: (e: any) => void) => void;
  fitBounds: (bounds: any) => void;
  remove: () => void;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string) => LeafletMarker;
  setIcon: (icon: any) => LeafletMarker;
}

interface LeafletPolyline {
  addTo: (map: LeafletMap) => LeafletPolyline;
}

interface LeafletFeatureGroup {
  getBounds: () => any;
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface LeafletLibrary {
  map: (element: HTMLElement) => LeafletMap;
  tileLayer: (url: string, options: any) => LeafletTileLayer;
  marker: (latlng: [number, number]) => LeafletMarker;
  divIcon: (options: any) => any;
  polyline: (latlngs: [number, number][], options: any) => LeafletPolyline;
  featureGroup: (layers: LeafletMarker[]) => LeafletFeatureGroup;
}

// Web Map Component using Leaflet and OpenStreetMap
const WebMapView: React.FC<MapViewProps> = ({
  locations,
  showRoute = false,
  style,
  onLocationSelect,
  editable = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !mapRef.current || locations.length === 0) return;

    // Dynamically load Leaflet only on web
    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
      }
    };

    const initializeMap = () => {
      // Type assertion for Leaflet library
      const L = (window as any).L as LeafletLibrary | undefined;
      
      if (!L || !mapRef.current) return;

      // Calculate center and zoom
      let center: [number, number];
      let zoom = 13;

      if (locations.length === 1) {
        center = [locations[0].latitude, locations[0].longitude];
      } else {
        // Calculate bounds
        const lats = locations.map(loc => loc.latitude);
        const lngs = locations.map(loc => loc.longitude);
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        center = [centerLat, centerLng];
        zoom = 12;
      }

      // Initialize map
      const map = L.map(mapRef.current).setView(center, zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers
      const markers: LeafletMarker[] = [];
      locations.forEach((location, index) => {
        const marker = L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(location.address);

        // Color coding for different marker types
        if (index === 0) {
          // First marker (usually pickup/restaurant)
          marker.setIcon(L.divIcon({
            className: 'custom-marker restaurant-marker',
            html: `<div style="background-color: ${COLORS.restaurant.primary}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          }));
        } else {
          // Second marker (usually dropoff/NGO)
          marker.setIcon(L.divIcon({
            className: 'custom-marker ngo-marker',
            html: `<div style="background-color: ${COLORS.ngo.primary}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          }));
        }

        markers.push(marker);
      });

      // Add route line if requested
      if (showRoute && locations.length === 2) {
        const latlngs: [number, number][] = locations.map(loc => [loc.latitude, loc.longitude]);
        L.polyline(latlngs, {
          color: COLORS.volunteer.primary,
          weight: 3,
          opacity: 0.8
        }).addTo(map);
      }

      // Handle map clicks for editable mode
      if (editable && onLocationSelect) {
        map.on('click', (e: any) => {
          onLocationSelect({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          });
        });
      }

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }

      mapInstanceRef.current = map;
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, showRoute, editable, onLocationSelect]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noLocationText}>Map not available</Text>
      </View>
    );
  }

  // Use React Native View for web instead of div to avoid CSS issues
  return (
    <View style={[styles.webMapContainer, style]}>
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: 8,
          overflow: 'hidden'
        }} 
      />
    </View>
  );
};

// Native Map Component - Simplified to avoid import issues
const NativeMapView: React.FC<MapViewProps> = (props) => {
  const {
    locations,
    style
  } = props;

  if (Platform.OS === 'web') {
    return <WebMapView {...props} />;
  }

  if (locations.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noLocationText}>No locations to display</Text>
      </View>
    );
  }

  // For native platforms, show a simple placeholder
  // In a real app, you would implement react-native-maps here
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <Text style={styles.locationText}>
          {locations[0].address}
        </Text>
        {locations.length > 1 && (
          <Text style={styles.locationText}>
            + {locations.length - 1} more location{locations.length > 2 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

export const CustomMapView: React.FC<MapViewProps> = (props) => {
  const { locations, style } = props;

  if (locations.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noLocationText}>No locations to display</Text>
      </View>
    );
  }

  // Use web map for web platform, native map for mobile
  if (Platform.OS === 'web') {
    return <WebMapView {...props} />;
  } else {
    return <NativeMapView {...props} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  webMapContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  noLocationText: {
    textAlign: 'center',
    color: COLORS.text.secondary,
    fontSize: 16,
    padding: 20,
  },
});

export default CustomMapView;