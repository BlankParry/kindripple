import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Clock, MapPin, Users, Navigation } from 'lucide-react-native';
import { FoodDonation } from '@/types';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { openLocationInMaps } from '@/utils/navigation';
import COLORS from '@/constants/colors';

interface DonationCardProps {
  donation: FoodDonation;
  onPress: (donation: FoodDonation) => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({ donation, onPress }) => {
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

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress(donation)}
    >
      <Card style={styles.card}>
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
          <Text style={styles.restaurant}>{donation.restaurantName}</Text>
          <Text style={styles.description} numberOfLines={2}>{donation.description}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Clock size={16} color={COLORS.text.secondary} />
              <Text style={styles.infoText}>{getTimeRemaining()}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Users size={16} color={COLORS.text.secondary} />
              <Text style={styles.infoText}>{donation.quantity} meals</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={COLORS.text.secondary} />
              <Text style={styles.infoText} numberOfLines={1}>{donation.location.address}</Text>
            </View>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={handleNavigateToLocation}
            >
              <Navigation size={16} color={COLORS.volunteer.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
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
    backgroundColor: COLORS.volunteer.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vegText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
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
    color: COLORS.text.secondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigateButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
});

export default DonationCard;