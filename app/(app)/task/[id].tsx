import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  Package, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Map
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useTaskStore } from '@/store/task-store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import CustomMapView from '@/components/ui/MapView';
import { openLocationInMaps, getDirections } from '@/utils/navigation';
import COLORS from '@/constants/colors';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { getTaskById, updateTaskStatus, completeTask } = useTaskStore();
  
  const [task, setTask] = useState(getTaskById(id as string));
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  useEffect(() => {
    if (!task) {
      // Task not found, go back
      router.back();
    }
  }, [task]);
  
  if (!task) {
    return null;
  }
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleNavigateToPickup = () => {
    openLocationInMaps(task.route.pickupLocation);
  };

  const handleNavigateToDropoff = () => {
    openLocationInMaps(task.route.dropoffLocation);
  };

  const handleGetDirections = () => {
    getDirections(task.route.pickupLocation, task.route.dropoffLocation);
  };
  
  const handleStartTask = async () => {
    if (!user || user.role !== 'volunteer') return;
    
    setIsLoading(true);
    try {
      await updateTaskStatus(task.id, 'in-progress');
      setTask(getTaskById(task.id));
    } catch (error) {
      Alert.alert("Error", "Failed to start task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteTask = async () => {
    if (!user || user.role !== 'volunteer') return;
    
    Alert.alert(
      "Complete Task",
      "Are you sure you want to mark this task as completed?",
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
              await completeTask(task.id);
              setTask(getTaskById(task.id));
              
              Alert.alert(
                "Success",
                "Task completed successfully! Thank you for your contribution.",
                [{ text: "OK" }]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to complete task. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      "Emergency Contact",
      "Do you want to call emergency support?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Call",
          onPress: () => {
            if (Platform.OS !== 'web') {
              // Use tel: protocol for mobile
              import('react-native').then(({ Linking }) => {
                Linking.openURL('tel:+1234567890');
              });
            } else {
              Alert.alert('Not Available', 'Phone calls not available on web.');
            }
          }
        }
      ]
    );
  };
  
  // Render action buttons based on user role and task status
  const renderActionButtons = () => {
    if (!user || user.role !== 'volunteer') return null;
    
    switch (task.status) {
      case 'assigned':
        return (
          <View style={styles.actionButtonsContainer}>
            <Button
              title="Start Delivery"
              onPress={handleStartTask}
              isLoading={isLoading}
              userRole="volunteer"
              style={styles.actionButton}
            />
            <Button
              title="Get Directions"
              onPress={handleGetDirections}
              variant="outline"
              userRole="volunteer"
              style={styles.actionButton}
            />
          </View>
        );
      
      case 'in-progress':
        return (
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsRow}>
              <Button
                title="Navigate"
                onPress={handleGetDirections}
                variant="outline"
                userRole="volunteer"
                style={styles.actionButtonHalf}
              />
              <Button
                title="Complete"
                onPress={handleCompleteTask}
                isLoading={isLoading}
                userRole="volunteer"
                style={styles.actionButtonHalf}
              />
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Task #{task.id.slice(-4)}</Text>
          <View style={styles.statusContainer}>
            <StatusBadge status={task.status} />
          </View>
        </View>
      </View>
      
      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={20} color={COLORS.text.secondary} />
            <Text style={styles.infoText}>
              Pickup at: {formatTime(task.pickupTime)} ({formatDate(task.pickupTime)})
            </Text>
          </View>
        </View>
        
        {task.deliveryTime && (
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <CheckCircle2 size={20} color={COLORS.volunteer.primary} />
              <Text style={styles.infoText}>
                Delivered at: {formatTime(task.deliveryTime)} ({formatDate(task.deliveryTime)})
              </Text>
            </View>
          </View>
        )}
      </Card>
      
      <Card style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <Text style={styles.sectionTitle}>Delivery Route</Text>
          <TouchableOpacity 
            style={styles.mapToggleButton}
            onPress={() => setShowMap(!showMap)}
          >
            <Map size={20} color={COLORS.text.secondary} />
            <Text style={styles.mapToggleText}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={[styles.routeMarker, styles.startMarker]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeAddress}>{task.route.pickupLocation.address}</Text>
              <Text style={styles.routeSubtext}>Restaurant #{task.restaurantId}</Text>
            </View>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={handleNavigateToPickup}
            >
              <Navigation size={18} color={COLORS.restaurant.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.routePoint}>
            <View style={[styles.routeMarker, styles.endMarker]} />
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>Dropoff</Text>
              <Text style={styles.routeAddress}>{task.route.dropoffLocation.address}</Text>
              <Text style={styles.routeSubtext}>NGO #{task.ngoId}</Text>
            </View>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={handleNavigateToDropoff}
            >
              <Navigation size={18} color={COLORS.ngo.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {showMap && (
          <View style={styles.mapContainer}>
            <CustomMapView
              locations={[task.route.pickupLocation, task.route.dropoffLocation]}
              showRoute={true}
              style={styles.map}
            />
          </View>
        )}
      </Card>
      
      {(task.status === 'assigned' || task.status === 'in-progress') && (
        <Card style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Pickup Food</Text>
              <Text style={styles.stepDescription}>
                Go to the restaurant and identify yourself as a KindRipple volunteer.
                Ask for the donation package.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Verify Contents</Text>
              <Text style={styles.stepDescription}>
                Check that the food is properly packaged and matches the description.
                Ensure it is still in good condition.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Deliver to NGO</Text>
              <Text style={styles.stepDescription}>
                Transport the food to the NGO location. Handle with care to avoid spills.
                Maintain appropriate temperature if possible.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Confirm Delivery</Text>
              <Text style={styles.stepDescription}>
                Have the NGO representative confirm receipt of the donation.
                Mark the task as completed in the app.
              </Text>
            </View>
          </View>
        </Card>
      )}
      
      {(task.status === 'assigned' || task.status === 'in-progress') && (
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <AlertTriangle size={20} color="#FFFFFF" />
          <Text style={styles.emergencyText}>Emergency Contact</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  infoCard: {
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
  routeCard: {
    marginBottom: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  routeContainer: {
    marginBottom: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    marginRight: 12,
  },
  startMarker: {
    backgroundColor: COLORS.restaurant.primary,
  },
  endMarker: {
    backgroundColor: COLORS.ngo.primary,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  routeSubtext: {
    fontSize: 14,
    color: COLORS.text.light,
  },
  navigateButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    marginLeft: 8,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: COLORS.border,
    marginLeft: 7,
    marginBottom: 8,
  },
  mapContainer: {
    marginTop: 16,
  },
  map: {
    height: 250,
  },
  instructionsCard: {
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.volunteer.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  actionContainer: {
    marginTop: 8,
  },
  actionButtonsContainer: {
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButtonHalf: {
    flex: 1,
  },
});