import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Clock, MapPin, Users, Navigation } from 'lucide-react-native';
import { FoodDonation } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useDonationStore } from '@/store/donation-store';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { openLocationInMaps } from '@/utils/navigation';

interface DonationCardProps {
  donation: FoodDonation;
  onPress: (donation: FoodDonation) => void;
  animationDelay?: number;
}

export const DonationCard: React.FC<DonationCardProps> = ({ 
  donation, 
  onPress,
  animationDelay = 0
}) => {
  const { theme } = useTheme();
  const { getUserName } = useDonationStore();
  
  // Calculate time remaining until expiry
  const getTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(donation.expiryTime);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      return 'Expired';
    }
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m remaining`;
    } else {
      return `${diffMins}m remaining`;
    }
  };

  const handleNavigateToLocation = (e: any) => {
    e.stopPropagation(); // Prevent card press
    openLocationInMaps(donation.location);
  };

  // Get restaurant name from store
  const restaurantName = getUserName(donation.restaurantId);

  const styles = createStyles(theme);

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress(donation)}
      style={styles.touchable}
    >
      <Card style={styles.card} animationDelay={animationDelay}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: donation.image }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <View style={styles.badgeContainer}>
            <StatusBadge status={donation.status} />
            {donation.isVegetarian && (
              <View style={styles.vegBadge}>
                <Text style={styles.vegText}>Veg</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{donation.title}</Text>
          <Text style={styles.restaurant}>{restaurantName}</Text>
          <Text style={styles.description} numberOfLines={2}>{donation.description}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Clock size={16} color={theme.text.secondary} />
              <Text style={styles.infoText}>{getTimeRemaining()}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Users size={16} color={theme.text.secondary} />
              <Text style={styles.infoText}>{donation.quantity} meals</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={theme.text.secondary} />
              <Text style={styles.infoText} numberOfLines={1}>{donation.location.address}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.navigateButton, { backgroundColor: theme.background }]}
              onPress={handleNavigateToLocation}
            >
              <Navigation size={16} color={theme.volunteer.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  touchable: {
    marginBottom: 16,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  vegBadge: {
    backgroundColor: theme.volunteer.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vegText: {
    color: theme.text.inverse,
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 14,
    color: theme.restaurant.primary,
    marginBottom: 8,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: theme.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigateButton: {
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default DonationCard;