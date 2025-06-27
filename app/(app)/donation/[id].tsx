import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Navigation
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { useTaskStore } from '@/store/task-store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import CustomMapView from '@/components/ui/MapView';
import { openLocationInMaps } from '@/utils/navigation';
import COLORS from '@/constants/colors';

export default function DonationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getDonationById, claimDonation, updateDonation } = useDonationStore();
  const { createTask } = useTaskStore();
  
  const [donation, setDonation] = useState(getDonationById(id as string));
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  useEffect(() => {
    if (!donation) {
      // Donation not found, go back
      router.back();
    }
  }, [donation]);
  
  if (!donation) {
    return null;
  }
  
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
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNavigateToLocation = () => {
    openLocationInMaps(donation.location);
  };
  
  const handleClaimDonation = async () => {
    if (!user || user.role !== 'ngo') return;
    
    Alert.alert(
      "Claim Donation",
      "Are you sure you want to claim this donation?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Claim",
          onPress: async () => {
            setIsLoading(true);
            try {
              await claimDonation(donation.id, user.id);
              setDonation(getDonationById(donation.id));
            } catch (error) {
              Alert.alert("Error", "Failed to claim donation. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const handleAssignVolunteer = async () => {
    if (!user || user.role !== 'ngo') return;
    
    // In a real app, we would show a list of volunteers to choose from
    // For now, we'll just assign the first volunteer
    const volunteerId = '1';
    
    setIsLoading(true);
    try {
      // Create a new task
      await createTask({
        donationId: donation.id,
        volunteerId,
        ngoId: user.id,
        restaurantId: donation.restaurantId,
        status: 'assigned',
        pickupTime: donation.pickupTime,
        route: {
          pickupLocation: donation.location,
          dropoffLocation: {
            latitude: 37.7749,
            longitude: -122.4194,
            address: "101 Charity Lane, Anytown, CA 94108"
          }
        }
      });
      
      // Update the donation status
      await updateDonation(donation.id, {
        status: 'in-progress',
        assignedVolunteer: volunteerId
      });
      
      setDonation(getDonationById(donation.id));
      
      Alert.alert(
        "Success",
        "Volunteer assigned successfully!",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to assign volunteer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMarkAsCompleted = async () => {
    if (!user || user.role !== 'restaurant') return;
    
    Alert.alert(
      "Mark as Completed",
      "Are you sure you want to mark this donation as completed?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Complete",
          onPress: async () => {
            setIsLoading(true);
            try {
              await updateDonation(donation.id, { status: 'completed' });
              setDonation(getDonationById(donation.id));
            } catch (error) {
              Alert.alert("Error", "Failed to update donation. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Render action buttons based on user role and donation status
  const renderActionButtons = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'ngo':
        if (donation.status === 'available') {
          return (
            <Button
              title="Claim Donation"
              onPress={handleClaimDonation}
              isLoading={isLoading}
              userRole="ngo"
              style={styles.actionButton}
            />
          );
        } else if (donation.status === 'claimed' && !donation.assignedVolunteer) {
          return (
            <Button
              title="Assign Volunteer"
              onPress={handleAssignVolunteer}
              isLoading={isLoading}
              userRole="ngo"
              style={styles.actionButton}
            />
          );
        }
        break;
      
      case 'restaurant':
        if (donation.status === 'in-progress') {
          return (
            <Button
              title="Mark as Completed"
              onPress={handleMarkAsCompleted}
              isLoading={isLoading}
              userRole="restaurant"
              style={styles.actionButton}
            />
          );
        }
        break;
      
      case 'volunteer':
        // Volunteer actions would be in the task detail screen
        break;
    }
    
    return null;
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
      
      <View style={styles.header}>
        <Text style={styles.title}>{donation.title}</Text>
        <Text style={styles.restaurant}>{donation.restaurantName}</Text>
      </View>
      
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={20} color={COLORS.text.secondary} />
            <Text style={styles.infoText}>{getTimeRemaining()}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Users size={20} color={COLORS.text.secondary} />
            <Text style={styles.infoText}>{donation.quantity} meals</Text>
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={20} color={COLORS.text.secondary} />
            <Text style={styles.infoText}>Pickup: {formatDate(donation.pickupTime)}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <TouchableOpacity 
            style={styles.mapToggleButton}
            onPress={() => setShowMap(!showMap)}
          >
            <MapPin size={20} color={COLORS.text.secondary} />
            <Text style={styles.mapToggleText}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.addressContainer}>
          <MapPin size={18} color={COLORS.text.secondary} />
          <Text style={styles.addressText}>{donation.location.address}</Text>
          <TouchableOpacity 
            style={styles.navigateButton}
            onPress={handleNavigateToLocation}
          >
            <Navigation size={18} color={COLORS.volunteer.primary} />
          </TouchableOpacity>
        </View>

        {showMap && (
          <View style={styles.mapContainer}>
            <CustomMapView
              locations={[donation.location]}
              style={styles.map}
            />
          </View>
        )}
      </Card>
      
      <Card style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{donation.description}</Text>
      </Card>
      
      {donation.status === 'claimed' || donation.status === 'in-progress' ? (
        <Card style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Status Update</Text>
          
          {donation.status === 'claimed' && (
            <View style={styles.statusItem}>
              <CheckCircle2 size={20} color={COLORS.ngo.primary} />
              <Text style={styles.statusText}>
                Claimed by NGO #{donation.claimedBy}
              </Text>
            </View>
          )}
          
          {donation.status === 'in-progress' && donation.assignedVolunteer && (
            <View style={styles.statusItem}>
              <CheckCircle2 size={20} color={COLORS.volunteer.primary} />
              <Text style={styles.statusText}>
                Volunteer #{donation.assignedVolunteer} assigned for pickup
              </Text>
            </View>
          )}
        </Card>
      ) : null}
      
      {donation.status === 'expired' && (
        <Card style={[styles.statusCard, styles.warningCard]}>
          <View style={styles.statusItem}>
            <AlertCircle size={20} color={COLORS.error} />
            <Text style={[styles.statusText, { color: COLORS.error }]}>
              This donation has expired and is no longer available.
            </Text>
          </View>
        </Card>
      )}
      
      <View style={styles.actionContainer}>
        {renderActionButtons()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  mapToggleText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  navigateButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    marginTop: 8,
  },
  map: {
    height: 200,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    flex: 1,
  },
  actionContainer: {
    padding: 16,
  },
  actionButton: {
    width: '100%',
  },
});