import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Clock, Navigation, Package, MapPin } from 'lucide-react-native';
import { DeliveryTask } from '@/types';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { getDirections } from '@/utils/navigation';
import COLORS from '@/constants/colors';

interface TaskCardProps {
  task: DeliveryTask;
  onPress: (task: DeliveryTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  // Format pickup time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleGetDirections = (e: any) => {
    e.stopPropagation(); // Prevent card press
    getDirections(task.route.pickupLocation, task.route.dropoffLocation);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress(task)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.taskId}>Task #{task.id.slice(-4)}</Text>
          <View style={styles.headerRight}>
            <StatusBadge status={task.status} />
            {(task.status === 'assigned' || task.status === 'in-progress') && (
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={handleGetDirections}
              >
                <Navigation size={16} color={COLORS.volunteer.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.infoItem}>
            <Package size={18} color={COLORS.restaurant.primary} />
            <Text style={styles.infoText}>Pickup from: Restaurant #{task.restaurantId}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Navigation size={18} color={COLORS.ngo.primary} />
            <Text style={styles.infoText}>Deliver to: NGO #{task.ngoId}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={18} color={COLORS.text.secondary} />
            <Text style={styles.infoText}>Pickup at: {formatTime(task.pickupTime)}</Text>
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={[styles.routeMarker, styles.startMarker]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {task.route.pickupLocation.address}
            </Text>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.routePoint}>
            <View style={[styles.routeMarker, styles.endMarker]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {task.route.dropoffLocation.address}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskId: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  directionsButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  content: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  routeContainer: {
    marginTop: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  routeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  startMarker: {
    backgroundColor: COLORS.restaurant.primary,
  },
  endMarker: {
    backgroundColor: COLORS.ngo.primary,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 5,
  },
  routeText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    flex: 1,
  },
});

export default TaskCard;